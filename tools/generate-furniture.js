// Corpo de uma função async(F, saveFile, log). F = window.TTTFurn. Gera svg/furniture/*.svg e components/Furniture.tsx a partir de furniture.js.
const ids = Object.keys(F.ITEMS);
for (const id of ids) await saveFile('svg/furniture/' + id + '.svg', F.svg(id, { pretty: true }) + '\n');

const camel = (k) => (k === 'class' ? 'className' : k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()));
function jsx(node, d) {
  const ind = '\n' + '  '.repeat(d);
  if (Array.isArray(node)) return node.map((x) => jsx(x, d)).join('');
  if (!node || node.tag === 'style') return '';
  const a = Object.entries(node.attrs).filter(([k]) => k !== 'xmlns').map(([k, v]) => (typeof v === 'number' ? ' ' + camel(k) + '={' + v + '}' : ' ' + camel(k) + '="' + v + '"')).join('');
  if (!node.kids.length) return ind + '<' + node.tag + a + ' />';
  return ind + '<' + node.tag + a + '>' + node.kids.map((k) => jsx(k, d + 1)).join('') + ind + '</' + node.tag + '>';
}
const frag = (id) => { const t = F.tree(id); return '(<>' + jsx(t.kids, 3) + '\n    </>)'; };
const q = (o) => JSON.stringify(o, null, 2);
const meta = {};
ids.forEach((id) => { const I = F.ITEMS[id]; meta[id] = { name: I.name, cat: I.cat, price: I.price, w: I.w, h: I.h, foot: I.foot, layer: I.layer, main: I.main, accent: I.accent }; });
const art = ids.map((id) => "  '" + id + "': " + frag(id) + ',').join('\n');

const tsx = `'use client';
/* Tech Tie Toys — móveis do Lounge (gerado de furniture.js; edite lá e gere de novo). */
import * as React from 'react';

export type FurnitureId = ${ids.map((i) => "'" + i + "'").join(' | ')};
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
}

export const STAGE = ${q(F.STAGE)} as const;

export const FURNITURE: Record<FurnitureId, FurnitureDef> = ${q(meta)};

export const FURNITURE_CATEGORIES: Record<FurnitureCategory, string> = ${q(F.CATS)};

export const FURNITURE_COLORS = ${q(F.PALETTE)} as const;

export const FURNITURE_CSS = \`${F.CSS}\`;

const ART: Record<FurnitureId, React.ReactNode> = {
${art}
};

export function FurnitureStyles() {
  return <style>{FURNITURE_CSS}</style>;
}

export interface FurnitureProps extends Omit<React.SVGProps<SVGSVGElement>, 'children'> {
  id: FurnitureId;
  /** cor principal (--main) */
  color?: string | null;
  accent?: string;
  flip?: boolean;
  /** multiplicador de tamanho (1 = px reais do hub) */
  scale?: number;
  staticPose?: boolean;
  /** false quando <FurnitureStyles /> já foi renderizado uma vez no layout */
  withStyles?: boolean;
}

export function Furniture({ id, color, accent, flip = false, scale = 1, staticPose = false, withStyles = true, className, style, ...rest }: FurnitureProps) {
  const d = FURNITURE[id];
  const vars = {
    '--main': color || d.main,
    '--accent': accent || d.accent,
    '--outline': '#0f172a',
  } as React.CSSProperties;
  const cls = ['fur', 'fur-' + id, staticPose && 'fur-static', className].filter(Boolean).join(' ');
  return (
    <svg viewBox={'0 0 ' + d.w + ' ' + d.h} width={d.w * scale} height={d.h * scale} className={cls}
      style={{ ...vars, ...(flip ? { transform: 'scaleX(-1)' } : {}), ...style }} aria-hidden="true" focusable="false" {...rest}>
      {withStyles && <style>{FURNITURE_CSS}</style>}
      {ART[id]}
    </svg>
  );
}

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

export default Furniture;
`;
log('tsx', tsx.length);
await saveFile('components/Furniture.tsx', tsx);
