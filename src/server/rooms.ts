import crypto from "node:crypto";
import type { DefaultEventsMap, Server, Socket } from "socket.io";
import { parseMediaUrl } from "@/lib/media";
import { DAILY_TOKEN_CAP, DEFAULT_AVATAR, TOKENS_PER_MINUTE } from "@/lib/avatar";
import type {
  ChatMessage,
  MediaKind,
  NowPlaying,
  Presence,
  PublicUser,
  QueueItem,
  RoomInfo,
  RoomModeration,
  RoomState,
  StreamInfo,
} from "@/lib/types";
import { addTokens, deleteRoom, getRoom, getRoomModeration, getUser, loadRoomState, saveRoomModeration, saveRoomState, toPublic } from "./db";
import { SESSION_COOKIE, parseCookie, userFromToken } from "./auth";
import { fetchMeta } from "./metadata";
import { liveIdentity, liveKitConfigured, liveKitToken } from "./livekit";
import { filterProfanity } from "@/lib/profanity";
import { LIMITS, hit } from "./rateLimit";

const CHAT_HISTORY = 100;
const MAX_QUEUE = 200;
/** Used when no client reports a duration (e.g. nobody can play the media). */
const FALLBACK_DURATION_S = 15 * 60;

interface RoomRuntime {
  info: RoomInfo;
  queue: QueueItem[];
  current: NowPlaying | null;
  chat: ChatMessage[];
  presence: Map<string, Presence>;
  stream: StreamInfo | null;
  skipVotes: Set<number>;
  timer: NodeJS.Timeout | null;
  moderation: RoomModeration;
  /** userId -> timestamp until which they can't chat / can't rejoin. In memory: cleared on restart. */
  muted: Map<number, number>;
  kicked: Map<number, number>;
  saveTimer: NodeJS.Timeout | null;
  emptyTimer: NodeJS.Timeout | null;
}

/** Writes are batched: a burst of chat messages becomes one SQLite write. */
const SAVE_DEBOUNCE_MS = 1000;

function persist(r: RoomRuntime) {
  if (r.saveTimer) return;
  r.saveTimer = setTimeout(() => {
    r.saveTimer = null;
    saveRoomState(r.info.id, { queue: r.queue, current: r.current, chat: r.chat });
  }, SAVE_DEBOUNCE_MS);
}

const KICK_MS = 10 * 60_000;
const MAX_WORDS = 200;

interface SocketData {
  user: PublicUser;
  roomId?: string;
  /** Last "presence:active" heartbeat: the client only sends it while visible and not AFK. */
  activeAt?: number;
}

/** Heartbeats come every 30 s; a socket without one in this window earns nothing. */
const ACTIVE_WINDOW_MS = 75_000;

type TttSocket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>;

const rooms = new Map<string, RoomRuntime>();
const id = () => crypto.randomBytes(8).toString("hex");

function runtime(roomId: string): RoomRuntime | null {
  let r = rooms.get(roomId);
  if (r) return r;
  const info = getRoom(roomId);
  if (!info) return null;
  const saved = loadRoomState(roomId);
  r = {
    info,
    queue: saved?.queue ?? [],
    current: saved?.current ?? null,
    chat: saved?.chat ?? [],
    presence: new Map(),
    stream: null,
    skipVotes: new Set(),
    timer: null,
    moderation: getRoomModeration(roomId),
    muted: new Map(),
    kicked: new Map(),
    saveTimer: null,
    emptyTimer: null,
  };
  rooms.set(roomId, r);
  return r;
}

export function onlineCounts() {
  const out: Record<string, number> = {};
  for (const [rid, r] of rooms) out[rid] = new Set([...r.presence.values()].map((p) => p.id)).size;
  return out;
}

function snapshot(r: RoomRuntime): RoomState {
  return {
    room: r.info,
    queue: r.queue,
    current: r.current,
    chat: r.chat,
    presence: [...r.presence.values()],
    stream: r.stream,
    skipVotes: r.skipVotes.size,
    serverNow: Date.now(),
  };
}

export function attachRooms(io: Server) {
  io.use((socket, next) => {
    const me = userFromToken(parseCookie(socket.handshake.headers.cookie, SESSION_COOKIE));
    if (!me) return next(new Error("unauthorized"));
    (socket as TttSocket).data.user = toPublic(me);
    next();
  });

  const emit = (roomId: string, event: string, payload: unknown) => io.to(roomId).emit(event, payload);

  function closeRoom(roomId: string) {
    const r = rooms.get(roomId);
    if (r) {
      if (r.timer) clearTimeout(r.timer);
      if (r.saveTimer) clearTimeout(r.saveTimer);
      if (r.emptyTimer) clearTimeout(r.emptyTimer);
      rooms.delete(roomId);
    }
    deleteRoom(roomId);
    io.emit("lobby:room_closed", { roomId });
  }

  function pushChat(r: RoomRuntime, msg: Omit<ChatMessage, "id" | "at">) {
    const full: ChatMessage = { ...msg, id: id(), at: Date.now() };
    r.chat.push(full);
    persist(r);
    if (r.chat.length > CHAT_HISTORY) r.chat.shift();
    emit(r.info.id, "chat:message", full);
  }

  function system(r: RoomRuntime, text: string) {
    pushChat(r, { user: { id: 0, name: "TTT", avatar: DEFAULT_AVATAR }, text, system: true });
  }

  function schedule(r: RoomRuntime) {
    if (r.timer) clearTimeout(r.timer);
    r.timer = null;
    if (!r.current) return;
    const total = (r.current.duration ?? FALLBACK_DURATION_S) * 1000;
    const remaining = r.current.startedAt + total - Date.now();
    const itemId = r.current.item.id;
    r.timer = setTimeout(() => {
      if (r.current?.item.id === itemId) advance(r);
    }, Math.max(remaining, 0) + 1500);
  }

  function advance(r: RoomRuntime) {
    const next = r.queue.shift() ?? null;
    r.skipVotes.clear();
    r.current = next ? { item: next, startedAt: Date.now() + 1000, duration: null } : null;
    schedule(r);
    emit(r.info.id, "player:play", { current: r.current, serverNow: Date.now() });
    emit(r.info.id, "queue:update", r.queue);
    persist(r);
    if (next) system(r, `Tocando agora: ${next.title} (por ${next.addedBy.name})`);
  }

  function leave(socket: TttSocket) {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    const r = rooms.get(roomId);
    socket.leave(roomId);
    socket.data.roomId = undefined;
    if (!r) return;
    r.presence.delete(socket.id);
    if (r.stream?.socketId === socket.id) {
      r.stream = null;
      emit(roomId, "stream:update", null);
    }
    emit(roomId, "presence:update", [...r.presence.values()]);

    if (r.presence.size === 0) {
      if (r.emptyTimer) clearTimeout(r.emptyTimer);
      r.emptyTimer = setTimeout(() => {
        if (r.presence.size === 0) {
          closeRoom(roomId);
        }
      }, 2500);
    }
  }

  // Time-based gamification: every minute, active users in a social room earn tokens (up to a daily cap).
  setInterval(() => {
    const now = Date.now();
    const rewarded = new Set<number>();
    for (const r of rooms.values()) {
      if (r.info.mode !== "social") continue;
      for (const p of r.presence.values()) {
        if (rewarded.has(p.id)) continue;
        const s = io.sockets.sockets.get(p.socketId) as TttSocket | undefined;
        if (!s?.data.activeAt || now - s.data.activeAt > ACTIVE_WINDOW_MS) continue;
        rewarded.add(p.id);
        const tokens = addTokens(p.id, TOKENS_PER_MINUTE, DAILY_TOKEN_CAP);
        if (tokens === null) continue;
        for (const s of io.sockets.sockets.values()) {
          if ((s as TttSocket).data.user?.id === p.id) s.emit("tokens:update", { tokens });
        }
      }
    }
  }, 60_000);

  io.on("connection", (raw) => {
    const socket = raw as TttSocket;
    const user = () => socket.data.user;
    const room = () => (socket.data.roomId ? rooms.get(socket.data.roomId) ?? null : null);
    /** System message only this socket sees. */
    const notice = (text: string) =>
      socket.emit("chat:message", { id: id(), at: Date.now(), user: { id: 0, name: "TTT", avatar: DEFAULT_AVATAR }, text, system: true });

    socket.on("room:join", ({ roomId }: { roomId: string }, ack?: (res: { ok: boolean; error?: string }) => void) => {
      const r = runtime(String(roomId));
      if (!r) return ack?.({ ok: false, error: "Sala não encontrada" });
      const kickedUntil = r.kicked.get(user().id) ?? 0;
      if (kickedUntil > Date.now()) {
        return ack?.({ ok: false, error: `Você foi removido desta sala. Tente de novo em ${Math.ceil((kickedUntil - Date.now()) / 60_000)} min` });
      }
      leave(socket);
      // Refresh avatar in case it changed since the socket connected.
      const fresh = getUser(user().id);
      if (fresh) socket.data.user = toPublic(fresh);
      socket.join(r.info.id);
      socket.data.roomId = r.info.id;
      if (r.emptyTimer) {
        clearTimeout(r.emptyTimer);
        r.emptyTimer = null;
      }
      const presence: Presence = { ...user(), socketId: socket.id, x: 20 + Math.random() * 60, y: 30 + Math.random() * 50 };
      r.presence.set(socket.id, presence);
      // Restored from the database after a restart: resume the timer, or move on if the video already ended.
      if (r.current && !r.timer) {
        const end = r.current.startedAt + (r.current.duration ?? FALLBACK_DURATION_S) * 1000;
        if (Date.now() >= end) advance(r);
        else schedule(r);
      }
      socket.emit("room:state", snapshot(r));
      socket.to(r.info.id).emit("presence:update", [...r.presence.values()]);
      ack?.({ ok: true });
    });

    socket.on("room:leave", () => leave(socket));

    socket.on("presence:active", () => {
      socket.data.activeAt = Date.now();
    });

    socket.on("chat:send", ({ text }: { text: string }) => {
      const r = room();
      const raw = String(text ?? "").trim().slice(0, 500);
      if (!r || !raw) return;
      const mutedUntil = r.muted.get(user().id) ?? 0;
      if (mutedUntil > Date.now()) {
        return notice(`Você está silenciado nesta sala por mais ${Math.ceil((mutedUntil - Date.now()) / 60_000)} min.`);
      }
      const limit = hit(`chat:${user().id}`, LIMITS.chatPerUser);
      if (!limit.ok) return notice(`Calma! Você está enviando mensagens rápido demais. Aguarde ${limit.retryAfterS}s.`);
      const m = r.moderation;
      const { cleanText } = filterProfanity(raw, m.enabled ? m.words : [], m.censorStyle);
      pushChat(r, { user: user(), text: cleanText });
    });

    socket.on(
      "queue:add",
      async (
        { url, kind, title }: { url: string; kind?: MediaKind; title?: string },
        ack?: (res: { ok: boolean; error?: string }) => void,
      ) => {
        const r = room();
        if (!r) return ack?.({ ok: false, error: "Entre em uma sala" });
        if (r.queue.length >= MAX_QUEUE) return ack?.({ ok: false, error: "Fila cheia" });
        const limit = hit(`queue:${user().id}`, LIMITS.queuePerUser);
        if (!limit.ok) return ack?.({ ok: false, error: `Muitos vídeos seguidos. Aguarde ${limit.retryAfterS}s` });
        const media = parseMediaUrl(String(url ?? ""));
        if (!media) return ack?.({ ok: false, error: "Link inválido (YouTube ou arquivo .mp4/.webm)" });
        const meta = await fetchMeta(media);
        const item: QueueItem = {
          id: id(),
          ...media,
          ...meta,
          title: title?.trim() || meta.title,
          kind: (["auto", "music", "video", "movie"] as const).includes(kind as MediaKind) ? (kind as MediaKind) : "auto",
          addedBy: user(),
        };
        r.queue.push(item);
        emit(r.info.id, "queue:update", r.queue);
        persist(r);
        system(r, `${user().name} adicionou "${item.title}" à fila`);
        if (!r.current) advance(r);
        ack?.({ ok: true });
      },
    );

    socket.on("queue:remove", ({ itemId }: { itemId: string }) => {
      const r = room();
      if (!r) return;
      const idx = r.queue.findIndex((q) => q.id === itemId);
      if (idx < 0) return;
      const item = r.queue[idx];
      if (item.addedBy.id !== user().id && r.info.ownerId !== user().id) return;
      r.queue.splice(idx, 1);
      emit(r.info.id, "queue:update", r.queue);
      persist(r);
    });

    socket.on("queue:move", ({ itemId, delta }: { itemId: string; delta: number }) => {
      const r = room();
      if (!r || r.info.ownerId !== user().id) return;
      const idx = r.queue.findIndex((q) => q.id === itemId);
      const to = idx + Math.sign(delta);
      if (idx < 0 || to < 0 || to >= r.queue.length) return;
      [r.queue[idx], r.queue[to]] = [r.queue[to], r.queue[idx]];
      emit(r.info.id, "queue:update", r.queue);
      persist(r);
    });

    socket.on("player:duration", ({ itemId, duration }: { itemId: string; duration: number }) => {
      const r = room();
      if (!r?.current || r.current.item.id !== itemId || r.current.duration) return;
      if (!Number.isFinite(duration) || duration <= 0) return;
      r.current.duration = duration;
      schedule(r);
      persist(r);
      emit(r.info.id, "player:duration", { itemId, duration });
    });

    socket.on("player:ended", ({ itemId }: { itemId: string }) => {
      const r = room();
      if (!r?.current || r.current.item.id !== itemId) return;
      const elapsed = (Date.now() - r.current.startedAt) / 1000;
      // Only trust "ended" when it agrees with the known duration (prevents early skips).
      if (r.current.duration && elapsed >= r.current.duration - 5) advance(r);
    });

    socket.on("player:skip", () => {
      const r = room();
      if (!r?.current) return;
      const me = user();
      const isPrivileged = me.id === r.info.ownerId || me.id === r.current.item.addedBy.id;
      if (isPrivileged) {
        system(r, `${me.name} pulou o vídeo`);
        return advance(r);
      }
      r.skipVotes.add(me.id);
      const listeners = new Set([...r.presence.values()].map((p) => p.id)).size;
      emit(r.info.id, "player:skipVotes", r.skipVotes.size);
      if (r.skipVotes.size > listeners / 2) {
        system(r, "A maioria votou para pular");
        advance(r);
      }
    });

    // --- Moderation (room owner only) ---
    const ownerRoom = () => {
      const r = room();
      return r && r.info.ownerId === user().id && hit(`mod:${user().id}`, LIMITS.modPerUser).ok ? r : null;
    };

    socket.on("mod:get", (_: unknown, ack?: (res: { ok: boolean; moderation?: RoomModeration }) => void) => {
      const r = room();
      ack?.(r ? { ok: true, moderation: r.moderation } : { ok: false });
    });

    socket.on("mod:set", (input: Partial<RoomModeration>, ack?: (res: { ok: boolean; error?: string }) => void) => {
      const r = ownerRoom();
      if (!r) return ack?.({ ok: false, error: "Só o dono da sala pode mudar a moderação" });
      const words = [
        ...new Set(
          (Array.isArray(input?.words) ? input.words : [])
            .map((w) => String(w).trim().toLowerCase().slice(0, 40))
            .filter(Boolean),
        ),
      ].slice(0, MAX_WORDS);
      r.moderation = { enabled: input?.enabled !== false, censorStyle: input?.censorStyle === "censor" ? "censor" : "asterisk", words };
      saveRoomModeration(r.info.id, r.moderation);
      ack?.({ ok: true });
    });

    const targetOf = (r: RoomRuntime, userId: number) =>
      userId !== r.info.ownerId ? [...r.presence.values()].find((p) => p.id === userId) : undefined;

    socket.on("mod:mute", ({ userId, minutes }: { userId: number; minutes: number }, ack?: (res: { ok: boolean; error?: string }) => void) => {
      const r = ownerRoom();
      const target = r && targetOf(r, Number(userId));
      if (!r || !target) return ack?.({ ok: false, error: "Não foi possível silenciar" });
      const mins = Math.min(24 * 60, Math.max(0, Number(minutes) || 0));
      if (mins === 0) r.muted.delete(target.id);
      else r.muted.set(target.id, Date.now() + mins * 60_000);
      system(r, mins ? `${target.name} foi silenciado por ${mins} min` : `${target.name} pode falar de novo`);
      ack?.({ ok: true });
    });

    socket.on("mod:kick", ({ userId }: { userId: number }, ack?: (res: { ok: boolean; error?: string }) => void) => {
      const r = ownerRoom();
      const target = r && targetOf(r, Number(userId));
      if (!r || !target) return ack?.({ ok: false, error: "Não foi possível remover" });
      r.kicked.set(target.id, Date.now() + KICK_MS);
      for (const p of [...r.presence.values()].filter((p) => p.id === target.id)) {
        const s = io.sockets.sockets.get(p.socketId) as TttSocket | undefined;
        if (!s) continue;
        s.emit("room:kicked", { minutes: KICK_MS / 60_000 });
        leave(s);
      }
      system(r, `${target.name} foi removido da sala`);
      ack?.({ ok: true });
    });

    socket.on("presence:move", ({ x, y }: { x: number; y: number }) => {
      const r = room();
      const p = r?.presence.get(socket.id);
      if (!r || !p || r.info.mode !== "social") return;
      if (!hit(`move:${socket.id}`, LIMITS.movePerSocket).ok) return;
      p.x = Math.min(95, Math.max(5, Number(x) || 0));
      p.y = Math.min(90, Math.max(10, Number(y) || 0));
      emit(r.info.id, "presence:move", { socketId: socket.id, x: p.x, y: p.y });
    });

    // --- Live screen/camera: Socket.IO holds the "one broadcaster per room" lock, LiveKit carries the media ---
    socket.on("stream:start", ({ kind }: { kind: "screen" | "camera" }, ack?: (res: { ok: boolean; error?: string }) => void) => {
      const r = room();
      if (!r) return ack?.({ ok: false, error: "Sem sala" });
      if (!liveKitConfigured()) return ack?.({ ok: false, error: "Transmissão indisponível: LiveKit não configurado" });
      if (r.stream && r.stream.socketId !== socket.id) return ack?.({ ok: false, error: `${r.stream.user.name} já está transmitindo` });
      r.stream = { socketId: socket.id, user: user(), kind: kind === "camera" ? "camera" : "screen" };
      emit(r.info.id, "stream:update", r.stream);
      system(r, `${user().name} começou a transmitir ${r.stream.kind === "screen" ? "a tela" : "a câmera"}`);
      ack?.({ ok: true });
    });

    // Only the current broadcaster gets a token that can publish; everyone else can only subscribe.
    socket.on(
      "stream:token",
      async ({ publish }: { publish?: boolean }, ack?: (res: { ok: boolean; error?: string; url?: string; token?: string }) => void) => {
        const r = room();
        if (!r?.stream) return ack?.({ ok: false, error: "Nenhuma transmissão ativa" });
        const canPublish = !!publish && r.stream.socketId === socket.id;
        if (publish && !canPublish) return ack?.({ ok: false, error: "Outra pessoa está transmitindo" });
        try {
          ack?.({ ok: true, ...(await liveKitToken({ room: r.info.id, identity: liveIdentity(socket.id), name: user().name, canPublish })) });
        } catch (err) {
          console.error("[livekit]", err);
          ack?.({ ok: false, error: "Falha ao gerar acesso à transmissão" });
        }
      },
    );

    socket.on("stream:stop", () => {
      const r = room();
      if (!r || r.stream?.socketId !== socket.id) return;
      r.stream = null;
      emit(r.info.id, "stream:update", null);
    });

    socket.on("disconnect", () => leave(socket));
  });
}
