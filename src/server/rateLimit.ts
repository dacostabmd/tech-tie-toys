// In-memory sliding-window rate limiter. Enough for a single process (see deploy/README.md);
// with several instances it would need Redis.
const g = globalThis as unknown as { __tttRate?: Map<string, number[]> };
const hits = (g.__tttRate ??= new Map<string, number[]>());

let lastSweep = Date.now();
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, list] of hits) if (!list.length || now - list[list.length - 1] > 3_600_000) hits.delete(key);
}

export interface Limit {
  limit: number;
  windowMs: number;
}

/** Records a hit for `key` and tells whether it is still within the limit. */
export function hit(key: string, { limit, windowMs }: Limit): { ok: boolean; retryAfterS: number } {
  const now = Date.now();
  sweep(now);
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (list.length >= limit) {
    hits.set(key, list);
    return { ok: false, retryAfterS: Math.ceil((windowMs - (now - list[0])) / 1000) };
  }
  list.push(now);
  hits.set(key, list);
  return { ok: true, retryAfterS: 0 };
}

/** Forgets a key (e.g. after a successful login). */
export function reset(key: string) {
  hits.delete(key);
}

/** Client IP behind Nginx (X-Real-IP / X-Forwarded-For), or "local" in dev. */
export function clientIp(req: Request) {
  return req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
}

export const LIMITS = {
  loginPerAccount: { limit: 8, windowMs: 15 * 60_000 },
  loginPerIp: { limit: 30, windowMs: 15 * 60_000 },
  // Dev/E2E tests create many accounts from the same machine.
  registerPerIp: { limit: process.env.NODE_ENV === "production" ? 5 : 1000, windowMs: 60 * 60_000 },
  moderatePerUser: { limit: 20, windowMs: 60_000 },
  analyzePerUser: { limit: 10, windowMs: 60_000 },
  chatPerUser: { limit: 8, windowMs: 10_000 },
  queuePerUser: { limit: 10, windowMs: 60_000 },
  movePerSocket: { limit: 20, windowMs: 1_000 },
  modPerUser: { limit: 20, windowMs: 60_000 },
} satisfies Record<string, Limit>;

export function tooMany(retryAfterS: number) {
  return new Response(JSON.stringify({ error: `Muitas tentativas. Tente de novo em ${retryAfterS}s` }), {
    status: 429,
    headers: { "Content-Type": "application/json", "Retry-After": String(retryAfterS) },
  });
}
