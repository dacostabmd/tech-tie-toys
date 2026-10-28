/* Tech Tie Toys — personagens v2. Fonte única: gera os .svg, o editor e o .tsx. */
(function (root) {
  const SW = 2.2, OUT = 'var(--outline)', W = '#f8fafc', INK = '#0b0b10';
  const st = { stroke: OUT, 'stroke-width': SW, 'stroke-linejoin': 'round' };
  const n = (tag, attrs = {}, ...kids) => ({ tag, attrs, kids: kids.flat(9).filter(Boolean) });
  const g = (cls, ...kids) => n('g', cls ? { class: cls } : {}, ...kids);
  const mirror = (...k) => n('g', { transform: 'matrix(-1 0 0 1 100 0)' }, ...k);
  const P = (d, a = {}) => n('path', Object.assign({ d }, a));
  const S = (d, fill, a = {}) => P(d, Object.assign({ fill }, st, a));
  const shade = (d, o = 0.16) => P(d, { fill: '#000', opacity: o });
  const shine = (d, o = 0.3, w = 1.8) => P(d, { fill: 'none', stroke: '#fff', 'stroke-width': w, 'stroke-linecap': 'round', opacity: o });
  const line = (d, w = 1.6, a = {}) => P(d, Object.assign({ fill: 'none', stroke: OUT, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, a));
  const circ = (cx, cy, r, fill, a = {}) => n('circle', Object.assign({ cx, cy, r, fill }, a));
  const rect = (x, y, w, h, rx, fill, a = {}) => n('rect', Object.assign({ x, y, width: w, height: h, rx, fill }, a));
  const slot = (name) => ({ slot: name });
  const f1 = (v) => +v.toFixed(1);
  const SKIN = 'var(--skin)', HAIR = 'var(--hair)', TOP = 'var(--shirt)';

  // ---------- corpo ----------
  const SHADOW = n('ellipse', { cx: 50, cy: 130.6, rx: 20, ry: 4.2, fill: '#000', opacity: 0.32 });
  const LEG = [
    rect(38, 100, 11, 22, 5, 'var(--pants)', st),
    rect(45, 101.5, 2.6, 18, 1.3, '#000', { opacity: 0.13 }),
    S('M35 126.5 Q35 120 40.5 120 H46 Q49.6 120 49.6 123.6 V127 Q49.6 130 46.8 130 H38 Q35 130 35 127.5Z', 'var(--shoes)'),
    P('M36.1 127.2 H48.5 V127.6 Q48.5 128.9 46.8 128.9 H38 Q36.1 128.9 36.1 127.8Z', { fill: '#000', opacity: 0.22 }),
    shine('M38.8 122.6 H42.6', 0.55, 1.5),
  ];
  const HIPS = [
    S('M34.5 95 H65.5 L64.8 105 Q64.5 108.5 60.5 108.5 H39.5 Q35.5 108.5 35.2 105Z', 'var(--pants)'),
    line('M50 101 V108', 1.3, { opacity: 0.45 }),
  ];
  const TORSO_D = 'M38 66 H62 Q69.5 66 69.8 73.5 L67.3 98 Q66.8 104 60.5 104 H39.5 Q33.2 104 32.7 98 L30.2 73.5 Q30.5 66 38 66Z';
  const torso = () => S(TORSO_D, TOP);
  const torsoShade = () => shade('M63.6 67.3 Q68.4 68 68.6 73.6 L66.1 97.8 Q65.7 102.8 60.5 102.9 H58.6 Q64.6 90 63.6 67.3Z', 0.13);
  const hem = () => shade('M32.9 98.2 Q33.3 104 39.5 104 H60.5 Q66.7 104 67.1 98.2Z', 0.16);
  const crew = () => [S('M43.4 66.4 Q50 72.6 56.6 66.4Z', SKIN), line('M42.6 66.6 Q50 74.2 57.4 66.6', 1.2, { opacity: 0.35 })];
  const xl = (y) => 30.2 + ((y - 73.5) * 2.5) / 24.5 + 1.3;
  const band = (y, h, fill, o = 0.92) => P(`M${f1(xl(y))} ${y} H${f1(100 - xl(y))} L${f1(100 - xl(y + h))} ${y + h} H${f1(xl(y + h))}Z`, { fill, opacity: o });
  const star = (cx, cy, R, r) => {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r : R;
      d += (i ? 'L' : 'M') + f1(cx + rr * Math.cos(a)) + ' ' + f1(cy + rr * Math.sin(a)) + ' ';
    }
    return d + 'Z';
  };

  // braços (ombro em 31,69; abertura estática de 6°)
  const armSkin = () => rect(26.5, 70, 9, 22, 4.5, SKIN, st);
  const hand = () => [circ(31, 93, 4.8, SKIN, st), shine('M28.6 91.4 Q29.6 90 31 89.8', 0.3, 1.2)];
  const sleeveShort = (extra) => [rect(25, 66.5, 12, 12.5, 5.5, TOP, st), rect(33, 68.2, 2.6, 9.4, 1.3, '#000', { opacity: 0.12 }), extra];
  const sleeveLong = (extra) => [rect(25.8, 66.5, 10.4, 24, 5.2, TOP, st), rect(32.6, 68.4, 2.4, 20, 1.2, '#000', { opacity: 0.12 }), extra];
  const cuff = () => rect(26.9, 85.2, 8.2, 4.2, 1.6, '#000', { opacity: 0.18 });
  const arms = {
    short: (x) => [armSkin(), hand(), sleeveShort(x)],
    long: (x) => [sleeveLong(x), hand()],
    none: () => [armSkin(), shade('M33 72 V90', 0), hand()],
  };

  // ---------- rosto ----------
  const EARS = [0, 1].map((m) => {
    const e = [n('ellipse', Object.assign({ cx: 26.5, cy: 48, rx: 4.2, ry: 5, fill: SKIN }, st)), P('M26 45.6 Q24.2 48 26 50.6', { fill: 'none', stroke: '#000', 'stroke-width': 1.2, opacity: 0.2, 'stroke-linecap': 'round' })];
    return m ? mirror(e) : e;
  });
  const FACES = {
    redondo: { name: 'Redondo', bottom: 'A24 22.5 0 0 1 26 44Z' },
    oval: { name: 'Oval', bottom: 'C72 57 62 66.8 50 66.8 C38 66.8 28 57 26 44Z' },
    quadrado: { name: 'Quadrado', bottom: 'L74 52 Q74 66.4 62 66.4 H38 Q26 66.4 26 52Z' },
    coracao: { name: 'Coração', bottom: 'C75 53 64 61 50 67.8 C36 61 25 53 26 44Z' },
    bochechuda: { name: 'Bochechuda', bottom: 'C79 54 68 65.6 50 65.6 C32 65.6 21 54 26 44Z' },
  };
  const faceId = (id) => (FACES[id] ? id : 'redondo');
  const faceD = (id) => 'M26 44 A24 22.5 0 0 1 74 44 ' + FACES[faceId(id)].bottom;
  const faceClip = (id) => n('defs', {}, n('clipPath', { id: 'ttt-hc-' + faceId(id) }, P(faceD(id))));
  const faceShade = (id, base, o) => n('g', { 'clip-path': 'url(#ttt-hc-' + faceId(id) + ')' }, P(faceD(id), { fill: '#000', opacity: o }), P(faceD(id), { fill: base, transform: 'translate(-2.4 -1.8)' }));
  const headSkin = (id) => [n('path', Object.assign({ d: faceD(id), fill: SKIN }, st)), faceClip(id), faceShade(id, SKIN, 0.1)];
  const corpseBase = (id) => n('g', { transform: 'translate(50 44.5) scale(.95) translate(-50 -44.5)' }, P(faceD(id), { fill: '#eef2f7' }), faceShade(id, '#eef2f7', 0.08));
  const BROWS = [line('M36.8 41.2 Q40.5 39.4 44.2 40.8', 1.9, { opacity: 0.85 }), line('M55.8 40.8 Q59.5 39.4 63.2 41.2', 1.9, { opacity: 0.85 })];
  const EYES = [40.5, 59.5].map((x) => [
    n('ellipse', { cx: x, cy: 49, rx: 3.3, ry: 4.1, fill: OUT }),
    circ(x + 1.2, 47.4, 1.35, '#fff'),
    circ(x - 1, 50.7, 0.6, '#fff', { opacity: 0.8 }),
  ]);
  const LASHES = [line('M37.4 46.8 L35.2 45.4 M37.2 48.8 L35 48.6', 1.4), line('M62.6 46.8 L64.8 45.4 M62.8 48.8 L65 48.6', 1.4)];
  const arcEye = (x) => line(`M${x - 3.6} 50.4 Q${x} 45.4 ${x + 3.6} 50.4`, 2.2);
  const lid = (x, fill) => [P(`M${x - 3.9} 49 Q${x - 3.9} 44.2 ${x} 44.2 Q${x + 3.9} 44.2 ${x + 3.9} 49Z`, { fill }), line(`M${x - 3.8} 48.6 H${x + 3.8}`, 1.8)];
  const EXPRESSIONS = {
    feliz: { name: 'Feliz' },
    alegre: {
      name: 'Alegre',
      eyes: () => [arcEye(40.5), arcEye(59.5)],
      mouth: () => [S('M44.6 57.2 Q50 56.4 55.4 57.2 Q55 64.6 50 64.6 Q45 64.6 44.6 57.2Z', '#7f1d1d', { 'stroke-width': 1.8 }), P('M47 62.6 Q50 60.4 53 62.6 Q51.6 64.2 50 64.2 Q48.4 64.2 47 62.6Z', { fill: '#fb7185' })],
    },
    piscadinha: {
      name: 'Piscadinha',
      eyes: () => [arcEye(40.5), EYES[1]],
      brows: () => [line('M36.8 42.4 Q40.5 41.4 44.2 42', 1.9, { opacity: 0.85 }), line('M55.8 39.8 Q59.5 38 63.2 39.8', 1.9, { opacity: 0.85 })],
      mouth: () => line('M45.6 58.8 Q50.6 62 55 57', 2),
    },
    surpreso: {
      name: 'Surpreso',
      brows: () => [line('M36.8 38.6 Q40.5 36.4 44.2 38', 1.9, { opacity: 0.85 }), line('M55.8 38 Q59.5 36.4 63.2 38.6', 1.9, { opacity: 0.85 })],
      eyes: () => [40.5, 59.5].map((x) => [n('ellipse', { cx: x, cy: 49, rx: 3.8, ry: 4.7, fill: OUT }), circ(x + 1.3, 47.2, 1.5, '#fff'), circ(x - 1.1, 51, 0.7, '#fff', { opacity: 0.8 })]),
      mouth: () => n('ellipse', Object.assign({ cx: 50, cy: 60.2, rx: 2.5, ry: 3.1, fill: '#7f1d1d' }, st, { 'stroke-width': 1.8 })),
    },
    bravo: {
      name: 'Bravo',
      brows: () => [line('M36.4 39.4 L44.4 42.6', 2.3), line('M55.6 42.6 L63.6 39.4', 2.3)],
      mouth: () => line('M46 60.6 Q50 57.4 54 60.6', 2),
    },
    triste: {
      name: 'Triste',
      brows: () => [line('M36.8 41.8 Q40.8 41.4 44.2 39', 1.9, { opacity: 0.85 }), line('M55.8 39 Q59.2 41.4 63.2 41.8', 1.9, { opacity: 0.85 })],
      mouth: () => [line('M45.8 61 Q50 57.4 54.2 61', 2), P('M63.4 53.2 Q65.6 56.6 63.4 57.8 Q61.2 56.6 63.4 53.2Z', { fill: '#7dd3fc', stroke: OUT, 'stroke-width': 1, 'stroke-linejoin': 'round' })],
    },
    convencido: {
      name: 'Convencido',
      eyesLid: true,
      brows: () => [line('M36.8 41.8 Q40.5 40.8 44.2 41.6', 1.9, { opacity: 0.85 }), line('M55.8 39.6 Q59.5 37.6 63.2 39.4', 1.9, { opacity: 0.85 })],
      mouth: () => line('M46 58.8 Q51 60.6 55 57.2', 2),
    },
  };
  const NOSE = P('M48.6 53.6 Q50 54.8 51.4 53.6', { fill: 'none', stroke: '#000', 'stroke-width': 1.3, 'stroke-linecap': 'round', opacity: 0.3 });
  const MOUTH = line('M45.8 57.8 Q50 61.4 54.2 57.8', 2);
  const MOUTH_OPEN = [
    S('M45 57.4 Q50 56.6 55 57.4 Q54.6 64.8 50 64.8 Q45.4 64.8 45 57.4Z', '#7f1d1d', { 'stroke-width': 1.8 }),
    P('M46.3 58.1 Q50 57.5 53.7 58.1 L53.4 59.6 Q50 60 46.6 59.6Z', { fill: '#fff' }),
    P('M47 62.8 Q50 60.6 53 62.8 Q51.6 64.4 50 64.4 Q48.4 64.4 47 62.8Z', { fill: '#fb7185' }),
  ];
  const corpsePatch = P('M32.5 44.5 Q34 38 40.5 38.4 Q46.6 39.4 46.1 46.5 Q45.7 52 43.4 55.5 L42 61 L40.2 55.8 Q37 56 35.6 52.6 L33.4 55.8 L33.6 50 Q32.3 47.5 32.5 44.5Z', { fill: INK });
  const MAKEUP = {
    none: { name: 'Natural' },
    corpse: {
      name: 'Corpse paint',
      base: [n('ellipse', { cx: 50, cy: 44.5, rx: 22.7, ry: 21.3, fill: '#eef2f7' }), shade('M66.5 56 Q63 63.6 54 65.4 Q64.6 66 70 56.4 Q71.4 52 71.6 48 Q70.6 52.6 66.5 56Z', 0.08)],
      marks: [
        corpsePatch, mirror(corpsePatch),
        n('ellipse', { cx: 40.5, cy: 49, rx: 4.5, ry: 5.3, fill: '#f8fafc' }),
        n('ellipse', { cx: 59.5, cy: 49, rx: 4.5, ry: 5.3, fill: '#f8fafc' }),
        P('M47.8 52.4 Q50 51.4 52.2 52.4 L50 55.4Z', { fill: INK }),
        P('M44.2 57.6 Q50 55.6 55.8 57.6 Q54.2 62 50 62.2 Q45.8 62 44.2 57.6Z', { fill: INK }),
        P('M45.8 60.4 L44.8 65.4 L47.8 61.6Z M48.9 61.9 L50 66.8 L51.1 61.9Z M54.2 60.4 L55.2 65.4 L52.2 61.6Z', { fill: INK }),
      ],
    },
  };

  // ---------- cabelos ----------
  const cluster = (circles, ell, fill) => {
    const shapes = (extra) => [ell && n('ellipse', Object.assign({}, ell, { fill }, extra)), circles.map(([cx, cy, r]) => circ(cx, cy, r, fill, extra))];
    return [shapes({ stroke: OUT, 'stroke-width': SW * 2 }), shapes({})];
  };
  const afroC = [12, -14, -40, -65, -90, -115, -140, -166, 192].map((a) => {
    const r = (a * Math.PI) / 180;
    return [f1(50 + 25 * Math.cos(r)), f1(43 + 13 * Math.sin(r)), 10.5];
  });
  const curlyC = [[50, 29, 9], [38.5, 30.5, 9], [61.5, 30.5, 9], [29.5, 37, 8.5], [70.5, 37, 8.5], [25.5, 48, 8], [74.5, 48, 8], [26.5, 59, 7.5], [73.5, 59, 7.5], [30, 68, 6.5], [70, 68, 6.5]];
  const pigtail = [S('M25 38 Q12.5 39.5 12 55 Q11.6 67 18.6 74.4 Q17.4 62.4 21.4 56 Q25.4 50.4 28 46Z', HAIR), shade('M20 46 Q15.6 52 16 62 Q16.4 68 18.6 74.4 Q17.4 62.4 21.4 56Z', 0.18), shine('M17.6 47 Q15.4 52 15.6 58', 0.3, 1.5)];

  const HAIRS = {
    long: {
      name: 'Longo liso', ears: false, color: '#5a2a17',
      back: [S('M25 48 Q21.5 18.5 50 18.5 Q78.5 18.5 75 48 L77.5 86 Q74 91.5 67.5 89 Q64.5 88 63.8 84 L63 62 H37 L36.2 84 Q35.5 88 32.5 89 Q26 91.5 22.5 86Z', HAIR), shade('M70.6 52 L72.6 86.6 Q70 88.4 67.4 87.2 L66.4 54Z', 0.18)],
      front: [
        S('M26 47 Q24.5 20 50 20 Q75.5 20 74 47 Q71.5 37.5 64.5 31 Q58 39.5 44 40.2 Q33 41 26 47Z', HAIR),
        S('M26.2 47 Q26.4 38.4 31 34.2 Q29.8 46 31.6 58.4 Q28.6 60.4 26.4 57Z', HAIR),
        S('M73.8 47 Q73.6 38.4 69 34.2 Q70.2 46 68.4 58.4 Q71.4 60.4 73.6 57Z', HAIR),
        shine('M35 27.4 Q41.5 23.2 48.5 23.2', 0.35, 2),
        line('M64.5 31.2 Q62 26.6 58.6 23.6', 1.2, { opacity: 0.3 }),
      ],
    },
    afro: {
      name: 'Black power', ears: true, color: '#2e1a12',
      back: [
        cluster(afroC, { cx: 50, cy: 45, rx: 30, ry: 18 }, HAIR),
        [[37, 28, 3], [30, 37, 2.2], [63, 27, 2.6], [71.5, 38, 1.8], [50, 22.6, 2]].map(([x, y, r]) => circ(x, y, r, '#fff', { opacity: 0.12 })),
        [[24, 50], [76, 50], [34, 24.6], [66, 24.6]].map(([x, y]) => P(`M${x - 2.6} ${y} Q${x} ${y - 2.6} ${x + 2.6} ${y}`, { fill: 'none', stroke: '#000', 'stroke-width': 1.3, opacity: 0.22, 'stroke-linecap': 'round' })),
      ],
      front: [S('M27.6 44.5 Q27 24 50 24 Q73 24 72.4 44.5 Q69.5 35 61.5 31.8 Q55.5 34 50 31.5 Q44.5 34 38.5 31.8 Q30.5 35 27.6 44.5Z', HAIR)],
    },
    short: {
      name: 'Curto', ears: true, color: '#8a5a2b',
      front: [
        S('M26.2 45 Q24 18.8 50 18.8 Q76 18.8 73.8 45 Q73 37 68.6 33.4 Q66.6 37.6 61 37 Q58 32.4 52.5 34.6 Q46 38 40 35.2 Q36 38.6 31.4 36.2 Q28.2 39.2 26.2 45Z', HAIR),
        shade('M61 37 Q58 32.4 52.5 34.6 Q57 32 59.6 30.6 Q61.6 33.6 61 37Z', 0.2),
        shine('M37 25 Q44 21.6 52 22.2', 0.35, 2),
      ],
    },
    mohawk: {
      name: 'Moicano', ears: true, color: '#f97316',
      front: [
        P('M26.6 44 Q26 26.4 37.6 21.8 L40.6 33 Q31.2 35.4 26.6 44Z M73.4 44 Q74 26.4 62.4 21.8 L59.4 33 Q68.8 35.4 73.4 44Z', { fill: HAIR, opacity: 0.4 }),
        S('M39.5 34 L34.5 22 L42.6 24.6 L44 18 L50 22 L56 18 L57.4 24.6 L65.5 22 L60.5 34 Q50 29.5 39.5 34Z', HAIR),
        shade('M50 22 L52.6 30.6 Q50 30.1 47.4 30.6Z', 0.22),
        shine('M44 21.6 L45.4 27.2', 0.4, 1.4),
      ],
    },
    devilock: {
      name: 'Devilock', ears: true, color: '#141418',
      front: [
        S('M26.4 44.5 Q24.6 19 50 19 Q75.4 19 73.6 44.5 Q72 36 66 32 Q60.4 33.2 55.4 32 L52.2 56.6 L49.4 52.6 L46.6 55.2 Q45.4 45 44.4 33.2 Q36 33.8 31 37 Q28 40 26.4 44.5Z', HAIR),
        shine('M49.4 35.6 L50.4 49.6', 0.32, 1.6),
        shine('M36 25.6 Q42 22.2 49 22.2', 0.3, 2),
        shine('M58.4 24.4 Q64 25.6 67.6 29', 0.2, 1.5),
      ],
    },
    pigtails: {
      name: 'Maria-chiquinha', ears: true, color: '#f2c14e',
      back: [pigtail, mirror(pigtail), circ(25.4, 40.4, 3.4, '#f472b6', Object.assign({}, st, { 'stroke-width': 1.6 })), circ(74.6, 40.4, 3.4, '#f472b6', Object.assign({}, st, { 'stroke-width': 1.6 }))],
      front: [S('M26.2 46 Q24.5 19.5 50 19.5 Q75.5 19.5 73.8 46 Q71 36 63 32.5 Q56 34 50.8 26 Q50 33 41 35 Q31 36.5 26.2 46Z', HAIR), shine('M34.6 28 Q39.6 23.6 46 22.8', 0.35, 2)],
    },
    curly: {
      name: 'Cacheado', ears: false, color: '#c2410c',
      back: [cluster(curlyC, null, HAIR), [[34, 26.4, 2.2], [52, 23.6, 2], [24, 45, 1.8], [72, 33, 1.8]].map(([x, y, r]) => circ(x, y, r, '#fff', { opacity: 0.14 }))],
      front: [S('M27 46 Q25 24 40 22 Q50 19.8 60 22 Q75 24 73 46 Q71.5 40 67 37.5 Q66 41.5 61.5 40 Q59 35 54 36.8 Q50.5 40.5 46 37.6 Q41.5 35 38.5 40 Q34 41.5 33 37.5 Q28.5 40 27 46Z', HAIR), shine('M38 25.6 Q44 22.8 50 23', 0.3, 1.8)],
    },
  };

  Object.assign(HAIRS, {
    bun: {
      name: 'Coque', ears: true, color: '#2e1a12',
      back: [circ(50, 14.5, 9.4, HAIR, st), shade('M56 8 Q61 13 57.4 21 Q59 14 56 8Z', 0.2), shine('M44.6 11 Q47 8.4 50.4 8.2', 0.35, 1.6)],
      front: [
        S('M26.4 45 Q24.6 20 50 20 Q75.4 20 73.6 45 Q72.4 36 66 31.6 Q58 36 50 31 Q42 36 34 31.6 Q27.6 36 26.4 45Z', HAIR),
        shine('M36 26.6 Q42 22.6 50 22.8', 0.35, 2),
        n('ellipse', Object.assign({ cx: 50, cy: 21.6, rx: 6.6, ry: 2.2, fill: '#f472b6' }, st, { 'stroke-width': 1.4 })),
      ],
    },
    ponytail: {
      name: 'Rabo de cavalo', ears: true, color: '#f2c14e',
      back: [S('M62 22.4 Q88 14 90 42 Q91 58 81 68 Q82 56 77 49 Q70 42 64 36Z', HAIR), shade('M84 40 Q86 52 81 68 Q82 56 77 49Z', 0.2), shine('M80 26 Q86 30 87 38', 0.3, 1.6)],
      front: [
        S('M26.2 46 Q24.4 19.4 50 19.4 Q75.6 19.4 73.8 46 Q72 36.6 66 33 Q58 36.6 50 30 Q42 37 34 33.6 Q28 37 26.2 46Z', HAIR),
        shine('M36 26 Q42 22 50 22.4', 0.35, 2),
        circ(69.6, 25, 3.6, '#38bdf8', Object.assign({}, st, { 'stroke-width': 1.6 })),
      ],
    },
    bob: {
      name: 'Chanel', ears: false, color: '#141418',
      back: [S('M24.4 50 Q21 18.4 50 18.4 Q79 18.4 75.6 50 L76.2 68 Q75.2 73 69 71.6 Q65.4 70.4 64.8 65 H35.2 Q34.6 70.4 31 71.6 Q24.8 73 23.8 68Z', HAIR), shade('M70.6 52 L72 68 Q71 70 68.4 70 L67.4 54Z', 0.18)],
      front: [S('M26 47 Q24.4 20 50 20 Q75.6 20 74 47 L71 42 Q70 35 64 34.6 Q57 37.6 50 35 Q43 37.6 36 34.6 Q30 35 29 42Z', HAIR), shine('M35 26.4 Q42 22 49.4 22.4', 0.35, 2)],
    },
    spiky: {
      name: 'Espetado', ears: true, color: '#a78bfa',
      front: [
        S('M26.4 44 L24.4 31 L31.4 33.6 L31.2 21.6 L38.6 27 L42.4 17.6 L47.2 25.4 L52.4 16.6 L56.4 25.6 L62 18.6 L64 28 L70.6 22.8 L69.6 34 L75.6 31.6 L73.6 44 Q72.4 37 66 33.8 Q58 37.6 50 33.8 Q42 37.6 34 33.8 Q28 37 26.4 44Z', HAIR),
        shade('M52.4 16.6 L56.4 25.6 L54 26Z', 0.2), shine('M42.6 19.6 L44 24.4', 0.4, 1.4),
      ],
    },
    wild: {
      name: 'Selvagem', ears: false, color: '#65a30d',
      front: [
        S('M25 48 L21.6 41 L26 38.6 L22.6 31 L29 30 L28 22.6 L35 25 L36.6 18.6 L42.6 22.8 L47 17.4 L51.4 22.4 L57 17.8 L60 23.4 L66.4 19.6 L66.6 26.4 L73 25.2 L71.4 32 L77.6 34 L74.4 40.4 L78.4 44.4 L74.2 48 Q73 40 66.4 36 Q58 40 50 35.4 Q42 40 33.6 36 Q27 40 25 48Z', HAIR),
        shine('M31 28 L33 23.6', 0.35, 1.4), shine('M54 21.6 L56.6 25.4', 0.3, 1.4),
      ],
    },
    bald: {
      name: 'Careca', ears: true, color: '#2e1a12',
      front: [
        S('M27.4 43.6 Q21.6 38.6 26 33 Q30.2 29.6 33.2 33.6 Q29 35.4 29.8 41.6Z', HAIR),
        mirror(S('M27.4 43.6 Q21.6 38.6 26 33 Q30.2 29.6 33.2 33.6 Q29 35.4 29.8 41.6Z', HAIR)),
        P('M49.6 22.2 Q46.4 15.8 51 14.4 Q55.6 15.8 52.4 21.4', { fill: 'none', stroke: OUT, 'stroke-width': 5, 'stroke-linecap': 'round' }),
        P('M49.6 22.2 Q46.4 15.8 51 14.4 Q55.6 15.8 52.4 21.4', { fill: 'none', stroke: HAIR, 'stroke-width': 2.6, 'stroke-linecap': 'round' }),
      ],
    },
  });

  // ---------- blusas ----------
  const TOPS = {
    tee: {
      name: 'Camiseta', color: '#f43f5e', sleeve: 'short',
      torso: () => [torso(), torsoShade(), crew(), P(star(50, 85, 6, 2.6), { fill: '#fde047', stroke: OUT, 'stroke-width': 1.4, 'stroke-linejoin': 'round' }), line('M33.4 99.4 Q50 101.4 66.6 99.4', 1.2, { opacity: 0.22 })],
    },
    hoodie: {
      name: 'Moletom', color: '#f59e0b', sleeve: 'long', cuff: true,
      torso: () => [
        torso(), torsoShade(), hem(),
        S('M39.2 104 L40.8 89.2 Q41.2 87.6 43.2 87.6 H56.8 Q58.8 87.6 59.2 89.2 L60.8 104Z', TOP, { 'stroke-width': 1.6 }),
        shade('M42 88.8 H58 L58.4 92 H41.6Z', 0.12),
        S('M35 68.5 Q50 82.5 65 68.5 Q60.5 63 50 63 Q39.5 63 35 68.5Z', TOP),
        shade('M38.6 68.6 Q50 77.4 61.4 68.6 Q57 65.6 50 65.6 Q43 65.6 38.6 68.6Z', 0.24),
        P('M46 74.5 V84.4 M54 74.5 V84.4', { fill: 'none', stroke: W, 'stroke-width': 1.8, 'stroke-linecap': 'round' }),
        circ(46, 85.4, 1.2, W), circ(54, 85.4, 1.2, W),
      ],
    },
    striped: {
      name: 'Listrada', color: '#38bdf8', sleeve: 'short', stripe: true,
      torso: () => [torso(), [74.6, 81.6, 88.6, 95].map((y) => band(y, 3.2, W)), torsoShade(), crew()],
    },
    bomber: {
      name: 'Jaqueta bomber', color: '#8b5cf6', sleeve: 'long', cuff: true,
      torso: () => [
        torso(), torsoShade(), hem(),
        [35.5, 40, 44.5, 55.5, 60, 64.5].map((x) => line(`M${x} 99.2 V103.2`, 0.9, { opacity: 0.35 })),
        S('M42 66.4 L50 84 L58 66.4Z', W),
        line('M42 66.4 L50 84 L58 66.4', 2.4, { stroke: '#000', opacity: 0.25 }),
        line('M50 84 V103.6', 1.4),
        circ(60.6, 78, 3.4, '#fde047', Object.assign({}, st, { 'stroke-width': 1.4 })),
        P('M61.4 75.8 L59.4 78.4 H61.4 L59.8 80.4', { fill: 'none', stroke: OUT, 'stroke-width': 1, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }),
      ],
    },
    tank: {
      name: 'Regata', color: '#4ade80', sleeve: 'none',
      torso: () => {
        const sh = S('M30.3 73.4 Q30.5 66 38 66 H40.6 Q40.4 75 33.8 79.4 Q31.4 79.4 30.6 76Z', SKIN);
        return [torso(), band(85, 4, W, 0.9), torsoShade(), sh, mirror(sh), S('M42.4 66.4 Q50 76 57.6 66.4Z', SKIN)];
      },
    },
    shirt: {
      name: 'Camisa social', color: '#f8fafc', sleeve: 'long', cuffLine: true,
      torso: () => {
        const wing = S('M41.6 66 L50 71.6 L45.4 75.2 L40.2 68.4Z', TOP);
        return [
          torso(), torsoShade(),
          S('M43.6 66.2 L50 71.6 L56.4 66.2Z', SKIN),
          wing, mirror(wing),
          line('M50 71.6 V103.6', 1.3, { opacity: 0.5 }),
          [78, 85, 92, 99].map((y) => circ(50, y, 1.1, OUT, { opacity: 0.7 })),
          S('M36.4 77 H43.2 V82.4 Q39.8 83.8 36.4 82.4Z', TOP, { 'stroke-width': 1.3 }),
        ];
      },
    },
    leather: {
      name: 'Jaqueta de couro', color: '#26262c', sleeve: 'long', cuffLine: true, studs: true,
      torso: () => [
        torso(),
        S('M42 66.4 L50 89 L58 66.4Z', W),
        torsoShade(), hem(),
        S('M38 66.2 L44.6 66.2 L49.6 84 L43.4 80.2 L40.2 72Z', TOP),
        S('M62 66.2 L55.4 66.2 L52.2 76.4 L58.2 80.2 L60.4 72Z', TOP),
        line('M52.2 76.4 L57.6 103.4', 1.4),
        line('M52.2 76.4 L57.6 103.4', 0.8, { stroke: '#cbd5e1', 'stroke-dasharray': '1.2 1.2' }),
        rect(46, 99.4, 8, 4.6, 1, '#cbd5e1', Object.assign({}, st, { 'stroke-width': 1.2 })),
        [[34.4, 70.4], [36.8, 68.4], [65.6, 70.4], [63.2, 68.4]].map(([x, y]) => circ(x, y, 1.05, '#e2e8f0')),
        shine('M35 76 Q34.2 86 35.4 96', 0.22, 1.8),
        shine('M44 82.4 L46.6 84', 0.25, 1.4),
      ],
    },
  };
  TOPS.robe = {
    name: 'Manto', color: '#6d28d9', sleeve: 'long', cuffGold: true,
    torso: () => [
      torso(), torsoShade(), hem(), band(96.4, 5.4, '#facc15', 0.95),
      S('M39.4 66.2 L50 84 L60.6 66.2Z', '#facc15', { 'stroke-width': 1.6 }),
      S('M43.6 66.6 L50 77.6 L56.4 66.6Z', SKIN, { 'stroke-width': 1.2 }),
      P(star(41.6, 91, 3.6, 1.5), { fill: '#fde047', stroke: OUT, 'stroke-width': 1, 'stroke-linejoin': 'round' }),
      P(star(59, 93.6, 3, 1.3), { fill: '#fde047', stroke: OUT, 'stroke-width': 1, 'stroke-linejoin': 'round' }),
      P(star(36.6, 80, 2.4, 1), { fill: '#fde047' }),
    ],
  };
  const topArm = (T) => {
    const extra = [
      T.stripe && rect(26.2, 71, 9.6, 3, 0, W, { opacity: 0.92 }),
      T.cuff && cuff(),
      T.cuffGold && rect(26.9, 85.4, 8.2, 3.6, 1.2, '#facc15', { opacity: 0.95 }),
      T.cuffLine && line('M26.6 86 H35.4', 1.2, { opacity: 0.5 }),
      T.studs && [circ(29, 70, 1, '#e2e8f0'), circ(32.6, 70, 1, '#e2e8f0')],
    ];
    return arms[T.sleeve](extra);
  };

  // ---------- acessórios ----------
  const cone = (t) => [41 + 12 * t, 24.5 - 21.7 * t, 62 - 9 * t, 23.2 - 20.4 * t];
  const coneBand = (a, b) => {
    const [l1x, l1y, r1x, r1y] = cone(a), [l2x, l2y, r2x, r2y] = cone(b);
    return P(`M${f1(l1x)} ${f1(l1y)} L${f1(r1x)} ${f1(r1y)} L${f1(r2x)} ${f1(r2y)} L${f1(l2x)} ${f1(l2y)}Z`, { fill: '#fde047' });
  };
  const lens = [
    P('M33.2 45 Q33.2 43 35.4 43 H45.4 Q47.4 43 47 45.4 L46.2 51 Q45.6 54.6 41.6 54.6 H38.4 Q34.2 54.6 33.6 51Z', { fill: '#1e1b4b', stroke: OUT, 'stroke-width': 2, 'stroke-linejoin': 'round' }),
    P('M33.3 45 Q33.3 43.1 35.4 43.1 H45.4 Q47.3 43.1 46.9 45.4 L46.8 46.2 H33.3Z', { fill: '#f472b6' }),
    shine('M37 48 L39.6 51.4 M40.6 47.6 L42 49.4', 0.55, 1.2),
    line('M33.4 46.4 L27.4 46', 1.8),
  ];
  const wing = S('M50 70 L41.6 65.6 Q39.6 65 39.6 67.2 V72.8 Q39.6 75 41.6 74.4Z', '#f43f5e', { 'stroke-width': 1.8 });
  const cup = [rect(18.4, 38.4, 10.4, 17, 4.8, '#38bdf8', st), rect(24.8, 40.6, 3.6, 12.6, 1.8, '#000', { opacity: 0.25 }), shine('M21.4 41.6 V47', 0.45, 1.4)];
  const ACCS = {
    cap: {
      name: 'Boné', group: 'topo', slot: 'head',
      node: [
        S('M26.6 36 Q26.6 15.6 50 15.6 Q73.4 15.6 73.4 36 Q50 31 26.6 36Z', '#ef4444'),
        shade('M63 18.4 Q73.4 23 73.4 36 Q69 34.6 64.6 34Z', 0.14),
        line('M50 15.8 V32', 1.1, { opacity: 0.3 }),
        circ(50, 25.6, 4.2, W, Object.assign({}, st, { 'stroke-width': 1.4 })),
        P(star(50, 25.8, 2.6, 1.1), { fill: '#ef4444' }),
        S('M24 36.4 Q50 28.6 76 36.4 Q77 40.8 72 41.6 Q50 37.6 28 41.6 Q23 40.8 24 36.4Z', '#ef4444'),
        shade('M27 40.6 Q50 36.4 73 40.6 Q50 38.6 27 40.6Z', 0.3),
        circ(50, 16, 1.8, '#ef4444', Object.assign({}, st, { 'stroke-width': 1.2 })),
        shine('M33 27 Q36 21 42 18.6', 0.35, 1.8),
      ],
    },
    partyhat: {
      name: 'Chapéu de festa', group: 'topo', slot: 'head',
      node: [
        S('M41 24.5 L53 2.8 L62 23.2 Q51.6 26.8 41 24.5Z', '#a78bfa'),
        coneBand(0.14, 0.27), coneBand(0.44, 0.56), coneBand(0.72, 0.8),
        shade('M53 2.8 L62 23.2 Q59 24.2 56 24.6Z', 0.14),
        S('M41 24.5 L53 2.8 L62 23.2 Q51.6 26.8 41 24.5Z', 'none'),
        circ(53, 3.6, 3.6, '#f472b6', Object.assign({}, st, { 'stroke-width': 1.6 })),
        line('M41.6 24.6 Q34 30 30 38', 1, { opacity: 0.5 }),
      ],
    },
    crown: {
      name: 'Coroa', group: 'topo', slot: 'head',
      node: [
        S('M37 27.4 L36 13.6 L42.4 19.4 L50 9.4 L57.6 19.4 L64 13.6 L63 27.4 Q50 29.6 37 27.4Z', '#facc15'),
        shade('M37.3 23.6 Q50 25.8 62.7 23.6 L63 27.4 Q50 29.6 37 27.4Z', 0.14),
        circ(50, 21.4, 2.3, '#f43f5e', Object.assign({}, st, { 'stroke-width': 1.2 })),
        circ(42.6, 22.6, 1.6, '#38bdf8', Object.assign({}, st, { 'stroke-width': 1 })),
        circ(57.4, 22.6, 1.6, '#4ade80', Object.assign({}, st, { 'stroke-width': 1 })),
        [[36, 13.6], [50, 9.4], [64, 13.6]].map(([x, y]) => circ(x, y, 1.6, '#fde047', Object.assign({}, st, { 'stroke-width': 1.1 }))),
        shine('M39.4 18.6 L39.8 24', 0.5, 1.3),
      ],
    },
    headphones: {
      name: 'Fone', group: 'orelhas', slot: 'head',
      node: [
        P('M24.6 46 Q22 15.4 50 15.4 Q78 15.4 75.4 46', { fill: 'none', stroke: OUT, 'stroke-width': 7, 'stroke-linecap': 'round' }),
        P('M24.6 46 Q22 15.4 50 15.4 Q78 15.4 75.4 46', { fill: 'none', stroke: '#38bdf8', 'stroke-width': 3.2, 'stroke-linecap': 'round' }),
        shine('M32 24 Q38 18.6 46 17.4', 0.45, 1.2),
        cup, mirror(cup),
      ],
    },
    sunglasses: {
      name: 'Óculos escuros', group: 'rosto', slot: 'face',
      node: [lens, mirror(lens), line('M46.8 47.4 Q50 45.6 53.2 47.4', 1.8)],
    },
    bowtie: {
      name: 'Gravata borboleta', group: 'pescoço', slot: 'body',
      node: [
        wing, mirror(wing),
        circ(43.6, 68.6, 0.9, W), circ(42.4, 72.2, 0.9, W), circ(56.4, 68.6, 0.9, W), circ(57.6, 72.2, 0.9, W),
        rect(47.3, 67.1, 5.4, 5.8, 1.8, '#e11d48', Object.assign({}, st, { 'stroke-width': 1.6 })),
      ],
    },
    chain: {
      name: 'Corrente', group: 'pescoço', slot: 'body',
      node: [
        P('M39.4 66.8 Q50 86 60.6 66.8', { fill: 'none', stroke: '#a16207', 'stroke-width': 2.8, 'stroke-linecap': 'round' }),
        P('M39.4 66.8 Q50 86 60.6 66.8', { fill: 'none', stroke: '#fde047', 'stroke-width': 1.5, 'stroke-dasharray': '2.2 1.3' }),
        circ(50, 80, 3.8, '#fde047', Object.assign({}, st, { 'stroke-width': 1.4 })),
        P(star(50, 80.2, 2.2, 0.9), { fill: '#a16207' }),
        shine('M48 78.4 Q48.6 77.4 49.6 77.2', 0.7, 1),
      ],
    },
  };

  const antenna = () => [
    P('M41 23 Q36.6 13 31 7.4', { fill: 'none', stroke: OUT, 'stroke-width': 4.6, 'stroke-linecap': 'round' }),
    P('M41 23 Q36.6 13 31 7.4', { fill: 'none', stroke: SKIN, 'stroke-width': 2.2, 'stroke-linecap': 'round' }),
    circ(30.2, 6.6, 3.8, '#a3e635', Object.assign({}, st, { 'stroke-width': 1.6 })),
    shine('M28.8 5.4 Q29.4 4.6 30.4 4.4', 0.8, 1),
  ];
  const catEar = () => [S('M27.6 34 Q26 17 30 11.6 Q31.6 9.8 34 11.2 L47 22.6Z', HAIR), P('M32 28 Q31.4 19.4 33 16.4 L40.6 22.6Z', { fill: '#f9a8d4' })];
  const rim = () => [
    n('circle', { cx: 40.5, cy: 49, r: 7.6, fill: '#e0f2fe', 'fill-opacity': 0.3, stroke: OUT, 'stroke-width': 2 }),
    shine('M35.4 45 Q37.6 43 40 42.8', 0.8, 1.2),
    line('M33 47.6 L27.4 46.4', 1.6),
  ];
  Object.assign(ACCS, {
    witchhat: {
      name: 'Chapéu de bruxa', group: 'topo', slot: 'head',
      node: [
        n('ellipse', Object.assign({ cx: 50, cy: 30.6, rx: 33, ry: 5.6, fill: '#3b0764' }, st)),
        S('M37 29.4 L45 10 Q47.6 4.4 53.6 3.8 Q60.6 3.4 63.6 8 Q58.4 7.6 57 12.4 L63 29.4 Q50 33 37 29.4Z', '#3b0764'),
        shade('M57 12.4 L63 29.4 Q60 30.4 56 30.8Z', 0.2),
        S('M38.6 25.2 Q50 28.8 61.4 25.2 L63 29.4 Q50 33 37 29.4Z', '#a78bfa', { 'stroke-width': 1.6 }),
        rect(46.4, 26.8, 7.2, 4.8, 1.2, '#facc15', Object.assign({}, st, { 'stroke-width': 1.3 })),
        rect(48.6, 28.3, 2.8, 1.8, 0.6, 'none', { stroke: OUT, 'stroke-width': 1 }),
        shine('M43 20 L46 12', 0.35, 1.4),
      ],
    },
    santahat: {
      name: 'Gorro de Natal', group: 'topo', slot: 'head',
      node: [
        S('M28 31 Q27 13 47 9.6 Q63 7 72 17 Q79 25 80.6 38 Q74 34 70.4 32 Q50 24 28 31Z', '#dc2626'),
        shade('M72 17 Q79 25 80.6 38 Q76 36 72 33.4Z', 0.18),
        S('M24.6 33 Q24 26 50 24 Q76 26 75.4 33 Q76 38.6 70 38 Q60 35 50 36 Q40 35 30 38 Q24 38.6 24.6 33Z', W),
        circ(80.6, 39, 5.2, W, st),
        shine('M36 15.6 Q42 12.4 48 12', 0.35, 1.6),
      ],
    },
    antennas: {
      name: 'Antenas', group: 'topo', slot: 'head',
      node: [g('antenna antenna-l', antenna()), mirror(g('antenna antenna-r', antenna()))],
    },
    catears: {
      name: 'Orelhas de gato', group: 'topo', slot: 'head',
      node: [catEar(), mirror(catEar())],
    },
    roundglasses: {
      name: 'Óculos redondos', group: 'rosto', slot: 'face',
      node: [rim(), mirror(rim()), line('M48 48.2 Q50 46.6 52 48.2', 1.8)],
    },
    mustache: {
      name: 'Bigode', group: 'boca', slot: 'face',
      node: [S('M50 55.8 Q46.4 52.6 42 54.8 Q39.8 56.2 41.2 58.6 Q44.6 56.6 50 57.8 Q55.4 56.6 58.8 58.6 Q60.2 56.2 58 54.8 Q53.6 52.6 50 55.8Z', HAIR, { 'stroke-width': 1.6 }), shine('M44 55.6 Q46 54.6 48 55.2', 0.35, 1.2)],
    },
    scarf: {
      name: 'Cachecol', group: 'pescoço', slot: 'body',
      node: [
        g('scarf-tail', S('M56 77 L66.4 78.6 L65.6 95 Q61.6 97.4 57.6 95Z', '#f43f5e'), P('M56.6 84 L66 85.4 M56.8 90 L65.8 91.4', { fill: 'none', stroke: W, 'stroke-width': 2, opacity: 0.9 })),
        S('M32.6 66 Q50 76.6 67.4 66 L69 73.4 Q50 84 31 73.4Z', '#f43f5e'),
        P('M32 71.4 Q50 82 68.4 71.4', { fill: 'none', stroke: W, 'stroke-width': 1.8, opacity: 0.9 }),
      ],
    },
    flower: {
      name: 'Flor', group: 'lateral', slot: 'head',
      node: [
        [0, 1, 2, 3, 4].map((i) => { const a = (i * 72 - 90) * Math.PI / 180; return circ(f1(69 + 4.4 * Math.cos(a)), f1(27 + 4.4 * Math.sin(a)), 3.4, '#f472b6', Object.assign({}, st, { 'stroke-width': 1.2 })); }),
        circ(69, 27, 2.8, '#fde047', Object.assign({}, st, { 'stroke-width': 1.2 })),
      ],
    },
  });

  // ---------- catálogo ----------
  const SKINS = [
    { id: 'porcelana', name: 'Porcelana', hex: '#fde4d0' },
    { id: 'clara', name: 'Clara', hex: '#f6d3b3' },
    { id: 'bege', name: 'Bege', hex: '#e8b48a' },
    { id: 'media', name: 'Média', hex: '#d29a68' },
    { id: 'morena', name: 'Morena', hex: '#b97a48' },
    { id: 'escura', name: 'Escura', hex: '#7a4b2c' },
    { id: 'retinta', name: 'Retinta', hex: '#4a2b1a' },
    { id: 'ciano', name: 'Ciano', hex: '#38d6e6' },
    { id: 'verde', name: 'Verde', hex: '#84cc16' },
    { id: 'lilas', name: 'Lilás', hex: '#c4b5fd' },
  ];
  const HAIR_COLORS = ['#141418', '#2e1a12', '#5a2a17', '#8a5a2b', '#f2c14e', '#c2410c', '#f97316', '#f472b6', '#a78bfa', '#38bdf8', '#4ade80', '#e2e8f0', '#dc2626', '#65a30d', '#5b21b6'];
  const CLOTH_COLORS = ['#f43f5e', '#ef4444', '#f97316', '#f59e0b', '#facc15', '#4ade80', '#14b8a6', '#38bdf8', '#3b82f6', '#6366f1', '#8b5cf6', '#f472b6', '#f8fafc', '#26262c', '#b91c1c', '#3f3f46'];

  const BASE = { skin: '#d29a68', hair: 'short', hairColor: '#8a5a2b', top: 'tee', topColor: '#f43f5e', pants: '#3b82f6', shoes: W, outline: '#0f172a', makeup: 'none', expression: 'feliz', face: 'redondo', lashes: false, accessories: [] };
  const PRESETS = {
    f1: { name: 'Feminino A', desc: 'Cabelo longo · camiseta · pele média', skin: '#d29a68', hair: 'long', hairColor: '#5a2a17', top: 'tee', topColor: '#f43f5e', pants: '#3b82f6', shoes: W, lashes: true },
    f2: { name: 'Feminino B', desc: 'Black power · moletom · pele escura', skin: '#7a4b2c', hair: 'afro', hairColor: '#2e1a12', top: 'hoodie', topColor: '#f59e0b', pants: '#6366f1', shoes: W, lashes: true },
    m1: { name: 'Masculino A', desc: 'Cabelo curto · listrada · pele clara', skin: '#f6d3b3', hair: 'short', hairColor: '#8a5a2b', top: 'striped', topColor: '#38bdf8', pants: '#2563eb', shoes: '#ef4444' },
    m2: { name: 'Masculino B', desc: 'Moicano · jaqueta · pele morena', skin: '#b97a48', hair: 'mohawk', hairColor: '#f97316', top: 'bomber', topColor: '#8b5cf6', pants: '#14b8a6', shoes: W },
    h1: { name: 'Horror Punk', desc: 'Devilock · corpse paint · jaqueta de couro', skin: '#f6d3b3', hair: 'devilock', hairColor: '#141418', top: 'leather', topColor: '#26262c', pants: '#b91c1c', shoes: '#26262c', makeup: 'corpse', accessories: ['chain'] },
  };

  Object.assign(PRESETS, {
    et: { name: 'Alienígena', desc: 'Pele ciano · cabelo vermelho · antenas', skin: '#38d6e6', hair: 'spiky', hairColor: '#dc2626', face: 'coracao', top: 'tee', topColor: '#a3e635', pants: '#7c3aed', shoes: '#facc15', expression: 'surpreso', accessories: ['antennas'] },
    gr: { name: 'Rabugento Verde', desc: 'Pele verde · pelagem · gorro de Natal', skin: '#84cc16', hair: 'wild', hairColor: '#65a30d', face: 'quadrado', top: 'hoodie', topColor: '#dc2626', pants: '#3f3f46', shoes: '#26262c', expression: 'convencido', accessories: ['santahat'] },
    wi: { name: 'Bruxa', desc: 'Manto roxo · chapéu pontudo · cabelo longo', skin: '#fde4d0', hair: 'long', hairColor: '#141418', face: 'oval', top: 'robe', topColor: '#6d28d9', pants: '#26262c', shoes: '#26262c', expression: 'convencido', lashes: true, accessories: ['witchhat'] },
    ni: { name: 'Gatinha', desc: 'Coque rosa · orelhas de gato · bochechuda', skin: '#e8b48a', hair: 'bun', hairColor: '#f472b6', face: 'bochechuda', top: 'tee', topColor: '#a78bfa', pants: '#14b8a6', shoes: W, expression: 'alegre', lashes: true, accessories: ['catears'] },
    nr: { name: 'Nerd', desc: 'Óculos redondos · camisa · gravata borboleta', skin: '#d29a68', hair: 'short', hairColor: '#141418', face: 'redondo', top: 'shirt', topColor: '#f8fafc', pants: '#3f3f46', shoes: '#26262c', expression: 'feliz', accessories: ['roundglasses', 'bowtie'] },
    rei: { name: 'Rei', desc: 'Careca · bigode · coroa · manto vermelho', skin: '#f6d3b3', hair: 'bald', hairColor: '#8a5a2b', face: 'bochechuda', top: 'robe', topColor: '#b91c1c', pants: '#26262c', shoes: '#facc15', expression: 'convencido', accessories: ['crown', 'mustache'] },
  });
  const resolve = (cfg) => {
    if (typeof cfg === 'string') return Object.assign({ id: cfg }, BASE, PRESETS[cfg]);
    return Object.assign({}, BASE, cfg);
  };

  // ---------- CSS ----------
  const rm = (pre) => `${pre} *{animation:none!important}
${pre}.is-talking .mouth{animation:ttt-shut .76s step-end infinite!important}
${pre}.is-talking .mouth-open{animation:ttt-open .76s step-end infinite!important}`;
  const WK = 'var(--ttt-walk,.5s)', WK2 = 'calc(var(--ttt-walk,.5s) / -2)';
  const WK6 = 'calc(var(--ttt-walk,.5s) / -7)';
  const CSS = `.ttt-char{overflow:visible}
.ttt-char.ttt-crop{overflow:hidden}
.ttt-char .ttt-body{transform-box:view-box;transform-origin:50px 130px}
.ttt-char .bob,.ttt-char .upper{transform-box:view-box;transform-origin:50px 104px}
.ttt-char .upper{animation:ttt-breathe 2.5s ease-in-out infinite}
.ttt-char .head,.ttt-char .head-nod{transform-box:view-box;transform-origin:50px 66px}
.ttt-char .hair{transform-box:view-box;transform-origin:50px 30px}
.ttt-char .leg-left,.ttt-char .leg-right{transform-box:fill-box;transform-origin:50% 0%}
.ttt-char .arm-left,.ttt-char .arm-right{transform-box:fill-box;transform-origin:50% 8%}
.ttt-char .arm-left{animation:ttt-arm-idle 2.5s ease-in-out infinite}
.ttt-char .arm-right{animation:ttt-arm-idle-r 2.5s ease-in-out -.5s infinite}
.ttt-char .eyes{transform-box:fill-box;transform-origin:50% 50%;animation:ttt-blink 3.6s linear infinite}
.ttt-char .eyes-look{animation:ttt-look 8s ease-in-out infinite}
.ttt-char .brows,.ttt-char .shadow{transform-box:fill-box;transform-origin:50% 50%}
.ttt-char .antenna{transform-box:view-box;transform-origin:41px 23px;animation:ttt-antenna 2.6s ease-in-out infinite}
.ttt-char .antenna-r{animation-delay:-1s}
.ttt-char .scarf-tail{transform-box:view-box;transform-origin:60px 77px;animation:ttt-tail-idle 3s ease-in-out infinite}
.ttt-char .face{transition:transform .25s ease}
.ttt-char.is-facing-left .face{transform:translateX(-2.6px)}
.ttt-char.is-facing-right .face{transform:translateX(2.6px)}
.ttt-char .mouth-open{opacity:0}
.ttt-char:not(.is-walking) .head{animation:ttt-idle-head 7s ease-in-out infinite}
.ttt-f2 .eyes{animation-delay:-1.2s}.ttt-m1 .eyes{animation-delay:-2.3s}.ttt-m2 .eyes{animation-delay:-.6s}.ttt-h1 .eyes{animation-delay:-1.8s}.ttt-et .eyes{animation-delay:-.9s}.ttt-wi .eyes{animation-delay:-2.9s}
.ttt-char.is-walking .ttt-body{animation:ttt-sway ${WK} ease-in-out infinite}
.ttt-char.is-walking.is-facing-left .ttt-body{animation-name:ttt-sway-l}
.ttt-char.is-walking.is-facing-right .ttt-body{animation-name:ttt-sway-r}
.ttt-char.is-walking .bob{animation:ttt-bob ${WK} ease-in-out infinite}
.ttt-char.is-walking .shadow{animation:ttt-shadow ${WK} ease-in-out infinite}
.ttt-char.is-walking .leg-left{animation:ttt-step ${WK} ease-in-out infinite}
.ttt-char.is-walking .leg-right{animation:ttt-step-r ${WK} ease-in-out ${WK2} infinite}
.ttt-char.is-walking .arm-left{animation:ttt-arm-l ${WK} ease-in-out infinite}
.ttt-char.is-walking .arm-right{animation:ttt-arm-r ${WK} ease-in-out infinite}
.ttt-char.is-walking .head{animation:ttt-head ${WK} ease-in-out infinite}
.ttt-char.is-walking .hair{animation:ttt-hair-front ${WK} ease-in-out ${WK6} infinite}
.ttt-char.is-walking .hair-back{animation:ttt-hair ${WK} ease-in-out ${WK6} infinite}
.ttt-char.is-walking .antenna{animation-duration:${WK}}
.ttt-char.is-walking .scarf-tail{animation:ttt-tail ${WK} ease-in-out ${WK6} infinite}
.ttt-char.is-talking .mouth{animation:ttt-shut .76s step-end infinite}
.ttt-char.is-talking .mouth-open{animation:ttt-open .76s step-end infinite}
.ttt-char.is-talking .head-nod{animation:ttt-nod 1.15s ease-in-out infinite}
.ttt-char.is-talking .brows{animation:ttt-brow 1.15s ease-in-out infinite}
.ttt-char.is-talking:not(.is-walking):not(.is-cheering) .bob{animation:ttt-talk-bob .46s ease-in-out infinite}
.ttt-char.is-talking:not(.is-walking):not(.is-waving):not(.is-cheering) .arm-right{animation:ttt-gesture 2.2s ease-in-out infinite}
.ttt-char.is-waving .arm-right{animation:ttt-raise .3s ease-out both,ttt-wave .7s ease-in-out .3s infinite}
.ttt-char.is-cheering .arm-left{animation:ttt-cheer-l .5s ease-in-out infinite}
.ttt-char.is-cheering .arm-right{animation:ttt-cheer-r .5s ease-in-out infinite}
.ttt-char.is-cheering .bob{animation:ttt-hop .5s ease-in-out infinite}
.ttt-char.is-cheering .shadow{animation:ttt-hop-shadow .5s ease-in-out infinite}
.ttt-static *{animation:none!important;transition:none!important}
@keyframes ttt-breathe{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.2px)}}
@keyframes ttt-arm-idle{0%,100%{transform:rotate(0)}50%{transform:rotate(1.8deg)}}
@keyframes ttt-arm-idle-r{0%,100%{transform:rotate(0)}50%{transform:rotate(-1.8deg)}}
@keyframes ttt-idle-head{0%,100%{transform:rotate(0)}22%{transform:rotate(1.8deg)}44%{transform:rotate(0)}66%{transform:rotate(-1.6deg)}88%{transform:rotate(0)}}
@keyframes ttt-look{0%,16%,100%{transform:translate(0,0)}22%,38%{transform:translate(1.4px,0)}46%,62%{transform:translate(-1.4px,.5px)}70%,84%{transform:translate(0,0)}}
@keyframes ttt-blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
@keyframes ttt-sway{0%,50%,100%{transform:rotate(0)}25%{transform:rotate(2.2deg)}75%{transform:rotate(-2.2deg)}}
@keyframes ttt-sway-l{0%,50%,100%{transform:rotate(-2.6deg)}25%{transform:rotate(-.4deg)}75%{transform:rotate(-4.8deg)}}
@keyframes ttt-sway-r{0%,50%,100%{transform:rotate(2.6deg)}25%{transform:rotate(4.8deg)}75%{transform:rotate(.4deg)}}
@keyframes ttt-bob{0%,50%,100%{transform:translateY(0) scale(1.03,.965)}25%,75%{transform:translateY(-3px) scale(.985,1.025)}}
@keyframes ttt-shadow{0%,50%,100%{transform:scale(1)}25%,75%{transform:scale(.88,.9)}}
@keyframes ttt-step{0%,50%,100%{transform:scaleY(1) rotate(0)}13%{transform:scaleY(.86) rotate(3deg)}25%{transform:scaleY(.68) rotate(6deg)}38%{transform:scaleY(.86) rotate(3deg)}}
@keyframes ttt-step-r{0%,50%,100%{transform:scaleY(1) rotate(0)}13%{transform:scaleY(.86) rotate(-3deg)}25%{transform:scaleY(.68) rotate(-6deg)}38%{transform:scaleY(.86) rotate(-3deg)}}
@keyframes ttt-arm-l{0%,50%,100%{transform:rotate(0) scaleY(1)}25%{transform:rotate(13deg) scaleY(.96)}75%{transform:rotate(-6deg) scaleY(.8)}}
@keyframes ttt-arm-r{0%,50%,100%{transform:rotate(0) scaleY(1)}25%{transform:rotate(6deg) scaleY(.8)}75%{transform:rotate(-13deg) scaleY(.96)}}
@keyframes ttt-head{0%,50%,100%{transform:rotate(0)}25%{transform:rotate(-1.8deg)}75%{transform:rotate(1.8deg)}}
@keyframes ttt-hair{0%,50%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(.9px) rotate(2.4deg)}75%{transform:translateY(.9px) rotate(-2.4deg)}}
@keyframes ttt-hair-front{0%,50%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(.5px) rotate(1deg)}75%{transform:translateY(.5px) rotate(-1deg)}}
@keyframes ttt-antenna{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(3deg)}}
@keyframes ttt-tail-idle{0%,100%{transform:rotate(0)}50%{transform:rotate(3deg)}}
@keyframes ttt-tail{0%,50%,100%{transform:rotate(0)}25%{transform:rotate(7deg)}75%{transform:rotate(-7deg)}}
@keyframes ttt-nod{0%,100%{transform:rotate(0)}25%{transform:rotate(-2.5deg)}55%{transform:rotate(2deg)}80%{transform:rotate(-1deg)}}
@keyframes ttt-brow{0%,100%{transform:translateY(0)}30%{transform:translateY(-1.2px)}60%{transform:translateY(0)}}
@keyframes ttt-talk-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-.9px)}}
@keyframes ttt-gesture{0%,12%,100%{transform:rotate(0)}30%{transform:rotate(-48deg)}44%{transform:rotate(-38deg)}58%{transform:rotate(-50deg)}74%{transform:rotate(0)}}
@keyframes ttt-raise{from{transform:rotate(0)}to{transform:rotate(-128deg)}}
@keyframes ttt-wave{0%,100%{transform:rotate(-128deg)}50%{transform:rotate(-160deg)}}
@keyframes ttt-cheer-l{0%,100%{transform:rotate(150deg)}50%{transform:rotate(168deg)}}
@keyframes ttt-cheer-r{0%,100%{transform:rotate(-150deg)}50%{transform:rotate(-168deg)}}
@keyframes ttt-hop{0%,100%{transform:translateY(0) scale(1.03,.96)}50%{transform:translateY(-9px) scale(.98,1.03)}}
@keyframes ttt-hop-shadow{0%,100%{transform:scale(1)}50%{transform:scale(.8)}}
@keyframes ttt-open{0%{opacity:1}11%{opacity:0}19%{opacity:1}33%{opacity:0}40%{opacity:1}52%{opacity:0}61%{opacity:1}70%{opacity:0}83%{opacity:1}90%,100%{opacity:0}}
@keyframes ttt-shut{0%{opacity:0}11%{opacity:1}19%{opacity:0}33%{opacity:1}40%{opacity:0}52%{opacity:1}61%{opacity:0}70%{opacity:1}83%{opacity:0}90%,100%{opacity:1}}
@media (prefers-reduced-motion:reduce){
${rm('.ttt-char')}
}
${rm('.ttt-char.ttt-rm')}`;

  // ---------- montagem ----------
  const ARM_SPLAY = (k) => n('g', { transform: 'rotate(6 31 69)' }, k);
  function tree(cfg, opts = {}) {
    const c = resolve(cfg);
    const H = HAIRS[c.hair] || HAIRS.short, T = TOPS[c.top] || TOPS.tee, mk = MAKEUP[c.makeup];
    const corpse = c.makeup === 'corpse';
    const X = EXPRESSIONS[c.expression] || EXPRESSIONS.feliz;
    const lidFill = corpse ? '#f8fafc' : SKIN;
    const accs = (c.accessories || []).filter((id) => ACCS[id]);
    const bySlot = (s) => accs.filter((id) => ACCS[id].slot === s).map((id) => g(`acc acc-${id}`, ACCS[id].node));
    const arm = topArm(T);
    const cls = ['ttt-char', c.id && `ttt-${c.id}`, opts.static && 'ttt-static', opts.viewBox && opts.viewBox !== '0 0 100 140' && 'ttt-crop', opts.className].filter(Boolean).join(' ');
    return n('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: opts.viewBox || '0 0 100 140', class: cls },
      n('style', {}, CSS),
      g('shadow', SHADOW),
      g('ttt-body',
        g('leg-left', LEG),
        g('leg-right', mirror(LEG)),
        g('bob', g('upper',
          g('hips', HIPS),
          g('torso', T.torso()),
          g('arm-left', ARM_SPLAY(arm)),
          g('arm-right', mirror(ARM_SPLAY(arm))),
          g('head', g('head-nod',
            H.back && g('hair hair-back', H.back),
            H.ears !== false && EARS,
            headSkin(c.face),
            corpse && g('makeup makeup-base', corpseBase(c.face)),
            g('face',
              corpse && g('makeup makeup-marks', mk.marks),
              g('brows', X.brows ? X.brows() : BROWS),
              g('eyes-look', g('eyes', X.eyes ? X.eyes() : EYES, X.eyesLid && [lid(40.5, lidFill), lid(59.5, lidFill)], c.lashes && LASHES)),
              !corpse && NOSE,
              g('mouth', X.mouth ? X.mouth() : MOUTH),
              g('mouth-open', MOUTH_OPEN),
              bySlot('face'), slot('face')),
            g('hair', H.front),
            bySlot('head'), slot('head'))),
          bySlot('body'), slot('body')))));
  }

  function toSVG(node, d = 0, pretty = false) {
    if (typeof node === 'string') return node;
    if (node.slot) return '';
    const ind = pretty ? '\n' + '  '.repeat(d) : '';
    const a = Object.entries(node.attrs).map(([k, v]) => ` ${k}="${v}"`).join('');
    if (node.tag === 'style') return `${ind}<style>${pretty ? '\n' : ''}${node.kids.join('')}${pretty ? '\n' + '  '.repeat(d) : ''}</style>`;
    if (!node.kids.length) return `${ind}<${node.tag}${a}/>`;
    return `${ind}<${node.tag}${a}>${node.kids.map((k) => toSVG(k, d + 1, pretty)).join('')}${ind}</${node.tag}>`;
  }

  const colorsOf = (c) => ({ skin: c.skin, hair: c.hairColor, shirt: c.topColor, pants: c.pants, shoes: c.shoes, outline: c.outline });
  function svg(cfg, opts = {}) {
    const c = resolve(cfg), col = colorsOf(c);
    return toSVG(tree(cfg, opts), 0, !!opts.pretty).trim().replace(/var\(--(skin|hair|shirt|pants|shoes|outline)\)/g, (m, k) => `var(--${k}, ${col[k]})`);
  }

  // recortes para o editor
  const VIEWS = { full: '0 0 100 140', head: '6 0 88 82', bust: '8 0 84 108', torso: '14 56 72 56', neck: '14 34 72 60' };
  const MANNEQUIN = { skin: '#d29a68', hair: 'short', hairColor: '#8a5a2b', top: 'tee', topColor: '#94a3b8', pants: '#64748b' };
  function thumb(kind, id, base) {
    const b = Object.assign({}, MANNEQUIN, base || {});
    let cfg, view;
    if (kind === 'hair') { cfg = Object.assign({}, b, { hair: id, accessories: [] }); view = 'head'; }
    else if (kind === 'top') { cfg = Object.assign({}, b, { top: id }); view = 'torso'; }
    else if (kind === 'skin') { cfg = Object.assign({}, b, { skin: id, makeup: 'none', accessories: [] }); view = 'head'; }
    else if (kind === 'face') { cfg = Object.assign({}, b, { face: id, hair: 'bald', makeup: 'none', expression: 'feliz', accessories: [] }); view = 'head'; }
    else if (kind === 'expr') { cfg = Object.assign({}, b, { expression: id, accessories: [] }); view = 'head'; }
    else if (kind === 'makeup') { cfg = Object.assign({}, b, { makeup: id, accessories: [] }); view = 'head'; }
    else if (kind === 'acc') { cfg = Object.assign({}, b, { accessories: [id] }); view = ACCS[id].slot === 'body' ? 'neck' : 'head'; }
    else { cfg = b; view = 'full'; }
    return svg(cfg, { viewBox: VIEWS[view], static: true });
  }

  root.TTTChars = { PRESETS, BASE, SKINS, HAIRS, HAIR_COLORS, TOPS, CLOTH_COLORS, ACCS, MAKEUP, EXPRESSIONS, FACES, CSS, VIEWS, MANNEQUIN, resolve, tree, toSVG, svg, thumb, topArm, parts: { SHADOW, LEG, HIPS, EARS, headSkin, corpseBase, BROWS, EYES, LASHES, NOSE, MOUTH, MOUTH_OPEN } };
})(typeof window !== 'undefined' ? window : globalThis);
