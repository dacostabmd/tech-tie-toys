/* Dados do lounge (sem React), usados no cliente e no servidor. Extraído de Furniture.tsx. */

export type FurnitureId = 'seat' | 'sofa' | 'popcorn' | 'soda' | 'ticket' | 'table' | 'arcade' | 'plant' | 'rug' | 'rope' | 'lamp' | 'bin' | 'screen' | 'poster-rocket' | 'poster-clap' | 'neon';
export type FurnitureCategory = 'seating' | 'snack' | 'decor' | 'wall';
export type FurnitureLayer = 'rug' | 'floor' | 'wall';

export interface FurnitureDef {
  name: string;
  cat: FurnitureCategory;
  /** preço em tokens */
  price: number;
  /** tamanho em px na escala 1 (avatar de 48 px = 67 px de altura) */
  w: number;
  h: number;
  /** pegada no chão (retângulo centrado na base) usada em colisão; null = atravessável */
  foot: { w: number; d: number } | null;
  /** rug: sempre no chão, abaixo de tudo · floor: ordena por y · wall: pendurado na parede */
  layer: FurnitureLayer;
  main: string;
  accent: string;
}

/** Item colocado no lounge do jogador (é isso que vai para o banco). */
export interface PlacedFurniture {
  uid: string;
  id: FurnitureId;
  /** âncora = base central do móvel, em px do palco */
  x: number;
  y: number;
  flip?: boolean;
  /** sobrescreve --main (cor principal) */
  color?: string | null;
  /** item da base da sala: vem de graça, não sai do inventário */
  base?: boolean;
}

export const STAGE = {
  "w": 640,
  "h": 420,
  "wallH": 104
} as const;

export const FURNITURE: Record<FurnitureId, FurnitureDef> = {
  "seat": {
    "name": "Poltrona de cinema",
    "cat": "seating",
    "price": 40,
    "w": 30,
    "h": 40,
    "foot": {
      "w": 26,
      "d": 12
    },
    "layer": "floor",
    "main": "#dc2626",
    "accent": "#7f1d1d"
  },
  "sofa": {
    "name": "Sofá de veludo",
    "cat": "seating",
    "price": 90,
    "w": 76,
    "h": 46,
    "foot": {
      "w": 70,
      "d": 16
    },
    "layer": "floor",
    "main": "#7c3aed",
    "accent": "#facc15"
  },
  "popcorn": {
    "name": "Máquina de pipoca",
    "cat": "snack",
    "price": 120,
    "w": 56,
    "h": 88,
    "foot": {
      "w": 48,
      "d": 30
    },
    "layer": "floor",
    "main": "#ef4444",
    "accent": "#facc15"
  },
  "soda": {
    "name": "Máquina de refri",
    "cat": "snack",
    "price": 110,
    "w": 42,
    "h": 82,
    "foot": {
      "w": 36,
      "d": 20
    },
    "layer": "floor",
    "main": "#2563eb",
    "accent": "#e2e8f0"
  },
  "ticket": {
    "name": "Bilheteria",
    "cat": "snack",
    "price": 150,
    "w": 104,
    "h": 78,
    "foot": {
      "w": 98,
      "d": 30
    },
    "layer": "floor",
    "main": "#0d9488",
    "accent": "#facc15"
  },
  "table": {
    "name": "Mesinha com pipoca",
    "cat": "snack",
    "price": 45,
    "w": 44,
    "h": 50,
    "foot": {
      "w": 36,
      "d": 10
    },
    "layer": "floor",
    "main": "#d97706",
    "accent": "#475569"
  },
  "arcade": {
    "name": "Fliperama",
    "cat": "decor",
    "price": 130,
    "w": 44,
    "h": 84,
    "foot": {
      "w": 38,
      "d": 24
    },
    "layer": "floor",
    "main": "#7c3aed",
    "accent": "#f472b6"
  },
  "plant": {
    "name": "Planta em vaso",
    "cat": "decor",
    "price": 25,
    "w": 36,
    "h": 56,
    "foot": {
      "w": 22,
      "d": 8
    },
    "layer": "floor",
    "main": "#ea580c",
    "accent": "#22c55e"
  },
  "rug": {
    "name": "Tapete vermelho",
    "cat": "decor",
    "price": 60,
    "w": 156,
    "h": 62,
    "foot": null,
    "layer": "rug",
    "main": "#b91c1c",
    "accent": "#facc15"
  },
  "rope": {
    "name": "Cordão de fila",
    "cat": "decor",
    "price": 35,
    "w": 96,
    "h": 44,
    "foot": {
      "w": 96,
      "d": 6
    },
    "layer": "floor",
    "main": "#dc2626",
    "accent": "#facc15"
  },
  "lamp": {
    "name": "Abajur de pé",
    "cat": "decor",
    "price": 30,
    "w": 30,
    "h": 86,
    "foot": {
      "w": 14,
      "d": 6
    },
    "layer": "floor",
    "main": "#f59e0b",
    "accent": "#64748b"
  },
  "bin": {
    "name": "Lixeira",
    "cat": "decor",
    "price": 15,
    "w": 24,
    "h": 36,
    "foot": {
      "w": 20,
      "d": 8
    },
    "layer": "floor",
    "main": "#64748b",
    "accent": "#94a3b8"
  },
  "screen": {
    "name": "Telão de cinema",
    "cat": "wall",
    "price": 300,
    "w": 194,
    "h": 100,
    "foot": null,
    "layer": "wall",
    "main": "#b91c1c",
    "accent": "#1e293b"
  },
  "poster-rocket": {
    "name": "Pôster: foguete",
    "cat": "wall",
    "price": 40,
    "w": 44,
    "h": 62,
    "foot": null,
    "layer": "wall",
    "main": "#7c3aed",
    "accent": "#1e293b"
  },
  "poster-clap": {
    "name": "Pôster: clapete",
    "cat": "wall",
    "price": 40,
    "w": 44,
    "h": 62,
    "foot": null,
    "layer": "wall",
    "main": "#f43f5e",
    "accent": "#1e293b"
  },
  "neon": {
    "name": "Letreiro neon",
    "cat": "wall",
    "price": 85,
    "w": 88,
    "h": 38,
    "foot": null,
    "layer": "wall",
    "main": "#f472b6",
    "accent": "#38bdf8"
  }
};

export const FURNITURE_CATEGORIES: Record<FurnitureCategory, string> = {
  "seating": "Assentos",
  "snack": "Lanchonete",
  "decor": "Decoração",
  "wall": "Parede"
};

export const FURNITURE_COLORS = [
  "#dc2626",
  "#f97316",
  "#facc15",
  "#22c55e",
  "#0d9488",
  "#2563eb",
  "#7c3aed",
  "#f472b6",
  "#64748b",
  "#26262c"
] as const;

/** z-index para ordenar com os personagens (use Math.round(player.y) + 10 para eles). */
export function furnitureZ(p: PlacedFurniture): number {
  const layer = FURNITURE[p.id].layer;
  return layer === 'rug' ? 1 : layer === 'wall' ? 2 : Math.round(p.y) + 10;
}

/** Posição absoluta do wrapper (canto superior esquerdo) a partir da âncora. */
export function furnitureBox(p: PlacedFurniture) {
  const d = FURNITURE[p.id];
  return { left: p.x - d.w / 2, top: p.y - d.h, width: d.w, height: d.h };
}

/** Mantém o móvel dentro do palco; itens de parede ficam na faixa da parede. */
export function clampPlacement(id: FurnitureId, x: number, y: number) {
  const d = FURNITURE[id];
  const cx = Math.max(d.w / 2 + 2, Math.min(STAGE.w - d.w / 2 - 2, x));
  if (d.layer === 'wall') {
    const hi = STAGE.wallH - 2;
    const lo = Math.min(d.h + 2, hi);
    return { x: cx, y: Math.max(lo, Math.min(hi, y)) };
  }
  return { x: cx, y: Math.max(STAGE.wallH + 8, Math.min(STAGE.h - 2, y)) };
}

/** true se o ponto (pés do personagem) cai dentro da pegada de algum móvel ou fora do chão. */
export function isBlocked(placed: PlacedFurniture[], x: number, y: number): boolean {
  if (x < 14 || x > STAGE.w - 14 || y < STAGE.wallH + 12 || y > STAGE.h - 4) return true;
  return placed.some((p) => {
    const f = FURNITURE[p.id].foot;
    return !!f && Math.abs(x - p.x) < f.w / 2 + 5 && y > p.y - f.d - 1 && y < p.y + 3;
  });
}

/** Valida no servidor: itens existem, jogador possui a quantidade, posição dentro do palco, cor hex. */
export function validateLayout(placed: PlacedFurniture[], owned: Partial<Record<FurnitureId, number>>): boolean {
  const used: Partial<Record<FurnitureId, number>> = {};
  for (const p of placed) {
    if (!FURNITURE[p.id]) return false;
    used[p.id] = (used[p.id] ?? 0) + 1;
    if ((used[p.id] ?? 0) > (owned[p.id] ?? 0)) return false;
    const c = clampPlacement(p.id, p.x, p.y);
    if (c.x !== p.x || c.y !== p.y) return false;
    if (p.color && !/^#[0-9a-f]{6}$/i.test(p.color)) return false;
  }
  return true;
}
