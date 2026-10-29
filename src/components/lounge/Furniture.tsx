'use client';
/* Tech Tie Toys — móveis do Lounge (gerado de furniture.js; edite lá e gere de novo). */
import * as React from 'react';
import { FURNITURE } from './catalog';
import type { FurnitureId } from './catalog';

export * from './catalog';

export const FURNITURE_CSS = `.fur{overflow:visible}
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

const ART: Record<FurnitureId, React.ReactNode> = {
  'seat': (<>
      <g className="shadow">
        <ellipse cx={15} cy={37} rx={13} ry={3} fill="#000" opacity={0.2} />
      </g>
      <rect x={4} y={2} width={22} height={24} rx={8} fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={18} y={4} width={7} height={20} rx={4} fill="#000" opacity={0.12} />
      <path d="M8 10 Q8 6.4 11 5.4" fill="none" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.45} />
      <rect x={3} y={21} width={24} height={13} rx={5} fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={5} y={22.6} width={20} height={2.6} rx={1.3} fill="#fff" opacity={0.16} />
      <path d="M3.6 30 H26.4 Q26 33.4 22 33.6 H8 Q4 33.4 3.6 30Z" fill="#000" opacity={0.2} />
      <rect x={0.8} y={15} width={6} height={19} rx={3} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={23.2} y={15} width={6} height={19} rx={3} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={5} y={34} width={4} height={3} rx={1} fill="#0f172a" />
      <rect x={21} y={34} width={4} height={3} rx={1} fill="#0f172a" />
    </>),
  'sofa': (<>
      <g className="shadow">
        <ellipse cx={38} cy={42.5} rx={34} ry={3.4} fill="#000" opacity={0.2} />
      </g>
      <rect x={7} y={37} width={4} height={5} rx={1.5} fill="var(--accent)" />
      <rect x={65} y={37} width={4} height={5} rx={1.5} fill="var(--accent)" />
      <rect x={5} y={3} width={66} height={26} rx={10} fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M38 8 V26" fill="none" stroke="var(--outline)" strokeWidth={1} strokeLinecap="round" opacity={0.3} />
      <circle cx={12} cy={12} r={1.1} fill="var(--accent)" />
      <circle cx={20} cy={12} r={1.1} fill="var(--accent)" />
      <circle cx={28} cy={12} r={1.1} fill="var(--accent)" />
      <circle cx={48} cy={12} r={1.1} fill="var(--accent)" />
      <circle cx={56} cy={12} r={1.1} fill="var(--accent)" />
      <circle cx={64} cy={12} r={1.1} fill="var(--accent)" />
      <rect x={12} y={22} width={26} height={15} rx={5} fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={38} y={22} width={26} height={15} rx={5} fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={14} y={31.6} width={22} height={4.4} rx={2.2} fill="#000" opacity={0.14} />
      <rect x={40} y={31.6} width={22} height={4.4} rx={2.2} fill="#000" opacity={0.14} />
      <rect x={14} y={23.6} width={22} height={2.4} rx={1.2} fill="#fff" opacity={0.14} />
      <rect x={40} y={23.6} width={22} height={2.4} rx={1.2} fill="#fff" opacity={0.14} />
      <rect x={1} y={13} width={13} height={25} rx={6.5} fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={62} y={13} width={13} height={25} rx={6.5} fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M5 20 Q5 16.4 8.4 15.6" fill="none" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.4} />
      <path d="M71 20 Q71 16.4 67.6 15.6" fill="none" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.25} />
      <path d="M10 20 H13 V36 Q11 37 10 36Z" fill="#000" opacity={0.12} />
      <path d="M66 20 H63 V36 Q65 37 66 36Z" fill="#000" opacity={0.12} />
    </>),
  'popcorn': (<>
      <g className="shadow">
        <ellipse cx={28} cy={84.5} rx={24} ry={3.4} fill="#000" opacity={0.2} />
      </g>
      <circle cx={14} cy={82} r={3.8} fill="#334155" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <circle cx={42} cy={82} r={3.8} fill="#334155" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={6} y={50} width={44} height={31} rx={4} fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={12} y={52} width={7} height={27} rx={0} fill="#f8fafc" opacity={0.92} />
      <rect x={24} y={52} width={7} height={27} rx={0} fill="#f8fafc" opacity={0.92} />
      <rect x={36} y={52} width={7} height={27} rx={0} fill="#f8fafc" opacity={0.92} />
      <rect x={44} y={51} width={5} height={28} rx={0} fill="#000" opacity={0.12} />
      <rect x={4} y={46} width={48} height={7} rx={3} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={9} y={16} width={38} height={31} rx={4} fill="#e0f2fe" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" fillOpacity={0.55} />
      <circle cx={16} cy={41} r={3} fill="#fff7d6" stroke="#b45309" strokeWidth={0.8} strokeLinejoin="round" />
      <circle cx={23} cy={42} r={3} fill="#fff7d6" stroke="#b45309" strokeWidth={0.8} strokeLinejoin="round" />
      <circle cx={30} cy={41} r={3} fill="#fff7d6" stroke="#b45309" strokeWidth={0.8} strokeLinejoin="round" />
      <circle cx={37} cy={42} r={3} fill="#fff7d6" stroke="#b45309" strokeWidth={0.8} strokeLinejoin="round" />
      <circle cx={43} cy={40} r={3} fill="#fff7d6" stroke="#b45309" strokeWidth={0.8} strokeLinejoin="round" />
      <circle cx={19} cy={35} r={3} fill="#fff7d6" stroke="#b45309" strokeWidth={0.8} strokeLinejoin="round" />
      <circle cx={26} cy={36} r={3} fill="#fff7d6" stroke="#b45309" strokeWidth={0.8} strokeLinejoin="round" />
      <circle cx={33} cy={35} r={3} fill="#fff7d6" stroke="#b45309" strokeWidth={0.8} strokeLinejoin="round" />
      <circle cx={40} cy={35} r={3} fill="#fff7d6" stroke="#b45309" strokeWidth={0.8} strokeLinejoin="round" />
      <circle cx={23} cy={30} r={3} fill="#fff7d6" stroke="#b45309" strokeWidth={0.8} strokeLinejoin="round" />
      <circle cx={31} cy={30} r={3} fill="#fff7d6" stroke="#b45309" strokeWidth={0.8} strokeLinejoin="round" />
      <circle cx={37} cy={29} r={3} fill="#fff7d6" stroke="#b45309" strokeWidth={0.8} strokeLinejoin="round" />
      <circle cx={27} cy={25} r={3} fill="#fff7d6" stroke="#b45309" strokeWidth={0.8} strokeLinejoin="round" />
      <circle cx={34} cy={24} r={3} fill="#fff7d6" stroke="#b45309" strokeWidth={0.8} strokeLinejoin="round" />
      <rect x={9} y={16} width={38} height={31} rx={4} fill="none" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M12.4 21 V35" fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" opacity={0.7} />
      <rect x={6} y={8} width={44} height={10} rx={4} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <circle cx={12} cy={13} r={1.8} fill="#fff" className="bulb bulb-a" />
      <circle cx={20} cy={13} r={1.8} fill="#fff" className="bulb bulb-b" />
      <circle cx={28} cy={13} r={1.8} fill="#fff" className="bulb bulb-a" />
      <circle cx={36} cy={13} r={1.8} fill="#fff" className="bulb bulb-b" />
      <circle cx={44} cy={13} r={1.8} fill="#fff" className="bulb bulb-a" />
      <rect x={26} y={3} width={4} height={6} rx={1.5} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <circle cx={28} cy={3.6} r={3} fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
    </>),
  'soda': (<>
      <g className="shadow">
        <ellipse cx={21} cy={78.5} rx={17} ry={3.2} fill="#000" opacity={0.2} />
      </g>
      <rect x={6} y={76} width={6} height={3} rx={1} fill="#0f172a" />
      <rect x={30} y={76} width={6} height={3} rx={1} fill="#0f172a" />
      <rect x={3} y={4} width={36} height={72} rx={6} fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={7} y={9} width={28} height={40} rx={3} fill="#0f172a" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={8} y={21.4} width={26} height={1.4} rx={0} fill="#475569" />
      <rect x={9.4} y={12.4} width={6.4} height={9} rx={2} fill="#f43f5e" />
      <rect x={17.8} y={12.4} width={6.4} height={9} rx={2} fill="#facc15" />
      <rect x={26.200000000000003} y={12.4} width={6.4} height={9} rx={2} fill="#4ade80" />
      <rect x={8} y={33.4} width={26} height={1.4} rx={0} fill="#475569" />
      <rect x={9.4} y={24.4} width={6.4} height={9} rx={2} fill="#facc15" />
      <rect x={17.8} y={24.4} width={6.4} height={9} rx={2} fill="#4ade80" />
      <rect x={26.200000000000003} y={24.4} width={6.4} height={9} rx={2} fill="#f97316" />
      <rect x={8} y={45.4} width={26} height={1.4} rx={0} fill="#475569" />
      <rect x={9.4} y={36.4} width={6.4} height={9} rx={2} fill="#4ade80" />
      <rect x={17.8} y={36.4} width={6.4} height={9} rx={2} fill="#f97316" />
      <rect x={26.200000000000003} y={36.4} width={6.4} height={9} rx={2} fill="#f43f5e" />
      <path d="M10 11 V44" fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" opacity={0.25} />
      <rect x={7} y={53} width={28} height={13} rx={3} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <circle cx={13} cy={59.5} r={1.7} fill="#0f172a" />
      <circle cx={21} cy={59.5} r={1.7} fill="#0f172a" />
      <circle cx={29} cy={59.5} r={1.7} fill="#0f172a" />
      <rect x={11} y={69} width={20} height={5} rx={2} fill="#0f172a" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M32 6 H36 Q38 6 38 10 V72 Q38 75 35 75 H32Z" fill="#000" opacity={0.12} />
    </>),
  'ticket': (<>
      <g className="shadow">
        <ellipse cx={52} cy={74.5} rx={46} ry={3.6} fill="#000" opacity={0.2} />
      </g>
      <rect x={4} y={30} width={96} height={44} rx={5} fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={14} y={38} width={44} height={22} rx={4} fill="#0f172a" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={16} y={40} width={40} height={18} rx={3} fill="#fde68a" />
      <path d="M19 44 H27" fill="none" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.6} />
      <path d="M66 38 H90 V50 H66Z" fill="#fde047" stroke="var(--outline)" strokeWidth={1.1} strokeLinejoin="round" />
      <circle cx={66} cy={44} r={2.2} fill="var(--main)" />
      <circle cx={90} cy={44} r={2.2} fill="var(--main)" />
      <path d="M72 38.6 V49.4" fill="none" stroke="var(--outline)" strokeWidth={1} strokeLinecap="round" strokeDasharray="1.6 1.6" opacity={0.6} />
      <path d="M94 32 H100 V70 Q100 74 96 74 H94Z" fill="#000" opacity={0.14} />
      <rect x={2} y={57} width={100} height={8} rx={4} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={2} y={10} width={20} height={20} rx={0} fill="var(--main)" />
      <rect x={22} y={10} width={20} height={20} rx={0} fill="#f8fafc" />
      <rect x={42} y={10} width={20} height={20} rx={0} fill="var(--main)" />
      <rect x={62} y={10} width={20} height={20} rx={0} fill="#f8fafc" />
      <rect x={82} y={10} width={20} height={20} rx={0} fill="var(--main)" />
      <path d="M2 30 a10 10 0 0 0 20 0Z" fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M22 30 a10 10 0 0 0 20 0Z" fill="#f8fafc" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M42 30 a10 10 0 0 0 20 0Z" fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M62 30 a10 10 0 0 0 20 0Z" fill="#f8fafc" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M82 30 a10 10 0 0 0 20 0Z" fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={2} y={10} width={100} height={20} fill="none" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={0} y={5} width={104} height={7} rx={3} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <circle cx={52} cy={8.6} r={2} fill="var(--main)" stroke="var(--outline)" strokeWidth={1} strokeLinejoin="round" />
    </>),
  'table': (<>
      <g className="shadow">
        <ellipse cx={22} cy={46.5} rx={16} ry={3} fill="#000" opacity={0.2} />
      </g>
      <ellipse cx={22} cy={44} rx={11} ry={3.6} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={19.5} y={24} width={5} height={20} rx={2} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M2 20 V23 Q2 29 22 29 Q42 29 42 23 V20Z" fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M2 20 V23 Q2 29 22 29 Q42 29 42 23 V20Z" fill="#000" opacity={0.22} />
      <ellipse cx={22} cy={20} rx={20} ry={8} fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <ellipse cx={22} cy={20} rx={20} ry={8} fill="#fff" opacity={0.14} />
      <path d="M9 9 H19 L17.6 19.4 Q17.5 20.4 16.5 20.4 H11.5 Q10.5 20.4 10.4 19.4Z" fill="#ef4444" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={12.4} y={10} width={2.2} height={9.6} rx={0} fill="#f8fafc" opacity={0.9} />
      <circle cx={11} cy={8} r={2.8} fill="#fff7d6" stroke="#b45309" strokeWidth={0.8} strokeLinejoin="round" />
      <circle cx={15} cy={6.4} r={3} fill="#fff7d6" stroke="#b45309" strokeWidth={0.8} strokeLinejoin="round" />
      <circle cx={18.6} cy={8.2} r={2.6} fill="#fff7d6" stroke="#b45309" strokeWidth={0.8} strokeLinejoin="round" />
      <path d="M27.4 12 H35.6 L34.4 20.2 H28.6Z" fill="#f8fafc" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={28} y={14.4} width={7} height={3} rx={0} fill="#38bdf8" />
      <rect x={26.6} y={10.4} width={10} height={2.6} rx={1.2} fill="#ef4444" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M32 10.4 L33.6 4.6 L36.4 3.6" fill="none" stroke="var(--outline)" strokeWidth={1.3} strokeLinecap="round" />
    </>),
  'arcade': (<>
      <g className="shadow">
        <ellipse cx={22} cy={80.5} rx={18} ry={3.4} fill="#000" opacity={0.2} />
      </g>
      <rect x={6} y={77} width={6} height={3} rx={1} fill="#0f172a" />
      <rect x={32} y={77} width={6} height={3} rx={1} fill="#0f172a" />
      <rect x={3} y={2} width={38} height={76} rx={6} fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={6} y={5} width={32} height={11} rx={4} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M22 6.3 L23.1 9 L26 9.2 L23.7 11.1 L24.5 13.9 L22 12.3 L19.5 13.9 L20.3 11.1 L18 9.2 L20.9 9 Z" fill="#fff" />
      <rect x={7} y={18} width={30} height={24} rx={3} fill="#0f172a" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={10} y={21} width={24} height={18} rx={2} fill="#1e3a8a" />
      <g className="fx-pixel">
        <rect x={17} y={23} width={3} height={3} rx={0} fill="#4ade80" />
        <rect x={26} y={23} width={3} height={3} rx={0} fill="#4ade80" />
        <rect x={20} y={26} width={6} height={3} rx={0} fill="#4ade80" />
        <rect x={17} y={29} width={12} height={3} rx={0} fill="#4ade80" />
        <rect x={14} y={32} width={3} height={3} rx={0} fill="#4ade80" />
        <rect x={20} y={32} width={6} height={3} rx={0} fill="#4ade80" />
        <rect x={29} y={32} width={3} height={3} rx={0} fill="#4ade80" />
      </g>
      <path d="M11.4 23 Q11.4 22 13 22" fill="none" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" opacity={0.5} />
      <path d="M4 45 H40 L42 57 H2Z" fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M4 45 H40 L42 57 H2Z" fill="#000" opacity={0.28} />
      <circle cx={13} cy={50.6} r={3} fill="#ef4444" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <circle cx={24} cy={51.4} r={2} fill="#facc15" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <circle cx={30} cy={51.4} r={2} fill="#4ade80" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <circle cx={36} cy={50.8} r={2} fill="#f43f5e" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={8} y={61} width={28} height={2.4} rx={1.2} fill="var(--accent)" />
      <rect x={17} y={66} width={10} height={6} rx={1.5} fill="#0f172a" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <circle cx={22} cy={69} r={1} fill="#fde047" />
      <path d="M36 6 H38 Q40 6 40 10 V72 Q40 76 36 76Z" fill="#000" opacity={0.14} />
    </>),
  'plant': (<>
      <g className="shadow">
        <ellipse cx={18} cy={53} rx={12} ry={3} fill="#000" opacity={0.2} />
      </g>
      <ellipse cx={9} cy={24} rx={5.2} ry={13} fill="var(--accent)" transform="rotate(-38 9 24)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <ellipse cx={27} cy={24} rx={5.2} ry={13} fill="var(--accent)" transform="rotate(38 27 24)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <ellipse cx={13} cy={17} rx={5.2} ry={13} fill="var(--accent)" transform="rotate(-16 13 17)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <ellipse cx={23} cy={17} rx={5.2} ry={13} fill="var(--accent)" transform="rotate(16 23 17)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <ellipse cx={18} cy={12} rx={5.2} ry={13} fill="var(--accent)" transform="rotate(0 18 12)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M18 6 V16" fill="none" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" opacity={0.3} />
      <path d="M8 37 H28 L26 52 Q25.8 54 23.8 54 H12.2 Q10.2 54 10 52Z" fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={6} y={32} width={24} height={6} rx={3} fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M22 38 H27.6 L25.8 52 Q25.6 53.6 23.8 53.6 H21Z" fill="#000" opacity={0.15} />
      <path d="M10 41 L11 49" fill="none" stroke="#fff" strokeWidth={1.3} strokeLinecap="round" opacity={0.35} />
    </>),
  'rug': (<>
      <rect x={2} y={2} width={152} height={58} rx={12} fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={8} y={8} width={140} height={46} rx={8} fill="none" stroke="var(--accent)" strokeWidth={2.2} />
      <rect x={14} y={14} width={128} height={34} rx={5} fill="none" stroke="#fff" opacity={0.35} strokeDasharray="3 3" strokeWidth={1.2} />
      <path d="M78 19 L80.9 27 L89.4 27.3 L82.8 32.5 L85.1 40.7 L78 36 L70.9 40.7 L73.2 32.5 L66.6 27.3 L75.1 27 Z" fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M36 22 L44 31 L36 40 L28 31Z M120 22 L128 31 L120 40 L112 31Z" fill="var(--accent)" opacity={0.9} />
    </>),
  'rope': (<>
      <g className="shadow">
        <ellipse cx={10} cy={39.6} rx={9} ry={2.2} fill="#000" opacity={0.2} />
      </g>
      <ellipse cx={10} cy={38} rx={8} ry={3.2} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={8.2} y={12} width={3.6} height={26} rx={1.5} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <circle cx={10} cy={10} r={4} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M8.4 8.6 Q8.8 7.6 9.8 7.4" fill="none" stroke="#fff" strokeWidth={1.1} strokeLinecap="round" opacity={0.7} />
      <g className="shadow">
        <ellipse cx={86} cy={39.6} rx={9} ry={2.2} fill="#000" opacity={0.2} />
      </g>
      <ellipse cx={86} cy={38} rx={8} ry={3.2} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={84.2} y={12} width={3.6} height={26} rx={1.5} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <circle cx={86} cy={10} r={4} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M84.4 8.6 Q84.8 7.6 85.8 7.4" fill="none" stroke="#fff" strokeWidth={1.1} strokeLinecap="round" opacity={0.7} />
      <path d="M10 15 Q48 40 86 15" fill="none" stroke="var(--outline)" strokeWidth={6} strokeLinecap="round" />
      <path d="M10 15 Q48 40 86 15" fill="none" stroke="var(--main)" strokeWidth={3.6} strokeLinecap="round" />
      <path d="M14 17.4 Q30 28 44 29.4" fill="none" stroke="#fff" strokeWidth={1} strokeLinecap="round" opacity={0.4} />
    </>),
  'lamp': (<>
      <g className="shadow">
        <ellipse cx={15} cy={82} rx={11} ry={3} fill="#000" opacity={0.2} />
      </g>
      <ellipse cx={15} cy={28} rx={14} ry={5} fill="#fde68a" opacity={0.4} className="fx-glow" />
      <ellipse cx={15} cy={80} rx={9} ry={3.2} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={13.4} y={26} width={3.2} height={54} rx={1.4} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M5 26 L9 6 H21 L25 26Z" fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M19 6 H21 L25 26 H22Z" fill="#000" opacity={0.15} />
      <ellipse cx={15} cy={6} rx={6} ry={1.8} fill="#fff" opacity={0.4} />
      <path d="M9.4 12 L8 22" fill="none" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.45} />
    </>),
  'bin': (<>
      <g className="shadow">
        <ellipse cx={12} cy={33.4} rx={10} ry={2.6} fill="#000" opacity={0.2} />
      </g>
      <path d="M4 10 H20 L18.6 31 Q18.5 32.4 17 32.4 H7 Q5.5 32.4 5.4 31Z" fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M9.4 14 L9.4 28" fill="none" stroke="var(--outline)" strokeWidth={1} strokeLinecap="round" opacity={0.3} />
      <path d="M12 14 L12 28" fill="none" stroke="var(--outline)" strokeWidth={1} strokeLinecap="round" opacity={0.3} />
      <path d="M14.6 14 L14.6 28" fill="none" stroke="var(--outline)" strokeWidth={1} strokeLinecap="round" opacity={0.3} />
      <path d="M16 11 H20 L18.6 31 Q18.5 32.4 17 32.4 H15Z" fill="#000" opacity={0.14} />
      <rect x={2} y={6.6} width={20} height={5} rx={2.5} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
    </>),
  'screen': (<>
      <rect x={8} y={6} width={178} height={74} rx={4} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={16} y={12} width={162} height={62} rx={2} fill="#7dd3fc" />
      <circle cx={142} cy={30} r={10} fill="#fde047" />
      <ellipse cx={48} cy={28} rx={14} ry={5} fill="#fff" opacity={0.9} />
      <ellipse cx={58} cy={24} rx={9} ry={5} fill="#fff" opacity={0.9} />
      <path d="M16 74 V56 Q50 36 84 54 Q116 42 146 56 Q164 48 178 54 V74Z" fill="#4ade80" />
      <path d="M16 74 V64 Q56 52 100 66 Q140 56 178 64 V74Z" fill="#22c55e" />
      <circle cx={97} cy={43} r={12} fill="#fff" opacity={0.92} />
      <path d="M93 36 L104 43 L93 50Z" fill="#0f172a" />
      <rect x={16} y={12} width={162} height={62} rx={2} fill="none" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={2} y={80} width={190} height={12} rx={3} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M0 2 H26 Q18 22 23 42 Q27 62 19 82 H0Z" fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M9 4 Q6 40 9 80" fill="none" stroke="#000" strokeWidth={1.4} strokeLinecap="round" opacity={0.18} />
      <path d="M17 4 Q14 40 16 80" fill="none" stroke="#000" strokeWidth={1.4} strokeLinecap="round" opacity={0.18} />
      <g transform="matrix(-1 0 0 1 194 0)">
        <path d="M0 2 H26 Q18 22 23 42 Q27 62 19 82 H0Z" fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
        <path d="M9 4 Q6 40 9 80" fill="none" stroke="#000" strokeWidth={1.4} strokeLinecap="round" opacity={0.18} />
        <path d="M17 4 Q14 40 16 80" fill="none" stroke="#000" strokeWidth={1.4} strokeLinecap="round" opacity={0.18} />
      </g>
      <rect x={0} y={0} width={194} height={12} rx={3} fill="var(--main)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={1} y={9.6} width={192} height={2.4} rx={0} fill="#facc15" />
    </>),
  'poster-rocket': (<>
      <rect x={2} y={2} width={40} height={58} rx={3} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={5} y={5} width={34} height={52} rx={1.5} fill="var(--main)" />
      <circle cx={10} cy={12} r={0.9} fill="#fff" />
      <circle cx={34} cy={36} r={0.9} fill="#fff" />
      <circle cx={11} cy={26} r={0.9} fill="#fff" />
      <circle cx={30} cy={46} r={0.9} fill="#fff" />
      <circle cx={16} cy={44} r={0.9} fill="#fff" />
      <circle cx={30} cy={16} r={6} fill="#fde047" />
      <circle cx={28} cy={14.4} r={1.4} fill="#eab308" />
      <circle cx={32} cy={18} r={1} fill="#eab308" />
      <path d="M22 20 Q29 28 29 40 H15 Q15 28 22 20Z" fill="#f8fafc" stroke="var(--outline)" strokeWidth={1} strokeLinejoin="round" />
      <circle cx={22} cy={31} r={2.8} fill="#38bdf8" stroke="var(--outline)" strokeWidth={1} strokeLinejoin="round" />
      <path d="M15 36 L10 44 L15 42Z" fill="#f43f5e" stroke="var(--outline)" strokeWidth={1} strokeLinejoin="round" />
      <path d="M29 36 L34 44 L29 42Z" fill="#f43f5e" stroke="var(--outline)" strokeWidth={1} strokeLinejoin="round" />
      <path d="M18.6 40 L22 49 L25.4 40Z" fill="#fb923c" stroke="var(--outline)" strokeWidth={1} strokeLinejoin="round" className="fx-glow" />
      <rect x={9} y={51} width={26} height={2} rx={1} fill="#fff" opacity={0.8} />
      <rect x={13} y={54.2} width={18} height={1.6} rx={0.8} fill="#fff" opacity={0.6} />
    </>),
  'poster-clap': (<>
      <rect x={2} y={2} width={40} height={58} rx={3} fill="var(--accent)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={5} y={5} width={34} height={52} rx={1.5} fill="var(--main)" />
      <path d="M22 9 L25.3 17.5 L34.4 18 L27.3 23.7 L29.6 32.5 L22 27.6 L14.4 32.5 L16.7 23.7 L9.6 18 L18.7 17.5 Z" fill="#fde047" stroke="var(--outline)" strokeWidth={1.1} strokeLinejoin="round" />
      <rect x={11} y={40} width={22} height={12} rx={2} fill="#0f172a" stroke="var(--outline)" strokeWidth={1} strokeLinejoin="round" />
      <g transform="rotate(-10 11 40)">
        <rect x={11} y={34} width={22} height={6} rx={1.2} fill="#f8fafc" stroke="var(--outline)" strokeWidth={1} strokeLinejoin="round" />
        <rect x={15} y={34} width={3.2} height={6} rx={0} fill="#0f172a" />
        <rect x={21.4} y={34} width={3.2} height={6} rx={0} fill="#0f172a" />
        <rect x={27.8} y={34} width={3.2} height={6} rx={0} fill="#0f172a" />
      </g>
      <rect x={14} y={44} width={10} height={1.6} rx={0.8} fill="#fff" opacity={0.7} />
      <rect x={14} y={47.4} width={6} height={1.6} rx={0.8} fill="#fff" opacity={0.5} />
    </>),
  'neon': (<>
      <path d="M20 0 V9 M68 0 V9" fill="none" stroke="var(--outline)" strokeWidth={1.2} strokeLinecap="round" />
      <rect x={4} y={8} width={80} height={28} rx={8} fill="#0f172a" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={9} y={13} width={70} height={18} rx={6} fill="none" stroke="var(--main)" strokeWidth={6} opacity={0.3} className="fx-neon" />
      <rect x={9} y={13} width={70} height={18} rx={6} fill="none" stroke="var(--main)" strokeWidth={2.4} className="fx-neon" />
      <path d="M39 17 L39 27 L48 22Z" fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinejoin="round" className="fx-neon" />
      <path d="M22 17.4 L23.2 20.4 L26.4 20.6 L23.9 22.6 L24.7 25.7 L22 24 L19.3 25.7 L20.1 22.6 L17.6 20.6 L20.8 20.4 Z" fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M66 17.4 L67.2 20.4 L70.4 20.6 L67.9 22.6 L68.7 25.7 L66 24 L63.3 25.7 L64.1 22.6 L61.6 20.6 L64.8 20.4 Z" fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeLinejoin="round" />
    </>),
};

export function FurnitureStyles() {
  return <style>{FURNITURE_CSS}</style>;
}

export interface FurnitureProps extends Omit<React.SVGProps<SVGSVGElement>, 'children' | 'color'> {
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

export default Furniture;
