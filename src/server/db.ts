import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { itemsOf, normalizeOwned, presetFor, sanitizeAvatar } from "@/lib/avatar";
import type { AvatarConfig, ChatMessage, Me, NowPlaying, PublicUser, QueueItem, RoomInfo, RoomMode, RoomModeration } from "@/lib/types";

// Shared by the Next.js route handlers and the Socket.IO server (server.ts).
// Each runtime opens its own connection to the same file; WAL keeps that safe.
const g = globalThis as unknown as { __tttDb?: DatabaseSync };

function open() {
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  const db = new DatabaseSync(path.join(dir, "ttt.db"));
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password TEXT NOT NULL,
      tokens INTEGER NOT NULL DEFAULT 0,
      avatar TEXT NOT NULL,
      owned TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      mode TEXT NOT NULL,
      owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS playlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS playlist_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      playlist_id INTEGER NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
      url TEXT NOT NULL,
      title TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS analyses (
      media_key TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS room_state (
      room_id TEXT PRIMARY KEY REFERENCES rooms(id) ON DELETE CASCADE,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS ratings (
      media_key TEXT NOT NULL,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      stars INTEGER NOT NULL,
      review TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (media_key, user_id)
    );
  `);
  // Migrations for databases created before these columns existed.
  const cols = new Set((db.prepare("PRAGMA table_info(users)").all() as { name: string }[]).map((c) => c.name));
  if (!cols.has("earned_day")) db.exec("ALTER TABLE users ADD COLUMN earned_day TEXT NOT NULL DEFAULT ''");
  const roomCols = new Set((db.prepare("PRAGMA table_info(rooms)").all() as { name: string }[]).map((c) => c.name));
  if (!roomCols.has("moderation")) db.exec("ALTER TABLE rooms ADD COLUMN moderation TEXT NOT NULL DEFAULT '{}'");
  if (!cols.has("earned_today")) db.exec("ALTER TABLE users ADD COLUMN earned_today INTEGER NOT NULL DEFAULT 0");
  return db;
}

export const db = (g.__tttDb ??= open());

interface UserRow {
  id: number;
  name: string;
  password: string;
  tokens: number;
  avatar: string;
  owned: string;
}

/** Old-format or broken avatars (from before the character system) get a preset. */
function parseAvatar(raw: string, userId: number): AvatarConfig {
  try {
    return sanitizeAvatar(JSON.parse(raw)) ?? presetFor(userId);
  } catch {
    return presetFor(userId);
  }
}

export function toMe(row: UserRow): Me {
  const avatar = parseAvatar(row.avatar, row.id);
  return {
    id: row.id,
    name: row.name,
    tokens: row.tokens,
    avatar,
    // What is equipped counts as owned: it was either paid for on save or is the preset the user got.
    owned: [...new Set([...normalizeOwned(JSON.parse(row.owned) as string[]), ...itemsOf(avatar)])],
  };
}

export function toPublic(me: Me): PublicUser {
  return { id: me.id, name: me.name, avatar: me.avatar };
}

export function getUserRowByName(name: string) {
  return db.prepare("SELECT * FROM users WHERE name = ?").get(name) as UserRow | undefined;
}

export function getUser(id: number): Me | null {
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;
  return row ? toMe(row) : null;
}

export function createUser(name: string, passwordHash: string): Me {
  const r = db
    // '{}' is not a valid character, so the user starts with a preset (see parseAvatar).
    .prepare("INSERT INTO users (name, password, avatar, owned) VALUES (?, ?, '{}', '[]') RETURNING id")
    .get(name, passwordHash) as { id: number };
  return getUser(r.id)!;
}

/** Adds time-based tokens up to `dailyCap` per (UTC) day. Returns the new balance, or null once the cap is reached. */
export function addTokens(userId: number, amount: number, dailyCap: number): number | null {
  const row = db
    .prepare(
      `UPDATE users SET
         tokens = tokens + ?,
         earned_today = CASE WHEN earned_day = date('now') THEN earned_today + ? ELSE ? END,
         earned_day = date('now')
       WHERE id = ? AND (earned_day != date('now') OR earned_today + ? <= ?)
       RETURNING tokens`,
    )
    .get(amount, amount, amount, userId, amount, dailyCap) as { tokens: number } | undefined;
  return row?.tokens ?? null;
}

/** Charges `cost` atomically (tokens keep accruing in rooms meanwhile). Returns the new balance, or null if short. */
export function saveAvatar(userId: number, avatar: AvatarConfig, owned: string[], cost: number): number | null {
  const row = db
    .prepare("UPDATE users SET avatar = ?, owned = ?, tokens = tokens - ? WHERE id = ? AND tokens >= ? RETURNING tokens")
    .get(JSON.stringify(avatar), JSON.stringify(owned), cost, userId, cost) as { tokens: number } | undefined;
  return row?.tokens ?? null;
}

export function listRooms(): RoomInfo[] {
  const rows = db
    .prepare(
      `SELECT r.id, r.name, r.mode, r.owner_id, r.created_at, u.name AS owner_name
       FROM rooms r JOIN users u ON u.id = r.owner_id ORDER BY r.created_at DESC LIMIT 100`,
    )
    .all() as { id: string; name: string; mode: RoomMode; owner_id: number; created_at: string; owner_name: string }[];
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    mode: r.mode,
    ownerId: r.owner_id,
    ownerName: r.owner_name,
    createdAt: r.created_at,
  }));
}

/** Queue, current video and chat of a room, so they survive restarts and deploys. */
export interface SavedRoomState {
  queue: QueueItem[];
  current: NowPlaying | null;
  chat: ChatMessage[];
}

export function loadRoomState(roomId: string): SavedRoomState | null {
  const row = db.prepare("SELECT data FROM room_state WHERE room_id = ?").get(roomId) as { data: string } | undefined;
  try {
    return row ? (JSON.parse(row.data) as SavedRoomState) : null;
  } catch {
    return null;
  }
}

export function saveRoomState(roomId: string, state: SavedRoomState) {
  db.prepare(
    `INSERT INTO room_state (room_id, data, updated_at) VALUES (?, ?, datetime('now'))
     ON CONFLICT(room_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
  ).run(roomId, JSON.stringify(state));
}

export const DEFAULT_MODERATION: RoomModeration = { enabled: true, censorStyle: "asterisk", words: [] };

export function getRoomModeration(id: string): RoomModeration {
  const row = db.prepare("SELECT moderation FROM rooms WHERE id = ?").get(id) as { moderation: string } | undefined;
  try {
    return { ...DEFAULT_MODERATION, ...(JSON.parse(row?.moderation ?? "{}") as Partial<RoomModeration>) };
  } catch {
    return DEFAULT_MODERATION;
  }
}

export function saveRoomModeration(id: string, m: RoomModeration) {
  db.prepare("UPDATE rooms SET moderation = ? WHERE id = ?").run(JSON.stringify(m), id);
}

export function getRoom(id: string): RoomInfo | null {
  const r = db
    .prepare(
      `SELECT r.id, r.name, r.mode, r.owner_id, r.created_at, u.name AS owner_name
       FROM rooms r JOIN users u ON u.id = r.owner_id WHERE r.id = ?`,
    )
    .get(id) as
    | { id: string; name: string; mode: RoomMode; owner_id: number; created_at: string; owner_name: string }
    | undefined;
  return r
    ? { id: r.id, name: r.name, mode: r.mode, ownerId: r.owner_id, ownerName: r.owner_name, createdAt: r.created_at }
    : null;
}

export function createRoom(id: string, name: string, mode: RoomMode, ownerId: number) {
  db.prepare("INSERT INTO rooms (id, name, mode, owner_id) VALUES (?, ?, ?, ?)").run(id, name, mode, ownerId);
  return getRoom(id)!;
}

export function deleteRoom(id: string) {
  db.prepare("DELETE FROM room_state WHERE room_id = ?").run(id);
  db.prepare("DELETE FROM rooms WHERE id = ?").run(id);
}

export function findRecentRoom(ownerId: number, name: string): RoomInfo | null {
  const row = db
    .prepare(
      `SELECT r.id, r.name, r.mode, r.owner_id, r.created_at, u.name AS owner_name
       FROM rooms r JOIN users u ON u.id = r.owner_id 
       WHERE r.owner_id = ? AND r.name = ? AND datetime(r.created_at) >= datetime('now', '-5 seconds')
       ORDER BY r.created_at DESC LIMIT 1`,
    )
    .get(ownerId, name) as
    | { id: string; name: string; mode: RoomMode; owner_id: number; created_at: string; owner_name: string }
    | undefined;
  return row
    ? { id: row.id, name: row.name, mode: row.mode, ownerId: row.owner_id, ownerName: row.owner_name, createdAt: row.created_at }
    : null;
}

