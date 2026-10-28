import { hashPassword } from "@/server/auth";
import { createUser, getUserRowByName } from "@/server/db";
import { json, startSession } from "@/server/session";
import { LIMITS, clientIp, hit, tooMany } from "@/server/rateLimit";

export async function POST(req: Request) {
  const limit = hit(`register:${clientIp(req)}`, LIMITS.registerPerIp);
  if (!limit.ok) return tooMany(limit.retryAfterS);
  const { name, password } = (await req.json().catch(() => ({}))) as { name?: string; password?: string };
  const cleanName = String(name ?? "").trim();
  if (!/^[\p{L}\p{N}_. -]{3,24}$/u.test(cleanName)) {
    return json({ error: "Nome deve ter 3–24 caracteres (letras, números, espaços, _ . -)" }, 400);
  }
  if (String(password ?? "").length < 6) return json({ error: "Senha deve ter ao menos 6 caracteres" }, 400);
  if (getUserRowByName(cleanName)) return json({ error: "Nome já está em uso" }, 409);

  const user = createUser(cleanName, hashPassword(String(password)));
  await startSession(user.id);
  return json(user, 201);
}
