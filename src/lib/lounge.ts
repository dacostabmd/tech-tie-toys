import { FURNITURE, clampPlacement, type FurnitureId, type PlacedFurniture } from "@/components/lounge/catalog";

/** Free items every social room starts with. They don't count against the owner's inventory. */
export const BASE_LAYOUT: PlacedFurniture[] = [{ uid: "base-screen", id: "screen", x: 320, y: 102, base: true }];

/** Ceiling on furniture per room, so a layout stays small to store and to send. */
export const MAX_PLACED = 60;

export const isFurnitureId = (id: unknown): id is FurnitureId => typeof id === "string" && Object.hasOwn(FURNITURE, id);

export type FurnitureCounts = Partial<Record<FurnitureId, number>>;

/** How many of each paid item a layout uses (base items are free). */
export function countPlaced(layout: readonly PlacedFurniture[]): FurnitureCounts {
  const out: FurnitureCounts = {};
  for (const p of layout) if (!p.base) out[p.id] = (out[p.id] ?? 0) + 1;
  return out;
}

/** Parses the `furniture` column / API payload into clean counts; unknown ids and bad numbers are dropped. */
export function sanitizeCounts(raw: unknown): FurnitureCounts {
  const out: FurnitureCounts = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [id, n] of Object.entries(raw)) {
    if (isFurnitureId(id) && Number.isInteger(n) && (n as number) > 0) out[id] = n as number;
  }
  return out;
}

/**
 * Validates a layout sent by a client. Positions are rounded and clamped to the floor/wall instead of rejected,
 * so a drag that ends a pixel out of bounds still saves. Returns null for anything structurally wrong.
 * Ownership (inventory counts) is checked separately by the caller.
 */
export function sanitizeLayout(raw: unknown): PlacedFurniture[] | null {
  if (!Array.isArray(raw) || raw.length > MAX_PLACED) return null;
  const seen = new Set<string>();
  const out: PlacedFurniture[] = [];
  for (const r of raw) {
    if (!r || typeof r !== "object") return null;
    const p = r as Record<string, unknown>;
    if (typeof p.uid !== "string" || !/^[\w-]{1,24}$/.test(p.uid) || seen.has(p.uid)) return null;
    if (!isFurnitureId(p.id)) return null;
    const x = Number(p.x);
    const y = Number(p.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    if (p.color != null && !(typeof p.color === "string" && /^#[0-9a-f]{6}$/i.test(p.color))) return null;
    seen.add(p.uid);
    const pos = clampPlacement(p.id, Math.round(x), Math.round(y));
    const item: PlacedFurniture = { uid: p.uid, id: p.id, x: pos.x, y: pos.y };
    if (p.flip === true) item.flip = true;
    if (p.color) item.color = (p.color as string).toLowerCase();
    if (p.base === true) item.base = true;
    out.push(item);
  }
  return out;
}

/** Base items are only valid with the uid and id they ship with, so nobody mints free furniture. */
export function baseItemsValid(layout: readonly PlacedFurniture[]): boolean {
  return layout.every((p) => !p.base || BASE_LAYOUT.some((b) => b.uid === p.uid && b.id === p.id));
}
