import { cookies } from "next/headers";
import { SESSION_COOKIE, createSession, userFromToken } from "./auth";

/** Current user inside route handlers. */
export async function currentUser() {
  const jar = await cookies();
  return userFromToken(jar.get(SESSION_COOKIE)?.value);
}

export async function startSession(userId: number) {
  const session = createSession(userId);
  (await cookies()).set(SESSION_COOKIE, session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: session.maxAge,
  });
}

export function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function unauthorized() {
  return json({ error: "Não autenticado" }, 401);
}
