import {
  CATALOG,
  PRESETS,
  type AccessoryId,
  type CharacterConfig,
  type PresetId,
} from "@/components/character/catalog";

/** Shop item ids use the `tipo:valor` format from the design handoff (`hair:devilock`, `acc:crown`...). */
export type ItemKind = "skin" | "face" | "hair" | "top" | "acc" | "expr" | "makeup";

/** Prices in tokens. Natural skin tones, colors and lashes are always free; anything missing here costs 0. */
export const PRICES: Record<string, number> = {
  "skin:ciano": 40,
  "skin:verde": 40,
  "skin:lilas": 40,
  "face:quadrado": 10,
  "face:coracao": 10,
  "face:bochechuda": 10,
  "hair:bun": 15,
  "hair:ponytail": 15,
  "hair:bob": 15,
  "hair:pigtails": 15,
  "hair:mohawk": 25,
  "hair:spiky": 25,
  "hair:wild": 30,
  "hair:devilock": 40,
  "top:tank": 10,
  "top:shirt": 20,
  "top:bomber": 30,
  "top:robe": 35,
  "top:leather": 40,
  "acc:cap": 20,
  "acc:partyhat": 25,
  "acc:bowtie": 25,
  "acc:sunglasses": 30,
  "acc:flower": 20,
  "acc:roundglasses": 25,
  "acc:mustache": 30,
  "acc:scarf": 30,
  "acc:chain": 45,
  "acc:catears": 45,
  "acc:santahat": 50,
  "acc:headphones": 60,
  "acc:witchhat": 60,
  "acc:antennas": 70,
  "acc:crown": 120,
  "expr:surpreso": 10,
  "expr:piscadinha": 15,
  "expr:convencido": 15,
  "expr:bravo": 15,
  "makeup:corpse": 50,
};

export const priceOf = (itemId: string) => PRICES[itemId] ?? 0;

export const PRESET_IDS = Object.keys(PRESETS) as PresetId[];

export function presetConfig(id: PresetId): CharacterConfig {
  const config: CharacterConfig & { name?: string } = { ...PRESETS[id], accessories: [...(PRESETS[id].accessories ?? [])] };
  delete config.name;
  return config;
}

/** Presets with no paid items: what new users start with. */
const STARTER_PRESETS: PresetId[] = ["f1", "f2", "m1", "m2"];

export const DEFAULT_AVATAR = presetConfig("m1");

/** Deterministic preset for users created before the character system (and new sign-ups). */
export function presetFor(userId: number): CharacterConfig {
  return presetConfig(STARTER_PRESETS[userId % STARTER_PRESETS.length]);
}

/** Paid items the config uses. */
export function itemsOf(c: CharacterConfig): string[] {
  const skin = CATALOG.skins.find((s) => s.hex === c.skin.toLowerCase());
  const ids = [`skin:${skin?.id}`, `face:${c.face ?? "redondo"}`, `hair:${c.hair}`, `top:${c.top}`, `expr:${c.expression ?? "feliz"}`, `makeup:${c.makeup ?? "none"}`];
  for (const a of c.accessories ?? []) ids.push(`acc:${a}`);
  return ids.filter((id) => priceOf(id) > 0);
}

const HEX = /^#[0-9a-f]{6}$/i;
const ids = <T extends { id: string }>(list: readonly T[]) => new Set(list.map((i) => i.id));
const FACES = ids(CATALOG.faces);
const HAIRS = ids(CATALOG.hairs);
const TOPS = ids(CATALOG.tops);
const EXPRESSIONS = ids(CATALOG.expressions);
const MAKEUPS = ids(CATALOG.makeups);
const SKINS = new Set<string>(CATALOG.skins.map((s) => s.hex));
const ACC_GROUP = new Map<string, string>(CATALOG.accessories.map((a) => [a.id, a.group]));

/** Validates a config against the catalog. Returns null when any field is unknown. */
export function sanitizeAvatar(raw: unknown): CharacterConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const str = (k: string) => (typeof r[k] === "string" ? (r[k] as string) : "");
  const expression = str("expression") || "feliz";
  const makeup = str("makeup") || "none";
  const face = str("face") || "redondo";
  if (!FACES.has(face) || !HAIRS.has(str("hair")) || !TOPS.has(str("top")) || !EXPRESSIONS.has(expression) || !MAKEUPS.has(makeup)) return null;
  if (!SKINS.has(str("skin").toLowerCase())) return null;
  for (const k of ["hairColor", "topColor", "pants", "shoes"]) if (!HEX.test(str(k))) return null;

  const accessories: AccessoryId[] = [];
  const groups = new Set<string>();
  for (const a of Array.isArray(r.accessories) ? r.accessories : []) {
    const group = ACC_GROUP.get(String(a));
    if (!group) return null;
    if (groups.has(group)) continue; // one per group
    groups.add(group);
    accessories.push(a as AccessoryId);
  }

  return {
    skin: str("skin").toLowerCase(),
    face: face as CharacterConfig["face"],
    hair: str("hair") as CharacterConfig["hair"],
    hairColor: str("hairColor").toLowerCase(),
    top: str("top") as CharacterConfig["top"],
    topColor: str("topColor").toLowerCase(),
    pants: str("pants").toLowerCase(),
    shoes: str("shoes").toLowerCase(),
    makeup: makeup as CharacterConfig["makeup"],
    expression: expression as CharacterConfig["expression"],
    lashes: r.lashes === true,
    accessories,
  };
}

// Purchases from the old avatar shop carried over to the equivalent new items.
const LEGACY_ITEMS: Record<string, string> = {
  "hat:cap": "acc:cap",
  "hat:crown": "acc:crown",
  "hat:party": "acc:partyhat",
  "hat:headphones": "acc:headphones",
  "glasses:shades": "acc:sunglasses",
  "accessory:chain": "acc:chain",
  "accessory:bowtie": "acc:bowtie",
  "hair:mohawk": "hair:mohawk",
  "eyes:wink": "expr:piscadinha",
};

export function normalizeOwned(owned: string[]): string[] {
  return [...new Set(owned.map((id) => LEGACY_ITEMS[id] ?? id).filter((id) => priceOf(id) > 0))];
}

/** Tokens earned per minute connected to a social room. */
export const TOKENS_PER_MINUTE = 1;
/** Daily ceiling for time-based tokens (4 h of social rooms). */
export const DAILY_TOKEN_CAP = 240;
/** Tokens only accrue while the tab is visible and the user interacted within this window. */
export const AFK_AFTER_MS = 30 * 60_000;
