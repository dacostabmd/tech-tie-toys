import { FURNITURE } from "@/components/lounge/catalog";
import { isFurnitureId } from "@/lib/lounge";
import { buyFurniture } from "@/server/db";
import { LIMITS, hit, tooMany } from "@/server/rateLimit";
import { currentUser, json, unauthorized } from "@/server/session";

/** Buys one piece of furniture with tokens. The price always comes from the server-side catalog. */
export async function POST(req: Request) {
  const me = await currentUser();
  if (!me) return unauthorized();
  const limit = hit(`furniBuy:${me.id}`, LIMITS.furniBuyPerUser);
  if (!limit.ok) return tooMany(limit.retryAfterS);
  const { id } = (await req.json().catch(() => ({}))) as { id?: unknown };
  if (!isFurnitureId(id)) return json({ error: "Móvel inexistente" }, 400);
  if (me.tokens < FURNITURE[id].price) return json({ error: `Faltam ${FURNITURE[id].price - me.tokens} tokens` }, 402);
  const res = buyFurniture(me.id, id);
  if (!res) return json({ error: "Tokens insuficientes" }, 402);
  return json({ ...me, tokens: res.tokens, furniture: res.furniture });
}
