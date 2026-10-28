import { db } from "@/server/db";
import { currentUser, json, unauthorized } from "@/server/session";

function summary(mediaKey: string, userId: number) {
  const rows = db
    .prepare(
      `SELECT r.stars, r.review, r.created_at, r.user_id, u.name FROM ratings r
       JOIN users u ON u.id = r.user_id WHERE r.media_key = ? ORDER BY r.created_at DESC LIMIT 50`,
    )
    .all(mediaKey) as { stars: number; review: string; created_at: string; user_id: number; name: string }[];
  const mine = rows.find((r) => r.user_id === userId);
  return {
    average: rows.length ? rows.reduce((s, r) => s + r.stars, 0) / rows.length : null,
    count: rows.length,
    mine: mine ? { stars: mine.stars, review: mine.review } : null,
    reviews: rows
      .filter((r) => r.review)
      .map((r) => ({ name: r.name, stars: r.stars, review: r.review, at: r.created_at })),
  };
}

export async function GET(req: Request) {
  const me = await currentUser();
  if (!me) return unauthorized();
  const key = new URL(req.url).searchParams.get("key");
  if (!key) return json({ error: "key obrigatório" }, 400);
  return json(summary(key, me.id));
}

export async function POST(req: Request) {
  const me = await currentUser();
  if (!me) return unauthorized();
  const { key, stars, review } = (await req.json().catch(() => ({}))) as {
    key?: string;
    stars?: number;
    review?: string;
  };
  const s = Math.round(Number(stars));
  if (!key || !(s >= 1 && s <= 5)) return json({ error: "Avaliação inválida" }, 400);
  db.prepare(
    `INSERT INTO ratings (media_key, user_id, stars, review) VALUES (?, ?, ?, ?)
     ON CONFLICT(media_key, user_id) DO UPDATE SET stars = excluded.stars, review = excluded.review,
     created_at = datetime('now')`,
  ).run(key, me.id, s, String(review ?? "").trim().slice(0, 1000));
  return json(summary(key, me.id));
}
