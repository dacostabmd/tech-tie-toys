import { hashPassword, verifyPassword } from "@/server/auth";
import { createUser, getUserRowByName, toMe } from "@/server/db";
import { json, startSession } from "@/server/session";
import { LIMITS, clientIp, hit, reset, tooMany } from "@/server/rateLimit";

const DEV_LOGIN = process.env.NODE_ENV !== "production";

export async function POST(req: Request) {
  const { name, password } = (await req.json().catch(() => ({}))) as { name?: string; password?: string };

  // Dev only: skip the password and create the user on first login ("dev" when no name is given).
  if (DEV_LOGIN) {
    const devName = String(name ?? "").trim() || "dev";
    const existing = getUserRowByName(devName);
    const user = existing ? toMe(existing) : createUser(devName, hashPassword(crypto.randomUUID()));
    await startSession(user.id);
    return json(user);
  }

  // Brute force: per account (any IP) and per IP (any account).
  const cleanName = String(name ?? "").trim().toLowerCase();
  const accountKey = `login:${cleanName}`;
  for (const [key, l] of [[accountKey, LIMITS.loginPerAccount], [`login-ip:${clientIp(req)}`, LIMITS.loginPerIp]] as const) {
    const limit = hit(key, l);
    if (!limit.ok) return tooMany(limit.retryAfterS);
  }

  const row = getUserRowByName(cleanName);
  if (!row || !verifyPassword(String(password ?? ""), row.password)) {
    return json({ error: "Usuário ou senha inválidos" }, 401);
  }
  reset(accountKey);
  await startSession(row.id);
  return json(toMe(row));
}
