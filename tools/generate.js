// Corpo de uma função async(T, readFile, saveFile, log). Gera svg/, svg/editor/ e components/Character.tsx a partir de characters.js.
const presets = Object.keys(T.PRESETS);
const M = T.MANNEQUIN;
for (const id of presets) await saveFile('svg/tech-tie-toys-' + id + '.svg', T.svg(id, { pretty: true }) + '\n');
for (const k of T.SKINS) await saveFile('svg/editor/skin-' + k.id + '.svg', T.thumb('skin', k.hex, M));
for (const id in T.HAIRS) await saveFile('svg/editor/hair-' + id + '.svg', T.thumb('hair', id, { hairColor: T.HAIRS[id].color }));
for (const id in T.TOPS) await saveFile('svg/editor/top-' + id + '.svg', T.thumb('top', id, { topColor: T.TOPS[id].color }));
for (const id in T.ACCS) await saveFile('svg/editor/acc-' + id + '.svg', T.thumb('acc', id, M));
for (const id in T.MAKEUP) await saveFile('svg/editor/makeup-' + id + '.svg', T.thumb('makeup', id, M));
for (const id in T.EXPRESSIONS) await saveFile('svg/editor/expr-' + id + '.svg', T.thumb('expr', id, M));
for (const id in T.FACES) await saveFile('svg/editor/face-' + id + '.svg', T.thumb('face', id, M));

const camel = (k) => (k === 'class' ? 'className' : k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()));
function jsx(node, d) {
  const ind = '\n' + '  '.repeat(d);
  if (Array.isArray(node)) return node.map((x) => jsx(x, d)).join('');
  if (!node || node.slot || node.tag === 'style') return '';
  const a = Object.entries(node.attrs).filter(([k]) => k !== 'xmlns').map(([k, v]) => (typeof v === 'number' ? ' ' + camel(k) + '={' + v + '}' : ' ' + camel(k) + '="' + v + '"')).join('');
  if (!node.kids.length) return ind + '<' + node.tag + a + ' />';
  return ind + '<' + node.tag + a + '>' + node.kids.map((k) => jsx(k, d + 1)).join('') + ind + '</' + node.tag + '>';
}
const flat = (x) => [x].flat(9).filter(Boolean);
const frag = (x, d = 2) => '(<>' + jsx(flat(x), d + 1) + '\n' + '  '.repeat(d) + '</>)';
const q = (o) => JSON.stringify(o, null, 2);
const ids = (o) => Object.keys(o).map((k) => "'" + k + "'").join(' | ');
const p = T.parts;

const parts = Object.entries({ shadow: p.SHADOW, leg: p.LEG, hips: p.HIPS, ears: p.EARS, brows: p.BROWS, eyes: p.EYES, lashes: p.LASHES, nose: p.NOSE, mouth: p.MOUTH, mouthOpen: p.MOUTH_OPEN })
  .map(([k, v]) => '  ' + k + ': ' + frag(v) + ',').join('\n');
const faces = Object.keys(T.FACES).map((id) => '  ' + id + ': { skin: ' + frag(p.headSkin(id), 2) + ', corpse: ' + frag(p.corpseBase(id), 2) + ' },').join('\n');
const hairs = Object.entries(T.HAIRS).map(([id, h]) => '  ' + id + ': {\n    ears: ' + (h.ears !== false) + ',\n    back: ' + (h.back ? frag(h.back, 2) : 'null') + ',\n    front: ' + frag(h.front, 2) + ',\n  },').join('\n');
const tops = Object.entries(T.TOPS).map(([id, t]) => '  ' + id + ': {\n    torso: ' + frag(t.torso(), 2) + ',\n    arm: ' + frag(T.topArm(t), 2) + ',\n  },').join('\n');
const accs = Object.entries(T.ACCS).map(([id, a]) => '  ' + id + ": { slot: '" + a.slot + "', group: '" + a.group + "', node: " + frag(a.node, 2) + ' },').join('\n');
const exprIds = Object.keys(T.EXPRESSIONS);
const exprs = exprIds.map((id) => {
  const X = T.EXPRESSIONS[id];
  const f = (k) => (X[k] ? frag(X[k](), 2) : 'null');
  return '  ' + id + ': { brows: ' + f('brows') + ', eyes: ' + f('eyes') + ', mouth: ' + f('mouth') + ', lid: ' + !!X.eyesLid + ' },';
}).join('\n');
const lidNode = (mk) => {
  const tr = T.tree({ expression: 'convencido', makeup: mk });
  const find = (n) => { if (!n || !n.kids) return null; if (n.attrs && n.attrs.class === 'eyes') return n; for (const k of n.kids) { const r = find(k); if (r) return r; } return null; };
  return frag(find(tr).kids.slice(p.EYES.flat(9).length), 1);
};
const catalog = {
  skins: T.SKINS,
  faces: Object.entries(T.FACES).map(([id, f]) => ({ id, name: f.name })),
  hairs: Object.entries(T.HAIRS).map(([id, h]) => ({ id, name: h.name, defaultColor: h.color })),
  tops: Object.entries(T.TOPS).map(([id, t]) => ({ id, name: t.name, defaultColor: t.color })),
  accessories: Object.entries(T.ACCS).map(([id, a]) => ({ id, name: a.name, group: a.group, slot: a.slot })),
  expressions: exprIds.map((id) => ({ id, name: T.EXPRESSIONS[id].name })),
  makeups: Object.entries(T.MAKEUP).map(([id, m]) => ({ id, name: m.name })),
  hairColors: T.HAIR_COLORS,
  clothColors: T.CLOTH_COLORS,
};
const presetsTs = {};
for (const id of presets) { const c = T.resolve(id); presetsTs[id] = { name: c.name, skin: c.skin, face: c.face, hair: c.hair, hairColor: c.hairColor, top: c.top, topColor: c.topColor, pants: c.pants, shoes: c.shoes, makeup: c.makeup, expression: c.expression, lashes: c.lashes, accessories: c.accessories }; }

const tsx = `'use client';
/* Tech Tie Toys — personagens v3 (gerado de characters.js; edite lá e gere de novo). */
import * as React from 'react';

export type HairId = ${ids(T.HAIRS)};
export type TopId = ${ids(T.TOPS)};
export type AccessoryId = ${ids(T.ACCS)};
export type MakeupId = ${ids(T.MAKEUP)};
export type ExpressionId = ${ids(T.EXPRESSIONS)};
export type FaceId = ${ids(T.FACES)};
export type PresetId = ${ids(T.PRESETS)};
export type Facing = 'none' | 'left' | 'right';
export type Emote = 'none' | 'wave' | 'cheer';
export type CharacterView = 'full' | 'head' | 'bust' | 'torso' | 'neck';

export interface CharacterConfig {
  skin: string;
  face?: FaceId;
  hair: HairId;
  hairColor: string;
  top: TopId;
  topColor: string;
  pants: string;
  shoes: string;
  makeup?: MakeupId;
  expression?: ExpressionId;
  lashes?: boolean;
  accessories?: AccessoryId[];
  outline?: string;
}

export interface CharacterSlots {
  head?: React.ReactNode;
  face?: React.ReactNode;
  body?: React.ReactNode;
}

export interface CharacterProps extends Omit<React.SVGProps<SVGSVGElement>, 'children'> {
  config: CharacterConfig;
  walking?: boolean;
  talking?: boolean;
  facing?: Facing;
  /** gesto temporário: acenar ou comemorar (pulo com os braços para cima) */
  emote?: Emote;
  /** largura em px; altura = size * 1.4 no view "full" */
  size?: number;
  /** duração do ciclo de passo, ex. "0.45s" — sincronize com a velocidade no hub */
  walkCycle?: string;
  view?: CharacterView;
  staticPose?: boolean;
  /** false quando <CharacterStyles /> já foi renderizado uma vez no layout */
  withStyles?: boolean;
  slots?: CharacterSlots;
  presetId?: PresetId;
}

export const CHARACTER_CSS = \`${T.CSS}\`;

export const VIEWS: Record<CharacterView, string> = ${q(T.VIEWS)};

export const CATALOG = ${q(catalog)} as const;

export const PRESETS: Record<PresetId, CharacterConfig & { name: string }> = ${q(presetsTs)} as any;

const P = {
${parts}
};

const FACES: Record<FaceId, { skin: React.ReactNode; corpse: React.ReactNode }> = {
${faces}
};

const HAIRS: Record<HairId, { ears: boolean; back: React.ReactNode; front: React.ReactNode }> = {
${hairs}
};

const TOPS: Record<TopId, { torso: React.ReactNode; arm: React.ReactNode }> = {
${tops}
};

const ACCS: Record<AccessoryId, { slot: 'head' | 'face' | 'body'; group: string; node: React.ReactNode }> = {
${accs}
};

const EXPRESSIONS: Record<ExpressionId, { brows: React.ReactNode; eyes: React.ReactNode; mouth: React.ReactNode; lid: boolean }> = {
${exprs}
};

const LIDS = {
  skin: ${lidNode('none')},
  corpse: ${lidNode('corpse')},
};

const MAKEUP_CORPSE_MARKS = ${frag(T.MAKEUP.corpse.marks, 1)};

const MIRROR = 'matrix(-1 0 0 1 100 0)';

export function CharacterStyles() {
  return <style>{CHARACTER_CSS}</style>;
}

/** Garante um acessório por grupo (topo, orelhas, rosto, boca, pescoço, lateral). */
export function toggleAccessory(list: AccessoryId[], id: AccessoryId): AccessoryId[] {
  if (list.includes(id)) return list.filter((x) => x !== id);
  return [...list.filter((x) => ACCS[x].group !== ACCS[id].group), id];
}

export function Character({
  config,
  walking = false,
  talking = false,
  facing = 'none',
  emote = 'none',
  size = 48,
  walkCycle,
  view = 'full',
  staticPose = false,
  withStyles = true,
  slots = {},
  presetId,
  className,
  style,
  ...rest
}: CharacterProps) {
  const c = config;
  const H = HAIRS[c.hair] ?? HAIRS.short;
  const T = TOPS[c.top] ?? TOPS.tee;
  const F = FACES[c.face ?? 'redondo'] ?? FACES.redondo;
  const X = EXPRESSIONS[c.expression ?? 'feliz'] ?? EXPRESSIONS.feliz;
  const corpse = c.makeup === 'corpse';
  const accs = (c.accessories ?? []).filter((id) => ACCS[id]);
  const bySlot = (s: 'head' | 'face' | 'body') =>
    accs.filter((id) => ACCS[id].slot === s).map((id) => <g key={id} className={'acc acc-' + id}>{ACCS[id].node}</g>);
  const vb = VIEWS[view];
  const [, , vw, vh] = vb.split(' ').map(Number);
  const cls = [
    'ttt-char',
    presetId && 'ttt-' + presetId,
    view !== 'full' && 'ttt-crop',
    staticPose && 'ttt-static',
    walking && 'is-walking',
    talking && 'is-talking',
    facing === 'left' && 'is-facing-left',
    facing === 'right' && 'is-facing-right',
    emote === 'wave' && 'is-waving',
    emote === 'cheer' && 'is-cheering',
    className,
  ].filter(Boolean).join(' ');
  const vars = {
    '--skin': c.skin,
    '--hair': c.hairColor,
    '--shirt': c.topColor,
    '--pants': c.pants,
    '--shoes': c.shoes,
    '--outline': c.outline ?? '#0f172a',
    ...(walkCycle ? { '--ttt-walk': walkCycle } : {}),
  } as React.CSSProperties;
  const arm = <g transform="rotate(6 31 69)">{T.arm}</g>;
  return (
    <svg viewBox={vb} width={size} height={(size * vh) / vw} className={cls} style={{ ...vars, ...style }} aria-hidden="true" focusable="false" {...rest}>
      {withStyles && <style>{CHARACTER_CSS}</style>}
      <g className="shadow">{P.shadow}</g>
      <g className="ttt-body">
        <g className="leg-left">{P.leg}</g>
        <g className="leg-right"><g transform={MIRROR}>{P.leg}</g></g>
        <g className="bob">
          <g className="upper">
            <g className="hips">{P.hips}</g>
            <g className="torso">{T.torso}</g>
            <g className="arm-left">{arm}</g>
            <g className="arm-right"><g transform={MIRROR}>{arm}</g></g>
            <g className="head">
              <g className="head-nod">
                {H.back && <g className="hair hair-back">{H.back}</g>}
                {H.ears && P.ears}
                {F.skin}
                {corpse && <g className="makeup makeup-base">{F.corpse}</g>}
                <g className="face">
                  {corpse && <g className="makeup makeup-marks">{MAKEUP_CORPSE_MARKS}</g>}
                  <g className="brows">{X.brows ?? P.brows}</g>
                  <g className="eyes-look">
                    <g className="eyes">{X.eyes ?? P.eyes}{X.lid && (corpse ? LIDS.corpse : LIDS.skin)}{c.lashes && P.lashes}</g>
                  </g>
                  {!corpse && P.nose}
                  <g className="mouth">{X.mouth ?? P.mouth}</g>
                  <g className="mouth-open">{P.mouthOpen}</g>
                  {bySlot('face')}
                  {slots.face}
                </g>
                <g className="hair">{H.front}</g>
                {bySlot('head')}
                {slots.head}
              </g>
            </g>
            {bySlot('body')}
            {slots.body}
          </g>
        </g>
      </g>
    </svg>
  );
}

/** Atalho compatível com a v1: <CharacterPreset preset="f1" walking talking colors={{ skin, hair, shirt }} /> */
export function CharacterPreset({
  preset,
  colors,
  accessories,
  ...rest
}: Omit<CharacterProps, 'config' | 'presetId'> & {
  preset: PresetId;
  colors?: { skin?: string; hair?: string; shirt?: string; pants?: string; shoes?: string };
  accessories?: AccessoryId[];
}) {
  const p = PRESETS[preset];
  const config: CharacterConfig = {
    ...p,
    skin: colors?.skin ?? p.skin,
    hairColor: colors?.hair ?? p.hairColor,
    topColor: colors?.shirt ?? p.topColor,
    pants: colors?.pants ?? p.pants,
    shoes: colors?.shoes ?? p.shoes,
    accessories: accessories ?? p.accessories,
  };
  return <Character config={config} presetId={preset} {...rest} />;
}

export default Character;
`;
log('tsx', tsx.length);
await saveFile('components/Character.tsx', tsx);
