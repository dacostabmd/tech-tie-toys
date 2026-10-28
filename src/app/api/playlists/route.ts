import { parseMediaUrl } from "@/lib/media";
import type { Playlist, PlaylistItem } from "@/lib/types";
import { db } from "@/server/db";
import { fetchMeta } from "@/server/metadata";
import { currentUser, json, unauthorized } from "@/server/session";

function load(userId: number): Playlist[] {
  const lists = db.prepare("SELECT id, name FROM playlists WHERE user_id = ? ORDER BY id").all(userId) as {
    id: number;
    name: string;
  }[];
  const items = db
    .prepare(
      `SELECT i.id, i.playlist_id, i.url, i.title FROM playlist_items i
       JOIN playlists p ON p.id = i.playlist_id WHERE p.user_id = ? ORDER BY i.id`,
    )
    .all(userId) as unknown as (PlaylistItem & { playlist_id: number })[];
  return lists.map((l) => ({
    ...l,
    items: items.filter((i) => i.playlist_id === l.id).map(({ id, url, title }) => ({ id, url, title })),
  }));
}

function owns(userId: number, playlistId: number) {
  return !!db.prepare("SELECT 1 FROM playlists WHERE id = ? AND user_id = ?").get(playlistId, userId);
}

export async function GET() {
  const me = await currentUser();
  return me ? json(load(me.id)) : unauthorized();
}

/**
 * Actions:
 *  { action: "create", name }
 *  { action: "add", playlistId, url }
 *  { action: "removeItem", playlistId, itemId }
 *  { action: "delete", playlistId }
 */
export async function POST(req: Request) {
  const me = await currentUser();
  if (!me) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as {
    action?: string;
    name?: string;
    playlistId?: number;
    itemId?: number;
    url?: string;
  };
  const playlistId = Number(body.playlistId);

  switch (body.action) {
    case "create": {
      const name = String(body.name ?? "").trim().slice(0, 60);
      if (!name) return json({ error: "Nome obrigatório" }, 400);
      db.prepare("INSERT INTO playlists (user_id, name) VALUES (?, ?)").run(me.id, name);
      break;
    }
    case "add": {
      if (!owns(me.id, playlistId)) return json({ error: "Playlist não encontrada" }, 404);
      const media = parseMediaUrl(String(body.url ?? ""));
      if (!media) return json({ error: "Link inválido" }, 400);
      const meta = await fetchMeta(media);
      db.prepare("INSERT INTO playlist_items (playlist_id, url, title) VALUES (?, ?, ?)").run(
        playlistId,
        media.url,
        meta.title,
      );
      break;
    }
    case "removeItem":
      if (!owns(me.id, playlistId)) return json({ error: "Playlist não encontrada" }, 404);
      db.prepare("DELETE FROM playlist_items WHERE id = ? AND playlist_id = ?").run(Number(body.itemId), playlistId);
      break;
    case "delete":
      db.prepare("DELETE FROM playlists WHERE id = ? AND user_id = ?").run(playlistId, me.id);
      break;
    default:
      return json({ error: "Ação inválida" }, 400);
  }
  return json(load(me.id));
}
