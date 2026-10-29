/* Tech Tie Toys — móveis do Lounge (cinema). Fonte única: gera svg/furniture/*.svg e components/Furniture.tsx.
   Cada viewBox = pixels reais em escala 1 (avatar de 48 px = personagem de 67 px de altura). Âncora = base central (w/2, h). */
(function (root) {
  const OUT = 'var(--outline)', W = '#f8fafc', DK = '#0f172a', MAIN = 'var(--main)', ACC = 'var(--accent)';
  const st = { stroke: OUT, 'stroke-width': 1.3, 'stroke-linejoin': 'round' };
  const n = (tag, attrs = {}, ...kids) => ({ tag, attrs, kids: kids.flat(9).filter(Boolean) });
  const g = (cls, ...k) => n('g', cls ? { class: cls } : {}, ...k);
  const P = (d, a = {}) => n('path', Object.assign({ d }, a));
  const S = (d, fill, a = {}) => P(d, Object.assign({ fill }, st, a));
  const R = (x, y, w, h, rx, fill, a = {}) => n('rect', Object.assign({ x, y, width: w, height: h, rx, fill }, st, a));
  const Rn = (x, y, w, h, rx, fill, a = {}) => n('rect', Object.assign({ x, y, width: w, height: h, rx, fill }, a));
  const C = (cx, cy, r, fill, a = {}) => n('circle', Object.assign({ cx, cy, r, fill }, st, a));
  const Cn = (cx, cy, r, fill, a = {}) => n('circle', Object.assign({ cx, cy, r, fill }, a));
  const E = (cx, cy, rx, ry, fill, a = {}) => n('ellipse', Object.assign({ cx, cy, rx, ry, fill }, st, a));
  const shade = (d, o = 0.16) => P(d, { fill: '#000', opacity: o });
  const shine = (d, o = 0.35, w = 1.4) => P(d, { fill: 'none', stroke: '#fff', 'stroke-width': w, 'stroke-linecap': 'round', opacity: o });
  const line = (d, w = 1.2, a = {}) => P(d, Object.assign({ fill: 'none', stroke: OUT, 'stroke-width': w, 'stroke-linecap': 'round' }, a));
  const shadow = (cx, cy, rx, ry = 3.2) => g('shadow', n('ellipse', { cx, cy, rx, ry, fill: '#000', opacity: 0.2 }));
  const f1 = (v) => +v.toFixed(1);
  const star = (cx, cy, Ro, r) => {
    let d = '';
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r : Ro; d += (i ? 'L' : 'M') + f1(cx + rr * Math.cos(a)) + ' ' + f1(cy + rr * Math.sin(a)) + ' '; }
    return d + 'Z';
  };
  const puff = (x, y, r = 3) => C(x, y, r, '#fff7d6', { stroke: '#b45309', 'stroke-width': 0.8 });

  const ITEMS = {
    seat: {
      name: 'Poltrona de cinema', cat: 'seating', price: 40, w: 30, h: 40, foot: { w: 26, d: 12 }, layer: 'floor', main: '#dc2626', accent: '#7f1d1d',
      draw: () => [
        shadow(15, 37, 13, 3),
        R(4, 2, 22, 24, 8, MAIN), Rn(18, 4, 7, 20, 4, '#000', { opacity: 0.12 }), shine('M8 10 Q8 6.4 11 5.4', 0.45),
        R(3, 21, 24, 13, 5, MAIN), Rn(5, 22.6, 20, 2.6, 1.3, '#fff', { opacity: 0.16 }), shade('M3.6 30 H26.4 Q26 33.4 22 33.6 H8 Q4 33.4 3.6 30Z', 0.2),
        R(0.8, 15, 6, 19, 3, ACC), R(23.2, 15, 6, 19, 3, ACC),
        Rn(5, 34, 4, 3, 1, DK), Rn(21, 34, 4, 3, 1, DK),
      ],
    },
    sofa: {
      name: 'Sofá de veludo', cat: 'seating', price: 90, w: 76, h: 46, foot: { w: 70, d: 16 }, layer: 'floor', main: '#7c3aed', accent: '#facc15',
      draw: () => [
        shadow(38, 42.5, 34, 3.4),
        Rn(7, 37, 4, 5, 1.5, ACC), Rn(65, 37, 4, 5, 1.5, ACC),
        R(5, 3, 66, 26, 10, MAIN), line('M38 8 V26', 1, { opacity: 0.3 }),
        [20, 56].map((x) => [Cn(x - 8, 12, 1.1, ACC), Cn(x, 12, 1.1, ACC), Cn(x + 8, 12, 1.1, ACC)]),
        R(12, 22, 26, 15, 5, MAIN), R(38, 22, 26, 15, 5, MAIN),
        Rn(14, 31.6, 22, 4.4, 2.2, '#000', { opacity: 0.14 }), Rn(40, 31.6, 22, 4.4, 2.2, '#000', { opacity: 0.14 }),
        Rn(14, 23.6, 22, 2.4, 1.2, '#fff', { opacity: 0.14 }), Rn(40, 23.6, 22, 2.4, 1.2, '#fff', { opacity: 0.14 }),
        R(1, 13, 13, 25, 6.5, MAIN), R(62, 13, 13, 25, 6.5, MAIN),
        shine('M5 20 Q5 16.4 8.4 15.6', 0.4), shine('M71 20 Q71 16.4 67.6 15.6', 0.25),
        shade('M10 20 H13 V36 Q11 37 10 36Z', 0.12), shade('M66 20 H63 V36 Q65 37 66 36Z', 0.12),
      ],
    },
    popcorn: {
      name: 'Máquina de pipoca', cat: 'snack', price: 120, w: 56, h: 88, foot: { w: 48, d: 30 }, layer: 'floor', main: '#ef4444', accent: '#facc15',
      draw: () => [
        shadow(28, 84.5, 24, 3.4),
        C(14, 82, 3.8, '#334155'), C(42, 82, 3.8, '#334155'),
        R(6, 50, 44, 31, 4, MAIN),
        [12, 24, 36].map((x) => Rn(x, 52, 7, 27, 0, W, { opacity: 0.92 })), Rn(44, 51, 5, 28, 0, '#000', { opacity: 0.12 }),
        R(4, 46, 48, 7, 3, ACC),
        R(9, 16, 38, 31, 4, '#e0f2fe', { 'fill-opacity': 0.55 }),
        [[16, 41], [23, 42], [30, 41], [37, 42], [43, 40], [19, 35], [26, 36], [33, 35], [40, 35], [23, 30], [31, 30], [37, 29], [27, 25], [34, 24]].map(([x, y]) => puff(x, y)),
        n('rect', Object.assign({ x: 9, y: 16, width: 38, height: 31, rx: 4, fill: 'none' }, st)), shine('M12.4 21 V35', 0.7, 1.6),
        R(6, 8, 44, 10, 4, ACC),
        [12, 20, 28, 36, 44].map((x, i) => Cn(x, 13, 1.8, '#fff', { class: i % 2 ? 'bulb bulb-b' : 'bulb bulb-a' })),
        R(26, 3, 4, 6, 1.5, ACC), C(28, 3.6, 3, MAIN),
      ],
    },
    soda: {
      name: 'Máquina de refri', cat: 'snack', price: 110, w: 42, h: 82, foot: { w: 36, d: 20 }, layer: 'floor', main: '#2563eb', accent: '#e2e8f0',
      draw: () => {
        const cols = ['#f43f5e', '#facc15', '#4ade80', '#f97316'];
        return [
          shadow(21, 78.5, 17, 3.2),
          Rn(6, 76, 6, 3, 1, DK), Rn(30, 76, 6, 3, 1, DK),
          R(3, 4, 36, 72, 6, MAIN),
          R(7, 9, 28, 40, 3, DK),
          [0, 1, 2].map((r) => [Rn(8, 21.4 + r * 12, 26, 1.4, 0, '#475569'), [0, 1, 2].map((c) => Rn(9.4 + c * 8.4, 12.4 + r * 12, 6.4, 9, 2, cols[(r + c) % 4]))]),
          shine('M10 11 V44', 0.25, 1.5),
          R(7, 53, 28, 13, 3, ACC), [13, 21, 29].map((x) => Cn(x, 59.5, 1.7, DK)),
          R(11, 69, 20, 5, 2, DK),
          shade('M32 6 H36 Q38 6 38 10 V72 Q38 75 35 75 H32Z', 0.12),
        ];
      },
    },
    ticket: {
      name: 'Bilheteria', cat: 'snack', price: 150, w: 104, h: 78, foot: { w: 98, d: 30 }, layer: 'floor', main: '#0d9488', accent: '#facc15',
      draw: () => [
        shadow(52, 74.5, 46, 3.6),
        R(4, 30, 96, 44, 5, MAIN),
        R(14, 38, 44, 22, 4, DK), Rn(16, 40, 40, 18, 3, '#fde68a'), shine('M19 44 H27', 0.6, 1.4),
        S('M66 38 H90 V50 H66Z', '#fde047', { 'stroke-width': 1.1 }), Cn(66, 44, 2.2, MAIN), Cn(90, 44, 2.2, MAIN),
        line('M72 38.6 V49.4', 1, { 'stroke-dasharray': '1.6 1.6', opacity: 0.6 }),
        shade('M94 32 H100 V70 Q100 74 96 74 H94Z', 0.14),
        R(2, 57, 100, 8, 4, ACC),
        [0, 1, 2, 3, 4].map((i) => Rn(2 + 20 * i, 10, 20, 20, 0, i % 2 ? W : MAIN)),
        [0, 1, 2, 3, 4].map((i) => S(`M${2 + 20 * i} 30 a10 10 0 0 0 20 0Z`, i % 2 ? W : MAIN)),
        n('rect', Object.assign({ x: 2, y: 10, width: 100, height: 20, fill: 'none' }, st)),
        R(0, 5, 104, 7, 3, ACC), C(52, 8.6, 2, MAIN, { 'stroke-width': 1 }),
      ],
    },
    table: {
      name: 'Mesinha com pipoca', cat: 'snack', price: 45, w: 44, h: 50, foot: { w: 36, d: 10 }, layer: 'floor', main: '#d97706', accent: '#475569',
      draw: () => [
        shadow(22, 46.5, 16, 3),
        E(22, 44, 11, 3.6, ACC), R(19.5, 24, 5, 20, 2, ACC),
        S('M2 20 V23 Q2 29 22 29 Q42 29 42 23 V20Z', MAIN), shade('M2 20 V23 Q2 29 22 29 Q42 29 42 23 V20Z', 0.22),
        E(22, 20, 20, 8, MAIN), n('ellipse', { cx: 22, cy: 20, rx: 20, ry: 8, fill: '#fff', opacity: 0.14 }),
        S('M9 9 H19 L17.6 19.4 Q17.5 20.4 16.5 20.4 H11.5 Q10.5 20.4 10.4 19.4Z', '#ef4444'), Rn(12.4, 10, 2.2, 9.6, 0, W, { opacity: 0.9 }),
        puff(11, 8, 2.8), puff(15, 6.4, 3), puff(18.6, 8.2, 2.6),
        S('M27.4 12 H35.6 L34.4 20.2 H28.6Z', W), Rn(28, 14.4, 7, 3, 0, '#38bdf8'), R(26.6, 10.4, 10, 2.6, 1.2, '#ef4444'),
        line('M32 10.4 L33.6 4.6 L36.4 3.6', 1.3),
      ],
    },
    arcade: {
      name: 'Fliperama', cat: 'decor', price: 130, w: 44, h: 84, foot: { w: 38, d: 24 }, layer: 'floor', main: '#7c3aed', accent: '#f472b6',
      draw: () => [
        shadow(22, 80.5, 18, 3.4),
        Rn(6, 77, 6, 3, 1, DK), Rn(32, 77, 6, 3, 1, DK),
        R(3, 2, 38, 76, 6, MAIN),
        R(6, 5, 32, 11, 4, ACC), P(star(22, 10.5, 4.2, 1.8), { fill: '#fff' }),
        R(7, 18, 30, 24, 3, DK), Rn(10, 21, 24, 18, 2, '#1e3a8a'),
        g('fx-pixel', [[17, 23, 3, 3], [26, 23, 3, 3], [20, 26, 6, 3], [17, 29, 12, 3], [14, 32, 3, 3], [20, 32, 6, 3], [29, 32, 3, 3]].map(([x, y, w, h]) => Rn(x, y, w, h, 0, '#4ade80'))),
        shine('M11.4 23 Q11.4 22 13 22', 0.5, 1.2),
        S('M4 45 H40 L42 57 H2Z', MAIN), shade('M4 45 H40 L42 57 H2Z', 0.28),
        C(13, 50.6, 3, '#ef4444'), C(24, 51.4, 2, '#facc15'), C(30, 51.4, 2, '#4ade80'), C(36, 50.8, 2, '#f43f5e'),
        Rn(8, 61, 28, 2.4, 1.2, ACC), R(17, 66, 10, 6, 1.5, DK), Cn(22, 69, 1, '#fde047'),
        shade('M36 6 H38 Q40 6 40 10 V72 Q40 76 36 76Z', 0.14),
      ],
    },
    plant: {
      name: 'Planta em vaso', cat: 'decor', price: 25, w: 36, h: 56, foot: { w: 22, d: 8 }, layer: 'floor', main: '#ea580c', accent: '#22c55e',
      draw: () => {
        const leaf = (cx, cy, rot) => n('ellipse', Object.assign({ cx, cy, rx: 5.2, ry: 13, fill: ACC, transform: 'rotate(' + rot + ' ' + cx + ' ' + cy + ')' }, st));
        return [
          shadow(18, 53, 12, 3),
          leaf(9, 24, -38), leaf(27, 24, 38), leaf(13, 17, -16), leaf(23, 17, 16), leaf(18, 12, 0),
          shine('M18 6 V16', 0.3, 1.2),
          S('M8 37 H28 L26 52 Q25.8 54 23.8 54 H12.2 Q10.2 54 10 52Z', MAIN),
          R(6, 32, 24, 6, 3, MAIN),
          shade('M22 38 H27.6 L25.8 52 Q25.6 53.6 23.8 53.6 H21Z', 0.15), shine('M10 41 L11 49', 0.35, 1.3),
        ];
      },
    },
    rug: {
      name: 'Tapete vermelho', cat: 'decor', price: 60, w: 156, h: 62, foot: null, layer: 'rug', main: '#b91c1c', accent: '#facc15',
      draw: () => [
        R(2, 2, 152, 58, 12, MAIN),
        n('rect', { x: 8, y: 8, width: 140, height: 46, rx: 8, fill: 'none', stroke: ACC, 'stroke-width': 2.2 }),
        n('rect', { x: 14, y: 14, width: 128, height: 34, rx: 5, fill: 'none', stroke: '#fff', opacity: 0.35, 'stroke-dasharray': '3 3', 'stroke-width': 1.2 }),
        P(star(78, 31, 12, 5), Object.assign({ fill: ACC }, st)),
        P('M36 22 L44 31 L36 40 L28 31Z M120 22 L128 31 L120 40 L112 31Z', { fill: ACC, opacity: 0.9 }),
      ],
    },
    rope: {
      name: 'Cordão de fila', cat: 'decor', price: 35, w: 96, h: 44, foot: { w: 96, d: 6 }, layer: 'floor', main: '#dc2626', accent: '#facc15',
      draw: () => {
        const post = (x) => [shadow(x, 39.6, 9, 2.2), E(x, 38, 8, 3.2, ACC), R(x - 1.8, 12, 3.6, 26, 1.5, ACC), C(x, 10, 4, ACC), shine('M' + (x - 1.6) + ' 8.6 Q' + (x - 1.2) + ' 7.6 ' + (x - 0.2) + ' 7.4', 0.7, 1.1)];
        return [post(10), post(86),
          P('M10 15 Q48 40 86 15', { fill: 'none', stroke: OUT, 'stroke-width': 6, 'stroke-linecap': 'round' }),
          P('M10 15 Q48 40 86 15', { fill: 'none', stroke: MAIN, 'stroke-width': 3.6, 'stroke-linecap': 'round' }),
          shine('M14 17.4 Q30 28 44 29.4', 0.4, 1)];
      },
    },
    lamp: {
      name: 'Abajur de pé', cat: 'decor', price: 30, w: 30, h: 86, foot: { w: 14, d: 6 }, layer: 'floor', main: '#f59e0b', accent: '#64748b',
      draw: () => [
        shadow(15, 82, 11, 3),
        n('ellipse', { cx: 15, cy: 28, rx: 14, ry: 5, fill: '#fde68a', opacity: 0.4, class: 'fx-glow' }),
        E(15, 80, 9, 3.2, ACC), R(13.4, 26, 3.2, 54, 1.4, ACC),
        S('M5 26 L9 6 H21 L25 26Z', MAIN), shade('M19 6 H21 L25 26 H22Z', 0.15), n('ellipse', { cx: 15, cy: 6, rx: 6, ry: 1.8, fill: '#fff', opacity: 0.4 }), shine('M9.4 12 L8 22', 0.45, 1.4),
      ],
    },
    bin: {
      name: 'Lixeira', cat: 'decor', price: 15, w: 24, h: 36, foot: { w: 20, d: 8 }, layer: 'floor', main: '#64748b', accent: '#94a3b8',
      draw: () => [
        shadow(12, 33.4, 10, 2.6),
        S('M4 10 H20 L18.6 31 Q18.5 32.4 17 32.4 H7 Q5.5 32.4 5.4 31Z', MAIN),
        [9.4, 12, 14.6].map((x) => line('M' + x + ' 14 L' + x + ' 28', 1, { opacity: 0.3 })),
        shade('M16 11 H20 L18.6 31 Q18.5 32.4 17 32.4 H15Z', 0.14),
        R(2, 6.6, 20, 5, 2.5, ACC),
      ],
    },
    screen: {
      name: 'Telão de cinema', cat: 'wall', price: 300, w: 194, h: 100, foot: null, layer: 'wall', main: '#b91c1c', accent: '#1e293b',
      draw: () => {
        const curtain = [S('M0 2 H26 Q18 22 23 42 Q27 62 19 82 H0Z', MAIN), line('M9 4 Q6 40 9 80', 1.4, { stroke: '#000', opacity: 0.18 }), line('M17 4 Q14 40 16 80', 1.4, { stroke: '#000', opacity: 0.18 })];
        return [
          R(8, 6, 178, 74, 4, ACC),
          Rn(16, 12, 162, 62, 2, '#7dd3fc'),
          Cn(142, 30, 10, '#fde047'), n('ellipse', { cx: 48, cy: 28, rx: 14, ry: 5, fill: '#fff', opacity: 0.9 }), n('ellipse', { cx: 58, cy: 24, rx: 9, ry: 5, fill: '#fff', opacity: 0.9 }),
          P('M16 74 V56 Q50 36 84 54 Q116 42 146 56 Q164 48 178 54 V74Z', { fill: '#4ade80' }),
          P('M16 74 V64 Q56 52 100 66 Q140 56 178 64 V74Z', { fill: '#22c55e' }),
          Cn(97, 43, 12, '#fff', { opacity: 0.92 }), P('M93 36 L104 43 L93 50Z', { fill: DK }),
          n('rect', Object.assign({ x: 16, y: 12, width: 162, height: 62, rx: 2, fill: 'none' }, st)),
          R(2, 80, 190, 12, 3, ACC),
          curtain, n('g', { transform: 'matrix(-1 0 0 1 194 0)' }, curtain),
          R(0, 0, 194, 12, 3, MAIN), Rn(1, 9.6, 192, 2.4, 0, '#facc15'),
        ];
      },
    },
    'poster-rocket': {
      name: 'Pôster: foguete', cat: 'wall', price: 40, w: 44, h: 62, foot: null, layer: 'wall', main: '#7c3aed', accent: '#1e293b',
      draw: () => [
        R(2, 2, 40, 58, 3, ACC), Rn(5, 5, 34, 52, 1.5, MAIN),
        [[10, 12], [34, 36], [11, 26], [30, 46], [16, 44]].map(([x, y]) => Cn(x, y, 0.9, '#fff')),
        Cn(30, 16, 6, '#fde047'), Cn(28, 14.4, 1.4, '#eab308'), Cn(32, 18, 1, '#eab308'),
        S('M22 20 Q29 28 29 40 H15 Q15 28 22 20Z', W, { 'stroke-width': 1 }), C(22, 31, 2.8, '#38bdf8', { 'stroke-width': 1 }),
        S('M15 36 L10 44 L15 42Z', '#f43f5e', { 'stroke-width': 1 }), S('M29 36 L34 44 L29 42Z', '#f43f5e', { 'stroke-width': 1 }),
        S('M18.6 40 L22 49 L25.4 40Z', '#fb923c', { 'stroke-width': 1, class: 'fx-glow' }),
        Rn(9, 51, 26, 2, 1, '#fff', { opacity: 0.8 }), Rn(13, 54.2, 18, 1.6, 0.8, '#fff', { opacity: 0.6 }),
      ],
    },
    'poster-clap': {
      name: 'Pôster: clapete', cat: 'wall', price: 40, w: 44, h: 62, foot: null, layer: 'wall', main: '#f43f5e', accent: '#1e293b',
      draw: () => [
        R(2, 2, 40, 58, 3, ACC), Rn(5, 5, 34, 52, 1.5, MAIN),
        P(star(22, 22, 13, 5.6), Object.assign({ fill: '#fde047' }, st, { 'stroke-width': 1.1 })),
        R(11, 40, 22, 12, 2, DK, { 'stroke-width': 1 }),
        n('g', { transform: 'rotate(-10 11 40)' }, R(11, 34, 22, 6, 1.2, W, { 'stroke-width': 1 }), [15, 21.4, 27.8].map((x) => Rn(x, 34, 3.2, 6, 0, DK))),
        Rn(14, 44, 10, 1.6, 0.8, '#fff', { opacity: 0.7 }), Rn(14, 47.4, 6, 1.6, 0.8, '#fff', { opacity: 0.5 }),
      ],
    },
    neon: {
      name: 'Letreiro neon', cat: 'wall', price: 85, w: 88, h: 38, foot: null, layer: 'wall', main: '#f472b6', accent: '#38bdf8',
      draw: () => [
        line('M20 0 V9 M68 0 V9', 1.2),
        R(4, 8, 80, 28, 8, DK),
        n('rect', { x: 9, y: 13, width: 70, height: 18, rx: 6, fill: 'none', stroke: MAIN, 'stroke-width': 6, opacity: 0.3, class: 'fx-neon' }),
        n('rect', { x: 9, y: 13, width: 70, height: 18, rx: 6, fill: 'none', stroke: MAIN, 'stroke-width': 2.4, class: 'fx-neon' }),
        P('M39 17 L39 27 L48 22Z', { fill: 'none', stroke: ACC, 'stroke-width': 2, 'stroke-linejoin': 'round', class: 'fx-neon' }),
        P(star(22, 22, 4.6, 2), { fill: 'none', stroke: ACC, 'stroke-width': 1.5, 'stroke-linejoin': 'round' }),
        P(star(66, 22, 4.6, 2), { fill: 'none', stroke: ACC, 'stroke-width': 1.5, 'stroke-linejoin': 'round' }),
      ],
    },
  };

  const CATS = { seating: 'Assentos', snack: 'Lanchonete', decor: 'Decoração', wall: 'Parede' };
  const PALETTE = ['#dc2626', '#f97316', '#facc15', '#22c55e', '#0d9488', '#2563eb', '#7c3aed', '#f472b6', '#64748b', '#26262c'];
  const STAGE = { w: 640, h: 420, wallH: 104 };

  const CSS = `.fur{overflow:visible}
.fur .bulb-a{animation:fur-bulb 1.2s step-end infinite}
.fur .bulb-b{animation:fur-bulb 1.2s step-end -.6s infinite}
.fur .fx-neon{animation:fur-neon 3.4s linear infinite}
.fur .fx-glow{animation:fur-glow 4s ease-in-out infinite}
.fur .fx-pixel{transform-box:fill-box;animation:fur-pixel 1s step-end infinite}
.fur-static *{animation:none!important}
@keyframes fur-bulb{0%{opacity:1}50%{opacity:.25}}
@keyframes fur-neon{0%,60%,64%,100%{opacity:1}62%{opacity:.45}}
@keyframes fur-glow{0%,100%{opacity:.4}50%{opacity:.6}}
@keyframes fur-pixel{0%{transform:translateX(0)}50%{transform:translateX(2px)}}
@media (prefers-reduced-motion:reduce){.fur *{animation:none!important}}`;

  const flat = (x) => [x].flat(9).filter(Boolean);
  function tree(id, opts = {}) {
    const I = ITEMS[id];
    return n('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 ' + I.w + ' ' + I.h, class: ['fur', 'fur-' + id, opts.static && 'fur-static'].filter(Boolean).join(' ') },
      n('style', {}, CSS), flat(I.draw()));
  }
  function toSVG(node, d = 0, pretty = false) {
    if (typeof node === 'string') return node;
    const ind = pretty ? '\n' + '  '.repeat(d) : '';
    const a = Object.entries(node.attrs).map(([k, v]) => ' ' + k + '="' + v + '"').join('');
    if (node.tag === 'style') return ind + '<style>' + node.kids.join('') + '</style>';
    if (!node.kids.length) return ind + '<' + node.tag + a + '/>';
    return ind + '<' + node.tag + a + '>' + node.kids.map((k) => toSVG(k, d + 1, pretty)).join('') + ind + '</' + node.tag + '>';
  }
  function svg(id, opts = {}) {
    const I = ITEMS[id], col = { main: opts.color || I.main, accent: opts.accent || I.accent, outline: '#0f172a' };
    return toSVG(tree(id, opts), 0, !!opts.pretty).trim().replace(/var\(--(main|accent|outline)\)/g, (m, k) => 'var(--' + k + ', ' + col[k] + ')');
  }

  root.TTTFurn = { ITEMS, CATS, PALETTE, STAGE, CSS, tree, toSVG, svg };
})(typeof window !== 'undefined' ? window : globalThis);
