import { itemsOf, priceOf, sanitizeAvatar } from "@/lib/avatar";
import { saveAvatar } from "@/server/db";
import { currentUser, json, unauthorized } from "@/server/session";

/** Save the whole character, buying any paid item it uses that the user doesn't own yet. */
export async function POST(req: Request) {
  const me = await currentUser();
  if (!me) return unauthorized();
  const { avatar: raw } = (await req.json().catch(() => ({}))) as { avatar?: unknown };
  const avatar = sanitizeAvatar(raw);
  if (!avatar) return json({ error: "Personagem inválido" }, 400);

  const owned = new Set(me.owned);
  const missing = itemsOf(avatar).filter((id) => !owned.has(id));
  const cost = missing.reduce((sum, id) => sum + priceOf(id), 0);
  if (cost > me.tokens) return json({ error: `Faltam ${cost - me.tokens} tokens` }, 402);

  for (const id of missing) owned.add(id);
  const tokens = saveAvatar(me.id, avatar, [...owned], cost);
  if (tokens === null) return json({ error: "Tokens insuficientes" }, 402);
  return json({ ...me, tokens, owned: [...owned], avatar });
}
