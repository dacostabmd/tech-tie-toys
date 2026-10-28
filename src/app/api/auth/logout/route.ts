import { cookies } from "next/headers";
import { SESSION_COOKIE, deleteSession } from "@/server/auth";
import { json } from "@/server/session";

export async function POST() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) deleteSession(token);
  jar.delete(SESSION_COOKIE);
  return json({ ok: true });
}
