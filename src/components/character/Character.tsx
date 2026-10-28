'use client';
/* Tech Tie Toys — personagens v3 (gerado de characters.js; edite lá e gere de novo). */
import * as React from 'react';
import { PRESETS, VIEWS } from './catalog';
import type { AccessoryId, CharacterConfig, CharacterView, Emote, ExpressionId, FaceId, Facing, HairId, PresetId, TopId } from './catalog';

export * from './catalog';

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

export const CHARACTER_CSS = `.ttt-char{overflow:visible}
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
.ttt-char.is-walking .ttt-body{animation:ttt-sway var(--ttt-walk,.5s) ease-in-out infinite}
.ttt-char.is-walking.is-facing-left .ttt-body{animation-name:ttt-sway-l}
.ttt-char.is-walking.is-facing-right .ttt-body{animation-name:ttt-sway-r}
.ttt-char.is-walking .bob{animation:ttt-bob var(--ttt-walk,.5s) ease-in-out infinite}
.ttt-char.is-walking .shadow{animation:ttt-shadow var(--ttt-walk,.5s) ease-in-out infinite}
.ttt-char.is-walking .leg-left{animation:ttt-step var(--ttt-walk,.5s) ease-in-out infinite}
.ttt-char.is-walking .leg-right{animation:ttt-step-r var(--ttt-walk,.5s) ease-in-out calc(var(--ttt-walk,.5s) / -2) infinite}
.ttt-char.is-walking .arm-left{animation:ttt-arm-l var(--ttt-walk,.5s) ease-in-out infinite}
.ttt-char.is-walking .arm-right{animation:ttt-arm-r var(--ttt-walk,.5s) ease-in-out infinite}
.ttt-char.is-walking .head{animation:ttt-head var(--ttt-walk,.5s) ease-in-out infinite}
.ttt-char.is-walking .hair{animation:ttt-hair-front var(--ttt-walk,.5s) ease-in-out calc(var(--ttt-walk,.5s) / -7) infinite}
.ttt-char.is-walking .hair-back{animation:ttt-hair var(--ttt-walk,.5s) ease-in-out calc(var(--ttt-walk,.5s) / -7) infinite}
.ttt-char.is-walking .antenna{animation-duration:var(--ttt-walk,.5s)}
.ttt-char.is-walking .scarf-tail{animation:ttt-tail var(--ttt-walk,.5s) ease-in-out calc(var(--ttt-walk,.5s) / -7) infinite}
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
.ttt-char *{animation:none!important}
.ttt-char.is-talking .mouth{animation:ttt-shut .76s step-end infinite!important}
.ttt-char.is-talking .mouth-open{animation:ttt-open .76s step-end infinite!important}
}
.ttt-char.ttt-rm *{animation:none!important}
.ttt-char.ttt-rm.is-talking .mouth{animation:ttt-shut .76s step-end infinite!important}
.ttt-char.ttt-rm.is-talking .mouth-open{animation:ttt-open .76s step-end infinite!important}`;

const P = {
  shadow: (<>
      <ellipse cx={50} cy={130.6} rx={20} ry={4.2} fill="#000" opacity={0.32} />
    </>),
  leg: (<>
      <rect x={38} y={100} width={11} height={22} rx={5} fill="var(--pants)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <rect x={45} y={101.5} width={2.6} height={18} rx={1.3} fill="#000" opacity={0.13} />
      <path d="M35 126.5 Q35 120 40.5 120 H46 Q49.6 120 49.6 123.6 V127 Q49.6 130 46.8 130 H38 Q35 130 35 127.5Z" fill="var(--shoes)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M36.1 127.2 H48.5 V127.6 Q48.5 128.9 46.8 128.9 H38 Q36.1 128.9 36.1 127.8Z" fill="#000" opacity={0.22} />
      <path d="M38.8 122.6 H42.6" fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" opacity={0.55} />
    </>),
  hips: (<>
      <path d="M34.5 95 H65.5 L64.8 105 Q64.5 108.5 60.5 108.5 H39.5 Q35.5 108.5 35.2 105Z" fill="var(--pants)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M50 101 V108" fill="none" stroke="var(--outline)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" opacity={0.45} />
    </>),
  ears: (<>
      <ellipse cx={26.5} cy={48} rx={4.2} ry={5} fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M26 45.6 Q24.2 48 26 50.6" fill="none" stroke="#000" strokeWidth={1.2} opacity={0.2} strokeLinecap="round" />
      <g transform="matrix(-1 0 0 1 100 0)">
        <ellipse cx={26.5} cy={48} rx={4.2} ry={5} fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
        <path d="M26 45.6 Q24.2 48 26 50.6" fill="none" stroke="#000" strokeWidth={1.2} opacity={0.2} strokeLinecap="round" />
      </g>
    </>),
  brows: (<>
      <path d="M36.8 41.2 Q40.5 39.4 44.2 40.8" fill="none" stroke="var(--outline)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
      <path d="M55.8 40.8 Q59.5 39.4 63.2 41.2" fill="none" stroke="var(--outline)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
    </>),
  eyes: (<>
      <ellipse cx={40.5} cy={49} rx={3.3} ry={4.1} fill="var(--outline)" />
      <circle cx={41.7} cy={47.4} r={1.35} fill="#fff" />
      <circle cx={39.5} cy={50.7} r={0.6} fill="#fff" opacity={0.8} />
      <ellipse cx={59.5} cy={49} rx={3.3} ry={4.1} fill="var(--outline)" />
      <circle cx={60.7} cy={47.4} r={1.35} fill="#fff" />
      <circle cx={58.5} cy={50.7} r={0.6} fill="#fff" opacity={0.8} />
    </>),
  lashes: (<>
      <path d="M37.4 46.8 L35.2 45.4 M37.2 48.8 L35 48.6" fill="none" stroke="var(--outline)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M62.6 46.8 L64.8 45.4 M62.8 48.8 L65 48.6" fill="none" stroke="var(--outline)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </>),
  nose: (<>
      <path d="M48.6 53.6 Q50 54.8 51.4 53.6" fill="none" stroke="#000" strokeWidth={1.3} strokeLinecap="round" opacity={0.3} />
    </>),
  mouth: (<>
      <path d="M45.8 57.8 Q50 61.4 54.2 57.8" fill="none" stroke="var(--outline)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </>),
  mouthOpen: (<>
      <path d="M45 57.4 Q50 56.6 55 57.4 Q54.6 64.8 50 64.8 Q45.4 64.8 45 57.4Z" fill="#7f1d1d" stroke="var(--outline)" strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M46.3 58.1 Q50 57.5 53.7 58.1 L53.4 59.6 Q50 60 46.6 59.6Z" fill="#fff" />
      <path d="M47 62.8 Q50 60.6 53 62.8 Q51.6 64.4 50 64.4 Q48.4 64.4 47 62.8Z" fill="#fb7185" />
    </>),
};

const FACES: Record<FaceId, { skin: React.ReactNode; corpse: React.ReactNode }> = {
  redondo: { skin: (<>
      <path d="M26 44 A24 22.5 0 0 1 74 44 A24 22.5 0 0 1 26 44Z" fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <defs>
        <clipPath id="ttt-hc-redondo">
          <path d="M26 44 A24 22.5 0 0 1 74 44 A24 22.5 0 0 1 26 44Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#ttt-hc-redondo)">
        <path d="M26 44 A24 22.5 0 0 1 74 44 A24 22.5 0 0 1 26 44Z" fill="#000" opacity={0.1} />
        <path d="M26 44 A24 22.5 0 0 1 74 44 A24 22.5 0 0 1 26 44Z" fill="var(--skin)" transform="translate(-2.4 -1.8)" />
      </g>
    </>), corpse: (<>
      <g transform="translate(50 44.5) scale(.95) translate(-50 -44.5)">
        <path d="M26 44 A24 22.5 0 0 1 74 44 A24 22.5 0 0 1 26 44Z" fill="#eef2f7" />
        <g clipPath="url(#ttt-hc-redondo)">
          <path d="M26 44 A24 22.5 0 0 1 74 44 A24 22.5 0 0 1 26 44Z" fill="#000" opacity={0.08} />
          <path d="M26 44 A24 22.5 0 0 1 74 44 A24 22.5 0 0 1 26 44Z" fill="#eef2f7" transform="translate(-2.4 -1.8)" />
        </g>
      </g>
    </>) },
  oval: { skin: (<>
      <path d="M26 44 A24 22.5 0 0 1 74 44 C72 57 62 66.8 50 66.8 C38 66.8 28 57 26 44Z" fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <defs>
        <clipPath id="ttt-hc-oval">
          <path d="M26 44 A24 22.5 0 0 1 74 44 C72 57 62 66.8 50 66.8 C38 66.8 28 57 26 44Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#ttt-hc-oval)">
        <path d="M26 44 A24 22.5 0 0 1 74 44 C72 57 62 66.8 50 66.8 C38 66.8 28 57 26 44Z" fill="#000" opacity={0.1} />
        <path d="M26 44 A24 22.5 0 0 1 74 44 C72 57 62 66.8 50 66.8 C38 66.8 28 57 26 44Z" fill="var(--skin)" transform="translate(-2.4 -1.8)" />
      </g>
    </>), corpse: (<>
      <g transform="translate(50 44.5) scale(.95) translate(-50 -44.5)">
        <path d="M26 44 A24 22.5 0 0 1 74 44 C72 57 62 66.8 50 66.8 C38 66.8 28 57 26 44Z" fill="#eef2f7" />
        <g clipPath="url(#ttt-hc-oval)">
          <path d="M26 44 A24 22.5 0 0 1 74 44 C72 57 62 66.8 50 66.8 C38 66.8 28 57 26 44Z" fill="#000" opacity={0.08} />
          <path d="M26 44 A24 22.5 0 0 1 74 44 C72 57 62 66.8 50 66.8 C38 66.8 28 57 26 44Z" fill="#eef2f7" transform="translate(-2.4 -1.8)" />
        </g>
      </g>
    </>) },
  quadrado: { skin: (<>
      <path d="M26 44 A24 22.5 0 0 1 74 44 L74 52 Q74 66.4 62 66.4 H38 Q26 66.4 26 52Z" fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <defs>
        <clipPath id="ttt-hc-quadrado">
          <path d="M26 44 A24 22.5 0 0 1 74 44 L74 52 Q74 66.4 62 66.4 H38 Q26 66.4 26 52Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#ttt-hc-quadrado)">
        <path d="M26 44 A24 22.5 0 0 1 74 44 L74 52 Q74 66.4 62 66.4 H38 Q26 66.4 26 52Z" fill="#000" opacity={0.1} />
        <path d="M26 44 A24 22.5 0 0 1 74 44 L74 52 Q74 66.4 62 66.4 H38 Q26 66.4 26 52Z" fill="var(--skin)" transform="translate(-2.4 -1.8)" />
      </g>
    </>), corpse: (<>
      <g transform="translate(50 44.5) scale(.95) translate(-50 -44.5)">
        <path d="M26 44 A24 22.5 0 0 1 74 44 L74 52 Q74 66.4 62 66.4 H38 Q26 66.4 26 52Z" fill="#eef2f7" />
        <g clipPath="url(#ttt-hc-quadrado)">
          <path d="M26 44 A24 22.5 0 0 1 74 44 L74 52 Q74 66.4 62 66.4 H38 Q26 66.4 26 52Z" fill="#000" opacity={0.08} />
          <path d="M26 44 A24 22.5 0 0 1 74 44 L74 52 Q74 66.4 62 66.4 H38 Q26 66.4 26 52Z" fill="#eef2f7" transform="translate(-2.4 -1.8)" />
        </g>
      </g>
    </>) },
  coracao: { skin: (<>
      <path d="M26 44 A24 22.5 0 0 1 74 44 C75 53 64 61 50 67.8 C36 61 25 53 26 44Z" fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <defs>
        <clipPath id="ttt-hc-coracao">
          <path d="M26 44 A24 22.5 0 0 1 74 44 C75 53 64 61 50 67.8 C36 61 25 53 26 44Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#ttt-hc-coracao)">
        <path d="M26 44 A24 22.5 0 0 1 74 44 C75 53 64 61 50 67.8 C36 61 25 53 26 44Z" fill="#000" opacity={0.1} />
        <path d="M26 44 A24 22.5 0 0 1 74 44 C75 53 64 61 50 67.8 C36 61 25 53 26 44Z" fill="var(--skin)" transform="translate(-2.4 -1.8)" />
      </g>
    </>), corpse: (<>
      <g transform="translate(50 44.5) scale(.95) translate(-50 -44.5)">
        <path d="M26 44 A24 22.5 0 0 1 74 44 C75 53 64 61 50 67.8 C36 61 25 53 26 44Z" fill="#eef2f7" />
        <g clipPath="url(#ttt-hc-coracao)">
          <path d="M26 44 A24 22.5 0 0 1 74 44 C75 53 64 61 50 67.8 C36 61 25 53 26 44Z" fill="#000" opacity={0.08} />
          <path d="M26 44 A24 22.5 0 0 1 74 44 C75 53 64 61 50 67.8 C36 61 25 53 26 44Z" fill="#eef2f7" transform="translate(-2.4 -1.8)" />
        </g>
      </g>
    </>) },
  bochechuda: { skin: (<>
      <path d="M26 44 A24 22.5 0 0 1 74 44 C79 54 68 65.6 50 65.6 C32 65.6 21 54 26 44Z" fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <defs>
        <clipPath id="ttt-hc-bochechuda">
          <path d="M26 44 A24 22.5 0 0 1 74 44 C79 54 68 65.6 50 65.6 C32 65.6 21 54 26 44Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#ttt-hc-bochechuda)">
        <path d="M26 44 A24 22.5 0 0 1 74 44 C79 54 68 65.6 50 65.6 C32 65.6 21 54 26 44Z" fill="#000" opacity={0.1} />
        <path d="M26 44 A24 22.5 0 0 1 74 44 C79 54 68 65.6 50 65.6 C32 65.6 21 54 26 44Z" fill="var(--skin)" transform="translate(-2.4 -1.8)" />
      </g>
    </>), corpse: (<>
      <g transform="translate(50 44.5) scale(.95) translate(-50 -44.5)">
        <path d="M26 44 A24 22.5 0 0 1 74 44 C79 54 68 65.6 50 65.6 C32 65.6 21 54 26 44Z" fill="#eef2f7" />
        <g clipPath="url(#ttt-hc-bochechuda)">
          <path d="M26 44 A24 22.5 0 0 1 74 44 C79 54 68 65.6 50 65.6 C32 65.6 21 54 26 44Z" fill="#000" opacity={0.08} />
          <path d="M26 44 A24 22.5 0 0 1 74 44 C79 54 68 65.6 50 65.6 C32 65.6 21 54 26 44Z" fill="#eef2f7" transform="translate(-2.4 -1.8)" />
        </g>
      </g>
    </>) },
};

const HAIRS: Record<HairId, { ears: boolean; back: React.ReactNode; front: React.ReactNode }> = {
  long: {
    ears: false,
    back: (<>
      <path d="M25 48 Q21.5 18.5 50 18.5 Q78.5 18.5 75 48 L77.5 86 Q74 91.5 67.5 89 Q64.5 88 63.8 84 L63 62 H37 L36.2 84 Q35.5 88 32.5 89 Q26 91.5 22.5 86Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M70.6 52 L72.6 86.6 Q70 88.4 67.4 87.2 L66.4 54Z" fill="#000" opacity={0.18} />
    </>),
    front: (<>
      <path d="M26 47 Q24.5 20 50 20 Q75.5 20 74 47 Q71.5 37.5 64.5 31 Q58 39.5 44 40.2 Q33 41 26 47Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M26.2 47 Q26.4 38.4 31 34.2 Q29.8 46 31.6 58.4 Q28.6 60.4 26.4 57Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M73.8 47 Q73.6 38.4 69 34.2 Q70.2 46 68.4 58.4 Q71.4 60.4 73.6 57Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M35 27.4 Q41.5 23.2 48.5 23.2" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.35} />
      <path d="M64.5 31.2 Q62 26.6 58.6 23.6" fill="none" stroke="var(--outline)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.3} />
    </>),
  },
  afro: {
    ears: true,
    back: (<>
      <ellipse cx={50} cy={45} rx={30} ry={18} fill="var(--hair)" stroke="var(--outline)" strokeWidth={4.4} />
      <circle cx={74.5} cy={45.7} r={10.5} fill="var(--hair)" stroke="var(--outline)" strokeWidth={4.4} />
      <circle cx={74.3} cy={39.9} r={10.5} fill="var(--hair)" stroke="var(--outline)" strokeWidth={4.4} />
      <circle cx={69.2} cy={34.6} r={10.5} fill="var(--hair)" stroke="var(--outline)" strokeWidth={4.4} />
      <circle cx={60.6} cy={31.2} r={10.5} fill="var(--hair)" stroke="var(--outline)" strokeWidth={4.4} />
      <circle cx={50} cy={30} r={10.5} fill="var(--hair)" stroke="var(--outline)" strokeWidth={4.4} />
      <circle cx={39.4} cy={31.2} r={10.5} fill="var(--hair)" stroke="var(--outline)" strokeWidth={4.4} />
      <circle cx={30.8} cy={34.6} r={10.5} fill="var(--hair)" stroke="var(--outline)" strokeWidth={4.4} />
      <circle cx={25.7} cy={39.9} r={10.5} fill="var(--hair)" stroke="var(--outline)" strokeWidth={4.4} />
      <circle cx={25.5} cy={40.3} r={10.5} fill="var(--hair)" stroke="var(--outline)" strokeWidth={4.4} />
      <ellipse cx={50} cy={45} rx={30} ry={18} fill="var(--hair)" />
      <circle cx={74.5} cy={45.7} r={10.5} fill="var(--hair)" />
      <circle cx={74.3} cy={39.9} r={10.5} fill="var(--hair)" />
      <circle cx={69.2} cy={34.6} r={10.5} fill="var(--hair)" />
      <circle cx={60.6} cy={31.2} r={10.5} fill="var(--hair)" />
      <circle cx={50} cy={30} r={10.5} fill="var(--hair)" />
      <circle cx={39.4} cy={31.2} r={10.5} fill="var(--hair)" />
      <circle cx={30.8} cy={34.6} r={10.5} fill="var(--hair)" />
      <circle cx={25.7} cy={39.9} r={10.5} fill="var(--hair)" />
      <circle cx={25.5} cy={40.3} r={10.5} fill="var(--hair)" />
      <circle cx={37} cy={28} r={3} fill="#fff" opacity={0.12} />
      <circle cx={30} cy={37} r={2.2} fill="#fff" opacity={0.12} />
      <circle cx={63} cy={27} r={2.6} fill="#fff" opacity={0.12} />
      <circle cx={71.5} cy={38} r={1.8} fill="#fff" opacity={0.12} />
      <circle cx={50} cy={22.6} r={2} fill="#fff" opacity={0.12} />
      <path d="M21.4 50 Q24 47.4 26.6 50" fill="none" stroke="#000" strokeWidth={1.3} opacity={0.22} strokeLinecap="round" />
      <path d="M73.4 50 Q76 47.4 78.6 50" fill="none" stroke="#000" strokeWidth={1.3} opacity={0.22} strokeLinecap="round" />
      <path d="M31.4 24.6 Q34 22 36.6 24.6" fill="none" stroke="#000" strokeWidth={1.3} opacity={0.22} strokeLinecap="round" />
      <path d="M63.4 24.6 Q66 22 68.6 24.6" fill="none" stroke="#000" strokeWidth={1.3} opacity={0.22} strokeLinecap="round" />
    </>),
    front: (<>
      <path d="M27.6 44.5 Q27 24 50 24 Q73 24 72.4 44.5 Q69.5 35 61.5 31.8 Q55.5 34 50 31.5 Q44.5 34 38.5 31.8 Q30.5 35 27.6 44.5Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
    </>),
  },
  short: {
    ears: true,
    back: null,
    front: (<>
      <path d="M26.2 45 Q24 18.8 50 18.8 Q76 18.8 73.8 45 Q73 37 68.6 33.4 Q66.6 37.6 61 37 Q58 32.4 52.5 34.6 Q46 38 40 35.2 Q36 38.6 31.4 36.2 Q28.2 39.2 26.2 45Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M61 37 Q58 32.4 52.5 34.6 Q57 32 59.6 30.6 Q61.6 33.6 61 37Z" fill="#000" opacity={0.2} />
      <path d="M37 25 Q44 21.6 52 22.2" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.35} />
    </>),
  },
  mohawk: {
    ears: true,
    back: null,
    front: (<>
      <path d="M26.6 44 Q26 26.4 37.6 21.8 L40.6 33 Q31.2 35.4 26.6 44Z M73.4 44 Q74 26.4 62.4 21.8 L59.4 33 Q68.8 35.4 73.4 44Z" fill="var(--hair)" opacity={0.4} />
      <path d="M39.5 34 L34.5 22 L42.6 24.6 L44 18 L50 22 L56 18 L57.4 24.6 L65.5 22 L60.5 34 Q50 29.5 39.5 34Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M50 22 L52.6 30.6 Q50 30.1 47.4 30.6Z" fill="#000" opacity={0.22} />
      <path d="M44 21.6 L45.4 27.2" fill="none" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.4} />
    </>),
  },
  devilock: {
    ears: true,
    back: null,
    front: (<>
      <path d="M26.4 44.5 Q24.6 19 50 19 Q75.4 19 73.6 44.5 Q72 36 66 32 Q60.4 33.2 55.4 32 L52.2 56.6 L49.4 52.6 L46.6 55.2 Q45.4 45 44.4 33.2 Q36 33.8 31 37 Q28 40 26.4 44.5Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M49.4 35.6 L50.4 49.6" fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" opacity={0.32} />
      <path d="M36 25.6 Q42 22.2 49 22.2" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.3} />
      <path d="M58.4 24.4 Q64 25.6 67.6 29" fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" opacity={0.2} />
    </>),
  },
  pigtails: {
    ears: true,
    back: (<>
      <path d="M25 38 Q12.5 39.5 12 55 Q11.6 67 18.6 74.4 Q17.4 62.4 21.4 56 Q25.4 50.4 28 46Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M20 46 Q15.6 52 16 62 Q16.4 68 18.6 74.4 Q17.4 62.4 21.4 56Z" fill="#000" opacity={0.18} />
      <path d="M17.6 47 Q15.4 52 15.6 58" fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" opacity={0.3} />
      <g transform="matrix(-1 0 0 1 100 0)">
        <path d="M25 38 Q12.5 39.5 12 55 Q11.6 67 18.6 74.4 Q17.4 62.4 21.4 56 Q25.4 50.4 28 46Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
        <path d="M20 46 Q15.6 52 16 62 Q16.4 68 18.6 74.4 Q17.4 62.4 21.4 56Z" fill="#000" opacity={0.18} />
        <path d="M17.6 47 Q15.4 52 15.6 58" fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" opacity={0.3} />
      </g>
      <circle cx={25.4} cy={40.4} r={3.4} fill="#f472b6" stroke="var(--outline)" strokeWidth={1.6} strokeLinejoin="round" />
      <circle cx={74.6} cy={40.4} r={3.4} fill="#f472b6" stroke="var(--outline)" strokeWidth={1.6} strokeLinejoin="round" />
    </>),
    front: (<>
      <path d="M26.2 46 Q24.5 19.5 50 19.5 Q75.5 19.5 73.8 46 Q71 36 63 32.5 Q56 34 50.8 26 Q50 33 41 35 Q31 36.5 26.2 46Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M34.6 28 Q39.6 23.6 46 22.8" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.35} />
    </>),
  },
  curly: {
    ears: false,
    back: (<>
      <circle cx={50} cy={29} r={9} fill="var(--hair)" stroke="var(--outline)" strokeWidth={4.4} />
      <circle cx={38.5} cy={30.5} r={9} fill="var(--hair)" stroke="var(--outline)" strokeWidth={4.4} />
      <circle cx={61.5} cy={30.5} r={9} fill="var(--hair)" stroke="var(--outline)" strokeWidth={4.4} />
      <circle cx={29.5} cy={37} r={8.5} fill="var(--hair)" stroke="var(--outline)" strokeWidth={4.4} />
      <circle cx={70.5} cy={37} r={8.5} fill="var(--hair)" stroke="var(--outline)" strokeWidth={4.4} />
      <circle cx={25.5} cy={48} r={8} fill="var(--hair)" stroke="var(--outline)" strokeWidth={4.4} />
      <circle cx={74.5} cy={48} r={8} fill="var(--hair)" stroke="var(--outline)" strokeWidth={4.4} />
      <circle cx={26.5} cy={59} r={7.5} fill="var(--hair)" stroke="var(--outline)" strokeWidth={4.4} />
      <circle cx={73.5} cy={59} r={7.5} fill="var(--hair)" stroke="var(--outline)" strokeWidth={4.4} />
      <circle cx={30} cy={68} r={6.5} fill="var(--hair)" stroke="var(--outline)" strokeWidth={4.4} />
      <circle cx={70} cy={68} r={6.5} fill="var(--hair)" stroke="var(--outline)" strokeWidth={4.4} />
      <circle cx={50} cy={29} r={9} fill="var(--hair)" />
      <circle cx={38.5} cy={30.5} r={9} fill="var(--hair)" />
      <circle cx={61.5} cy={30.5} r={9} fill="var(--hair)" />
      <circle cx={29.5} cy={37} r={8.5} fill="var(--hair)" />
      <circle cx={70.5} cy={37} r={8.5} fill="var(--hair)" />
      <circle cx={25.5} cy={48} r={8} fill="var(--hair)" />
      <circle cx={74.5} cy={48} r={8} fill="var(--hair)" />
      <circle cx={26.5} cy={59} r={7.5} fill="var(--hair)" />
      <circle cx={73.5} cy={59} r={7.5} fill="var(--hair)" />
      <circle cx={30} cy={68} r={6.5} fill="var(--hair)" />
      <circle cx={70} cy={68} r={6.5} fill="var(--hair)" />
      <circle cx={34} cy={26.4} r={2.2} fill="#fff" opacity={0.14} />
      <circle cx={52} cy={23.6} r={2} fill="#fff" opacity={0.14} />
      <circle cx={24} cy={45} r={1.8} fill="#fff" opacity={0.14} />
      <circle cx={72} cy={33} r={1.8} fill="#fff" opacity={0.14} />
    </>),
    front: (<>
      <path d="M27 46 Q25 24 40 22 Q50 19.8 60 22 Q75 24 73 46 Q71.5 40 67 37.5 Q66 41.5 61.5 40 Q59 35 54 36.8 Q50.5 40.5 46 37.6 Q41.5 35 38.5 40 Q34 41.5 33 37.5 Q28.5 40 27 46Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M38 25.6 Q44 22.8 50 23" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" opacity={0.3} />
    </>),
  },
  bun: {
    ears: true,
    back: (<>
      <circle cx={50} cy={14.5} r={9.4} fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M56 8 Q61 13 57.4 21 Q59 14 56 8Z" fill="#000" opacity={0.2} />
      <path d="M44.6 11 Q47 8.4 50.4 8.2" fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" opacity={0.35} />
    </>),
    front: (<>
      <path d="M26.4 45 Q24.6 20 50 20 Q75.4 20 73.6 45 Q72.4 36 66 31.6 Q58 36 50 31 Q42 36 34 31.6 Q27.6 36 26.4 45Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M36 26.6 Q42 22.6 50 22.8" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.35} />
      <ellipse cx={50} cy={21.6} rx={6.6} ry={2.2} fill="#f472b6" stroke="var(--outline)" strokeWidth={1.4} strokeLinejoin="round" />
    </>),
  },
  ponytail: {
    ears: true,
    back: (<>
      <path d="M62 22.4 Q88 14 90 42 Q91 58 81 68 Q82 56 77 49 Q70 42 64 36Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M84 40 Q86 52 81 68 Q82 56 77 49Z" fill="#000" opacity={0.2} />
      <path d="M80 26 Q86 30 87 38" fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" opacity={0.3} />
    </>),
    front: (<>
      <path d="M26.2 46 Q24.4 19.4 50 19.4 Q75.6 19.4 73.8 46 Q72 36.6 66 33 Q58 36.6 50 30 Q42 37 34 33.6 Q28 37 26.2 46Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M36 26 Q42 22 50 22.4" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.35} />
      <circle cx={69.6} cy={25} r={3.6} fill="#38bdf8" stroke="var(--outline)" strokeWidth={1.6} strokeLinejoin="round" />
    </>),
  },
  bob: {
    ears: false,
    back: (<>
      <path d="M24.4 50 Q21 18.4 50 18.4 Q79 18.4 75.6 50 L76.2 68 Q75.2 73 69 71.6 Q65.4 70.4 64.8 65 H35.2 Q34.6 70.4 31 71.6 Q24.8 73 23.8 68Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M70.6 52 L72 68 Q71 70 68.4 70 L67.4 54Z" fill="#000" opacity={0.18} />
    </>),
    front: (<>
      <path d="M26 47 Q24.4 20 50 20 Q75.6 20 74 47 L71 42 Q70 35 64 34.6 Q57 37.6 50 35 Q43 37.6 36 34.6 Q30 35 29 42Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M35 26.4 Q42 22 49.4 22.4" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.35} />
    </>),
  },
  spiky: {
    ears: true,
    back: null,
    front: (<>
      <path d="M26.4 44 L24.4 31 L31.4 33.6 L31.2 21.6 L38.6 27 L42.4 17.6 L47.2 25.4 L52.4 16.6 L56.4 25.6 L62 18.6 L64 28 L70.6 22.8 L69.6 34 L75.6 31.6 L73.6 44 Q72.4 37 66 33.8 Q58 37.6 50 33.8 Q42 37.6 34 33.8 Q28 37 26.4 44Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M52.4 16.6 L56.4 25.6 L54 26Z" fill="#000" opacity={0.2} />
      <path d="M42.6 19.6 L44 24.4" fill="none" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.4} />
    </>),
  },
  wild: {
    ears: false,
    back: null,
    front: (<>
      <path d="M25 48 L21.6 41 L26 38.6 L22.6 31 L29 30 L28 22.6 L35 25 L36.6 18.6 L42.6 22.8 L47 17.4 L51.4 22.4 L57 17.8 L60 23.4 L66.4 19.6 L66.6 26.4 L73 25.2 L71.4 32 L77.6 34 L74.4 40.4 L78.4 44.4 L74.2 48 Q73 40 66.4 36 Q58 40 50 35.4 Q42 40 33.6 36 Q27 40 25 48Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M31 28 L33 23.6" fill="none" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.35} />
      <path d="M54 21.6 L56.6 25.4" fill="none" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.3} />
    </>),
  },
  bald: {
    ears: true,
    back: null,
    front: (<>
      <path d="M27.4 43.6 Q21.6 38.6 26 33 Q30.2 29.6 33.2 33.6 Q29 35.4 29.8 41.6Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <g transform="matrix(-1 0 0 1 100 0)">
        <path d="M27.4 43.6 Q21.6 38.6 26 33 Q30.2 29.6 33.2 33.6 Q29 35.4 29.8 41.6Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      </g>
      <path d="M49.6 22.2 Q46.4 15.8 51 14.4 Q55.6 15.8 52.4 21.4" fill="none" stroke="var(--outline)" strokeWidth={5} strokeLinecap="round" />
      <path d="M49.6 22.2 Q46.4 15.8 51 14.4 Q55.6 15.8 52.4 21.4" fill="none" stroke="var(--hair)" strokeWidth={2.6} strokeLinecap="round" />
    </>),
  },
};

const TOPS: Record<TopId, { torso: React.ReactNode; arm: React.ReactNode }> = {
  tee: {
    torso: (<>
      <path d="M38 66 H62 Q69.5 66 69.8 73.5 L67.3 98 Q66.8 104 60.5 104 H39.5 Q33.2 104 32.7 98 L30.2 73.5 Q30.5 66 38 66Z" fill="var(--shirt)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M63.6 67.3 Q68.4 68 68.6 73.6 L66.1 97.8 Q65.7 102.8 60.5 102.9 H58.6 Q64.6 90 63.6 67.3Z" fill="#000" opacity={0.13} />
      <path d="M43.4 66.4 Q50 72.6 56.6 66.4Z" fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M42.6 66.6 Q50 74.2 57.4 66.6" fill="none" stroke="var(--outline)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
      <path d="M50 79 L51.5 82.9 L55.7 83.1 L52.5 85.8 L53.5 89.9 L50 87.6 L46.5 89.9 L47.5 85.8 L44.3 83.1 L48.5 82.9 Z" fill="#fde047" stroke="var(--outline)" strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M33.4 99.4 Q50 101.4 66.6 99.4" fill="none" stroke="var(--outline)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.22} />
    </>),
    arm: (<>
      <rect x={26.5} y={70} width={9} height={22} rx={4.5} fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <circle cx={31} cy={93} r={4.8} fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M28.6 91.4 Q29.6 90 31 89.8" fill="none" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" opacity={0.3} />
      <rect x={25} y={66.5} width={12} height={12.5} rx={5.5} fill="var(--shirt)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <rect x={33} y={68.2} width={2.6} height={9.4} rx={1.3} fill="#000" opacity={0.12} />
    </>),
  },
  hoodie: {
    torso: (<>
      <path d="M38 66 H62 Q69.5 66 69.8 73.5 L67.3 98 Q66.8 104 60.5 104 H39.5 Q33.2 104 32.7 98 L30.2 73.5 Q30.5 66 38 66Z" fill="var(--shirt)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M63.6 67.3 Q68.4 68 68.6 73.6 L66.1 97.8 Q65.7 102.8 60.5 102.9 H58.6 Q64.6 90 63.6 67.3Z" fill="#000" opacity={0.13} />
      <path d="M32.9 98.2 Q33.3 104 39.5 104 H60.5 Q66.7 104 67.1 98.2Z" fill="#000" opacity={0.16} />
      <path d="M39.2 104 L40.8 89.2 Q41.2 87.6 43.2 87.6 H56.8 Q58.8 87.6 59.2 89.2 L60.8 104Z" fill="var(--shirt)" stroke="var(--outline)" strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M42 88.8 H58 L58.4 92 H41.6Z" fill="#000" opacity={0.12} />
      <path d="M35 68.5 Q50 82.5 65 68.5 Q60.5 63 50 63 Q39.5 63 35 68.5Z" fill="var(--shirt)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M38.6 68.6 Q50 77.4 61.4 68.6 Q57 65.6 50 65.6 Q43 65.6 38.6 68.6Z" fill="#000" opacity={0.24} />
      <path d="M46 74.5 V84.4 M54 74.5 V84.4" fill="none" stroke="#f8fafc" strokeWidth={1.8} strokeLinecap="round" />
      <circle cx={46} cy={85.4} r={1.2} fill="#f8fafc" />
      <circle cx={54} cy={85.4} r={1.2} fill="#f8fafc" />
    </>),
    arm: (<>
      <rect x={25.8} y={66.5} width={10.4} height={24} rx={5.2} fill="var(--shirt)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <rect x={32.6} y={68.4} width={2.4} height={20} rx={1.2} fill="#000" opacity={0.12} />
      <rect x={26.9} y={85.2} width={8.2} height={4.2} rx={1.6} fill="#000" opacity={0.18} />
      <circle cx={31} cy={93} r={4.8} fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M28.6 91.4 Q29.6 90 31 89.8" fill="none" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" opacity={0.3} />
    </>),
  },
  striped: {
    torso: (<>
      <path d="M38 66 H62 Q69.5 66 69.8 73.5 L67.3 98 Q66.8 104 60.5 104 H39.5 Q33.2 104 32.7 98 L30.2 73.5 Q30.5 66 38 66Z" fill="var(--shirt)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M31.6 74.6 H68.4 L68.1 77.8 H31.9Z" fill="#f8fafc" opacity={0.92} />
      <path d="M32.3 81.6 H67.7 L67.3 84.8 H32.7Z" fill="#f8fafc" opacity={0.92} />
      <path d="M33 88.6 H67 L66.6 91.8 H33.4Z" fill="#f8fafc" opacity={0.92} />
      <path d="M33.7 95 H66.3 L66 98.2 H34Z" fill="#f8fafc" opacity={0.92} />
      <path d="M63.6 67.3 Q68.4 68 68.6 73.6 L66.1 97.8 Q65.7 102.8 60.5 102.9 H58.6 Q64.6 90 63.6 67.3Z" fill="#000" opacity={0.13} />
      <path d="M43.4 66.4 Q50 72.6 56.6 66.4Z" fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M42.6 66.6 Q50 74.2 57.4 66.6" fill="none" stroke="var(--outline)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
    </>),
    arm: (<>
      <rect x={26.5} y={70} width={9} height={22} rx={4.5} fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <circle cx={31} cy={93} r={4.8} fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M28.6 91.4 Q29.6 90 31 89.8" fill="none" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" opacity={0.3} />
      <rect x={25} y={66.5} width={12} height={12.5} rx={5.5} fill="var(--shirt)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <rect x={33} y={68.2} width={2.6} height={9.4} rx={1.3} fill="#000" opacity={0.12} />
      <rect x={26.2} y={71} width={9.6} height={3} rx={0} fill="#f8fafc" opacity={0.92} />
    </>),
  },
  bomber: {
    torso: (<>
      <path d="M38 66 H62 Q69.5 66 69.8 73.5 L67.3 98 Q66.8 104 60.5 104 H39.5 Q33.2 104 32.7 98 L30.2 73.5 Q30.5 66 38 66Z" fill="var(--shirt)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M63.6 67.3 Q68.4 68 68.6 73.6 L66.1 97.8 Q65.7 102.8 60.5 102.9 H58.6 Q64.6 90 63.6 67.3Z" fill="#000" opacity={0.13} />
      <path d="M32.9 98.2 Q33.3 104 39.5 104 H60.5 Q66.7 104 67.1 98.2Z" fill="#000" opacity={0.16} />
      <path d="M35.5 99.2 V103.2" fill="none" stroke="var(--outline)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
      <path d="M40 99.2 V103.2" fill="none" stroke="var(--outline)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
      <path d="M44.5 99.2 V103.2" fill="none" stroke="var(--outline)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
      <path d="M55.5 99.2 V103.2" fill="none" stroke="var(--outline)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
      <path d="M60 99.2 V103.2" fill="none" stroke="var(--outline)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
      <path d="M64.5 99.2 V103.2" fill="none" stroke="var(--outline)" strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
      <path d="M42 66.4 L50 84 L58 66.4Z" fill="#f8fafc" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M42 66.4 L50 84 L58 66.4" fill="none" stroke="#000" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" opacity={0.25} />
      <path d="M50 84 V103.6" fill="none" stroke="var(--outline)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={60.6} cy={78} r={3.4} fill="#fde047" stroke="var(--outline)" strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M61.4 75.8 L59.4 78.4 H61.4 L59.8 80.4" fill="none" stroke="var(--outline)" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round" />
    </>),
    arm: (<>
      <rect x={25.8} y={66.5} width={10.4} height={24} rx={5.2} fill="var(--shirt)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <rect x={32.6} y={68.4} width={2.4} height={20} rx={1.2} fill="#000" opacity={0.12} />
      <rect x={26.9} y={85.2} width={8.2} height={4.2} rx={1.6} fill="#000" opacity={0.18} />
      <circle cx={31} cy={93} r={4.8} fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M28.6 91.4 Q29.6 90 31 89.8" fill="none" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" opacity={0.3} />
    </>),
  },
  tank: {
    torso: (<>
      <path d="M38 66 H62 Q69.5 66 69.8 73.5 L67.3 98 Q66.8 104 60.5 104 H39.5 Q33.2 104 32.7 98 L30.2 73.5 Q30.5 66 38 66Z" fill="var(--shirt)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M32.7 85 H67.3 L66.9 89 H33.1Z" fill="#f8fafc" opacity={0.9} />
      <path d="M63.6 67.3 Q68.4 68 68.6 73.6 L66.1 97.8 Q65.7 102.8 60.5 102.9 H58.6 Q64.6 90 63.6 67.3Z" fill="#000" opacity={0.13} />
      <path d="M30.3 73.4 Q30.5 66 38 66 H40.6 Q40.4 75 33.8 79.4 Q31.4 79.4 30.6 76Z" fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <g transform="matrix(-1 0 0 1 100 0)">
        <path d="M30.3 73.4 Q30.5 66 38 66 H40.6 Q40.4 75 33.8 79.4 Q31.4 79.4 30.6 76Z" fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      </g>
      <path d="M42.4 66.4 Q50 76 57.6 66.4Z" fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
    </>),
    arm: (<>
      <rect x={26.5} y={70} width={9} height={22} rx={4.5} fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M33 72 V90" fill="#000" opacity={0} />
      <circle cx={31} cy={93} r={4.8} fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M28.6 91.4 Q29.6 90 31 89.8" fill="none" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" opacity={0.3} />
    </>),
  },
  shirt: {
    torso: (<>
      <path d="M38 66 H62 Q69.5 66 69.8 73.5 L67.3 98 Q66.8 104 60.5 104 H39.5 Q33.2 104 32.7 98 L30.2 73.5 Q30.5 66 38 66Z" fill="var(--shirt)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M63.6 67.3 Q68.4 68 68.6 73.6 L66.1 97.8 Q65.7 102.8 60.5 102.9 H58.6 Q64.6 90 63.6 67.3Z" fill="#000" opacity={0.13} />
      <path d="M43.6 66.2 L50 71.6 L56.4 66.2Z" fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M41.6 66 L50 71.6 L45.4 75.2 L40.2 68.4Z" fill="var(--shirt)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <g transform="matrix(-1 0 0 1 100 0)">
        <path d="M41.6 66 L50 71.6 L45.4 75.2 L40.2 68.4Z" fill="var(--shirt)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      </g>
      <path d="M50 71.6 V103.6" fill="none" stroke="var(--outline)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
      <circle cx={50} cy={78} r={1.1} fill="var(--outline)" opacity={0.7} />
      <circle cx={50} cy={85} r={1.1} fill="var(--outline)" opacity={0.7} />
      <circle cx={50} cy={92} r={1.1} fill="var(--outline)" opacity={0.7} />
      <circle cx={50} cy={99} r={1.1} fill="var(--outline)" opacity={0.7} />
      <path d="M36.4 77 H43.2 V82.4 Q39.8 83.8 36.4 82.4Z" fill="var(--shirt)" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
    </>),
    arm: (<>
      <rect x={25.8} y={66.5} width={10.4} height={24} rx={5.2} fill="var(--shirt)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <rect x={32.6} y={68.4} width={2.4} height={20} rx={1.2} fill="#000" opacity={0.12} />
      <path d="M26.6 86 H35.4" fill="none" stroke="var(--outline)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
      <circle cx={31} cy={93} r={4.8} fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M28.6 91.4 Q29.6 90 31 89.8" fill="none" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" opacity={0.3} />
    </>),
  },
  leather: {
    torso: (<>
      <path d="M38 66 H62 Q69.5 66 69.8 73.5 L67.3 98 Q66.8 104 60.5 104 H39.5 Q33.2 104 32.7 98 L30.2 73.5 Q30.5 66 38 66Z" fill="var(--shirt)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M42 66.4 L50 89 L58 66.4Z" fill="#f8fafc" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M63.6 67.3 Q68.4 68 68.6 73.6 L66.1 97.8 Q65.7 102.8 60.5 102.9 H58.6 Q64.6 90 63.6 67.3Z" fill="#000" opacity={0.13} />
      <path d="M32.9 98.2 Q33.3 104 39.5 104 H60.5 Q66.7 104 67.1 98.2Z" fill="#000" opacity={0.16} />
      <path d="M38 66.2 L44.6 66.2 L49.6 84 L43.4 80.2 L40.2 72Z" fill="var(--shirt)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M62 66.2 L55.4 66.2 L52.2 76.4 L58.2 80.2 L60.4 72Z" fill="var(--shirt)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M52.2 76.4 L57.6 103.4" fill="none" stroke="var(--outline)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M52.2 76.4 L57.6 103.4" fill="none" stroke="#cbd5e1" strokeWidth={0.8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1.2 1.2" />
      <rect x={46} y={99.4} width={8} height={4.6} rx={1} fill="#cbd5e1" stroke="var(--outline)" strokeWidth={1.2} strokeLinejoin="round" />
      <circle cx={34.4} cy={70.4} r={1.05} fill="#e2e8f0" />
      <circle cx={36.8} cy={68.4} r={1.05} fill="#e2e8f0" />
      <circle cx={65.6} cy={70.4} r={1.05} fill="#e2e8f0" />
      <circle cx={63.2} cy={68.4} r={1.05} fill="#e2e8f0" />
      <path d="M35 76 Q34.2 86 35.4 96" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" opacity={0.22} />
      <path d="M44 82.4 L46.6 84" fill="none" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.25} />
    </>),
    arm: (<>
      <rect x={25.8} y={66.5} width={10.4} height={24} rx={5.2} fill="var(--shirt)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <rect x={32.6} y={68.4} width={2.4} height={20} rx={1.2} fill="#000" opacity={0.12} />
      <path d="M26.6 86 H35.4" fill="none" stroke="var(--outline)" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
      <circle cx={29} cy={70} r={1} fill="#e2e8f0" />
      <circle cx={32.6} cy={70} r={1} fill="#e2e8f0" />
      <circle cx={31} cy={93} r={4.8} fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M28.6 91.4 Q29.6 90 31 89.8" fill="none" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" opacity={0.3} />
    </>),
  },
  robe: {
    torso: (<>
      <path d="M38 66 H62 Q69.5 66 69.8 73.5 L67.3 98 Q66.8 104 60.5 104 H39.5 Q33.2 104 32.7 98 L30.2 73.5 Q30.5 66 38 66Z" fill="var(--shirt)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M63.6 67.3 Q68.4 68 68.6 73.6 L66.1 97.8 Q65.7 102.8 60.5 102.9 H58.6 Q64.6 90 63.6 67.3Z" fill="#000" opacity={0.13} />
      <path d="M32.9 98.2 Q33.3 104 39.5 104 H60.5 Q66.7 104 67.1 98.2Z" fill="#000" opacity={0.16} />
      <path d="M33.8 96.4 H66.2 L65.6 101.80000000000001 H34.4Z" fill="#facc15" opacity={0.95} />
      <path d="M39.4 66.2 L50 84 L60.6 66.2Z" fill="#facc15" stroke="var(--outline)" strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M43.6 66.6 L50 77.6 L56.4 66.6Z" fill="var(--skin)" stroke="var(--outline)" strokeWidth={1.2} strokeLinejoin="round" />
      <path d="M41.6 87.4 L42.5 89.8 L45 89.9 L43 91.5 L43.7 93.9 L41.6 92.5 L39.5 93.9 L40.2 91.5 L38.2 89.9 L40.7 89.8 Z" fill="#fde047" stroke="var(--outline)" strokeWidth={1} strokeLinejoin="round" />
      <path d="M59 90.6 L59.8 92.5 L61.9 92.7 L60.2 94 L60.8 96 L59 94.9 L57.2 96 L57.8 94 L56.1 92.7 L58.2 92.5 Z" fill="#fde047" stroke="var(--outline)" strokeWidth={1} strokeLinejoin="round" />
      <path d="M36.6 77.6 L37.2 79.2 L38.9 79.3 L37.6 80.3 L38 81.9 L36.6 81 L35.2 81.9 L35.6 80.3 L34.3 79.3 L36 79.2 Z" fill="#fde047" />
    </>),
    arm: (<>
      <rect x={25.8} y={66.5} width={10.4} height={24} rx={5.2} fill="var(--shirt)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <rect x={32.6} y={68.4} width={2.4} height={20} rx={1.2} fill="#000" opacity={0.12} />
      <rect x={26.9} y={85.4} width={8.2} height={3.6} rx={1.2} fill="#facc15" opacity={0.95} />
      <circle cx={31} cy={93} r={4.8} fill="var(--skin)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M28.6 91.4 Q29.6 90 31 89.8" fill="none" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" opacity={0.3} />
    </>),
  },
};

const ACCS: Record<AccessoryId, { slot: 'head' | 'face' | 'body'; group: string; node: React.ReactNode }> = {
  cap: { slot: 'head', group: 'topo', node: (<>
      <path d="M26.6 36 Q26.6 15.6 50 15.6 Q73.4 15.6 73.4 36 Q50 31 26.6 36Z" fill="#ef4444" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M63 18.4 Q73.4 23 73.4 36 Q69 34.6 64.6 34Z" fill="#000" opacity={0.14} />
      <path d="M50 15.8 V32" fill="none" stroke="var(--outline)" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" opacity={0.3} />
      <circle cx={50} cy={25.6} r={4.2} fill="#f8fafc" stroke="var(--outline)" strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M50 23.2 L50.6 24.9 L52.5 25 L51 26.1 L51.5 27.9 L50 26.9 L48.5 27.9 L49 26.1 L47.5 25 L49.4 24.9 Z" fill="#ef4444" />
      <path d="M24 36.4 Q50 28.6 76 36.4 Q77 40.8 72 41.6 Q50 37.6 28 41.6 Q23 40.8 24 36.4Z" fill="#ef4444" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M27 40.6 Q50 36.4 73 40.6 Q50 38.6 27 40.6Z" fill="#000" opacity={0.3} />
      <circle cx={50} cy={16} r={1.8} fill="#ef4444" stroke="var(--outline)" strokeWidth={1.2} strokeLinejoin="round" />
      <path d="M33 27 Q36 21 42 18.6" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" opacity={0.35} />
    </>) },
  partyhat: { slot: 'head', group: 'topo', node: (<>
      <path d="M41 24.5 L53 2.8 L62 23.2 Q51.6 26.8 41 24.5Z" fill="#a78bfa" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M42.7 21.5 L60.7 20.3 L59.6 17.7 L44.2 18.6Z" fill="#fde047" />
      <path d="M46.3 15 L58 14.2 L57 11.8 L47.7 12.3Z" fill="#fde047" />
      <path d="M49.6 8.9 L55.5 8.5 L54.8 6.9 L50.6 7.1Z" fill="#fde047" />
      <path d="M53 2.8 L62 23.2 Q59 24.2 56 24.6Z" fill="#000" opacity={0.14} />
      <path d="M41 24.5 L53 2.8 L62 23.2 Q51.6 26.8 41 24.5Z" fill="none" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <circle cx={53} cy={3.6} r={3.6} fill="#f472b6" stroke="var(--outline)" strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M41.6 24.6 Q34 30 30 38" fill="none" stroke="var(--outline)" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
    </>) },
  crown: { slot: 'head', group: 'topo', node: (<>
      <path d="M37 27.4 L36 13.6 L42.4 19.4 L50 9.4 L57.6 19.4 L64 13.6 L63 27.4 Q50 29.6 37 27.4Z" fill="#facc15" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M37.3 23.6 Q50 25.8 62.7 23.6 L63 27.4 Q50 29.6 37 27.4Z" fill="#000" opacity={0.14} />
      <circle cx={50} cy={21.4} r={2.3} fill="#f43f5e" stroke="var(--outline)" strokeWidth={1.2} strokeLinejoin="round" />
      <circle cx={42.6} cy={22.6} r={1.6} fill="#38bdf8" stroke="var(--outline)" strokeWidth={1} strokeLinejoin="round" />
      <circle cx={57.4} cy={22.6} r={1.6} fill="#4ade80" stroke="var(--outline)" strokeWidth={1} strokeLinejoin="round" />
      <circle cx={36} cy={13.6} r={1.6} fill="#fde047" stroke="var(--outline)" strokeWidth={1.1} strokeLinejoin="round" />
      <circle cx={50} cy={9.4} r={1.6} fill="#fde047" stroke="var(--outline)" strokeWidth={1.1} strokeLinejoin="round" />
      <circle cx={64} cy={13.6} r={1.6} fill="#fde047" stroke="var(--outline)" strokeWidth={1.1} strokeLinejoin="round" />
      <path d="M39.4 18.6 L39.8 24" fill="none" stroke="#fff" strokeWidth={1.3} strokeLinecap="round" opacity={0.5} />
    </>) },
  headphones: { slot: 'head', group: 'orelhas', node: (<>
      <path d="M24.6 46 Q22 15.4 50 15.4 Q78 15.4 75.4 46" fill="none" stroke="var(--outline)" strokeWidth={7} strokeLinecap="round" />
      <path d="M24.6 46 Q22 15.4 50 15.4 Q78 15.4 75.4 46" fill="none" stroke="#38bdf8" strokeWidth={3.2} strokeLinecap="round" />
      <path d="M32 24 Q38 18.6 46 17.4" fill="none" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" opacity={0.45} />
      <rect x={18.4} y={38.4} width={10.4} height={17} rx={4.8} fill="#38bdf8" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <rect x={24.8} y={40.6} width={3.6} height={12.6} rx={1.8} fill="#000" opacity={0.25} />
      <path d="M21.4 41.6 V47" fill="none" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.45} />
      <g transform="matrix(-1 0 0 1 100 0)">
        <rect x={18.4} y={38.4} width={10.4} height={17} rx={4.8} fill="#38bdf8" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
        <rect x={24.8} y={40.6} width={3.6} height={12.6} rx={1.8} fill="#000" opacity={0.25} />
        <path d="M21.4 41.6 V47" fill="none" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.45} />
      </g>
    </>) },
  sunglasses: { slot: 'face', group: 'rosto', node: (<>
      <path d="M33.2 45 Q33.2 43 35.4 43 H45.4 Q47.4 43 47 45.4 L46.2 51 Q45.6 54.6 41.6 54.6 H38.4 Q34.2 54.6 33.6 51Z" fill="#1e1b4b" stroke="var(--outline)" strokeWidth={2} strokeLinejoin="round" />
      <path d="M33.3 45 Q33.3 43.1 35.4 43.1 H45.4 Q47.3 43.1 46.9 45.4 L46.8 46.2 H33.3Z" fill="#f472b6" />
      <path d="M37 48 L39.6 51.4 M40.6 47.6 L42 49.4" fill="none" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" opacity={0.55} />
      <path d="M33.4 46.4 L27.4 46" fill="none" stroke="var(--outline)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <g transform="matrix(-1 0 0 1 100 0)">
        <path d="M33.2 45 Q33.2 43 35.4 43 H45.4 Q47.4 43 47 45.4 L46.2 51 Q45.6 54.6 41.6 54.6 H38.4 Q34.2 54.6 33.6 51Z" fill="#1e1b4b" stroke="var(--outline)" strokeWidth={2} strokeLinejoin="round" />
        <path d="M33.3 45 Q33.3 43.1 35.4 43.1 H45.4 Q47.3 43.1 46.9 45.4 L46.8 46.2 H33.3Z" fill="#f472b6" />
        <path d="M37 48 L39.6 51.4 M40.6 47.6 L42 49.4" fill="none" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" opacity={0.55} />
        <path d="M33.4 46.4 L27.4 46" fill="none" stroke="var(--outline)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M46.8 47.4 Q50 45.6 53.2 47.4" fill="none" stroke="var(--outline)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </>) },
  bowtie: { slot: 'body', group: 'pescoço', node: (<>
      <path d="M50 70 L41.6 65.6 Q39.6 65 39.6 67.2 V72.8 Q39.6 75 41.6 74.4Z" fill="#f43f5e" stroke="var(--outline)" strokeWidth={1.8} strokeLinejoin="round" />
      <g transform="matrix(-1 0 0 1 100 0)">
        <path d="M50 70 L41.6 65.6 Q39.6 65 39.6 67.2 V72.8 Q39.6 75 41.6 74.4Z" fill="#f43f5e" stroke="var(--outline)" strokeWidth={1.8} strokeLinejoin="round" />
      </g>
      <circle cx={43.6} cy={68.6} r={0.9} fill="#f8fafc" />
      <circle cx={42.4} cy={72.2} r={0.9} fill="#f8fafc" />
      <circle cx={56.4} cy={68.6} r={0.9} fill="#f8fafc" />
      <circle cx={57.6} cy={72.2} r={0.9} fill="#f8fafc" />
      <rect x={47.3} y={67.1} width={5.4} height={5.8} rx={1.8} fill="#e11d48" stroke="var(--outline)" strokeWidth={1.6} strokeLinejoin="round" />
    </>) },
  chain: { slot: 'body', group: 'pescoço', node: (<>
      <path d="M39.4 66.8 Q50 86 60.6 66.8" fill="none" stroke="#a16207" strokeWidth={2.8} strokeLinecap="round" />
      <path d="M39.4 66.8 Q50 86 60.6 66.8" fill="none" stroke="#fde047" strokeWidth={1.5} strokeDasharray="2.2 1.3" />
      <circle cx={50} cy={80} r={3.8} fill="#fde047" stroke="var(--outline)" strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M50 78 L50.5 79.5 L52.1 79.5 L50.9 80.5 L51.3 82 L50 81.1 L48.7 82 L49.1 80.5 L47.9 79.5 L49.5 79.5 Z" fill="#a16207" />
      <path d="M48 78.4 Q48.6 77.4 49.6 77.2" fill="none" stroke="#fff" strokeWidth={1} strokeLinecap="round" opacity={0.7} />
    </>) },
  witchhat: { slot: 'head', group: 'topo', node: (<>
      <ellipse cx={50} cy={30.6} rx={33} ry={5.6} fill="#3b0764" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M37 29.4 L45 10 Q47.6 4.4 53.6 3.8 Q60.6 3.4 63.6 8 Q58.4 7.6 57 12.4 L63 29.4 Q50 33 37 29.4Z" fill="#3b0764" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M57 12.4 L63 29.4 Q60 30.4 56 30.8Z" fill="#000" opacity={0.2} />
      <path d="M38.6 25.2 Q50 28.8 61.4 25.2 L63 29.4 Q50 33 37 29.4Z" fill="#a78bfa" stroke="var(--outline)" strokeWidth={1.6} strokeLinejoin="round" />
      <rect x={46.4} y={26.8} width={7.2} height={4.8} rx={1.2} fill="#facc15" stroke="var(--outline)" strokeWidth={1.3} strokeLinejoin="round" />
      <rect x={48.6} y={28.3} width={2.8} height={1.8} rx={0.6} fill="none" stroke="var(--outline)" strokeWidth={1} />
      <path d="M43 20 L46 12" fill="none" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.35} />
    </>) },
  santahat: { slot: 'head', group: 'topo', node: (<>
      <path d="M28 31 Q27 13 47 9.6 Q63 7 72 17 Q79 25 80.6 38 Q74 34 70.4 32 Q50 24 28 31Z" fill="#dc2626" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M72 17 Q79 25 80.6 38 Q76 36 72 33.4Z" fill="#000" opacity={0.18} />
      <path d="M24.6 33 Q24 26 50 24 Q76 26 75.4 33 Q76 38.6 70 38 Q60 35 50 36 Q40 35 30 38 Q24 38.6 24.6 33Z" fill="#f8fafc" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <circle cx={80.6} cy={39} r={5.2} fill="#f8fafc" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M36 15.6 Q42 12.4 48 12" fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" opacity={0.35} />
    </>) },
  antennas: { slot: 'head', group: 'topo', node: (<>
      <g className="antenna antenna-l">
        <path d="M41 23 Q36.6 13 31 7.4" fill="none" stroke="var(--outline)" strokeWidth={4.6} strokeLinecap="round" />
        <path d="M41 23 Q36.6 13 31 7.4" fill="none" stroke="var(--skin)" strokeWidth={2.2} strokeLinecap="round" />
        <circle cx={30.2} cy={6.6} r={3.8} fill="#a3e635" stroke="var(--outline)" strokeWidth={1.6} strokeLinejoin="round" />
        <path d="M28.8 5.4 Q29.4 4.6 30.4 4.4" fill="none" stroke="#fff" strokeWidth={1} strokeLinecap="round" opacity={0.8} />
      </g>
      <g transform="matrix(-1 0 0 1 100 0)">
        <g className="antenna antenna-r">
          <path d="M41 23 Q36.6 13 31 7.4" fill="none" stroke="var(--outline)" strokeWidth={4.6} strokeLinecap="round" />
          <path d="M41 23 Q36.6 13 31 7.4" fill="none" stroke="var(--skin)" strokeWidth={2.2} strokeLinecap="round" />
          <circle cx={30.2} cy={6.6} r={3.8} fill="#a3e635" stroke="var(--outline)" strokeWidth={1.6} strokeLinejoin="round" />
          <path d="M28.8 5.4 Q29.4 4.6 30.4 4.4" fill="none" stroke="#fff" strokeWidth={1} strokeLinecap="round" opacity={0.8} />
        </g>
      </g>
    </>) },
  catears: { slot: 'head', group: 'topo', node: (<>
      <path d="M27.6 34 Q26 17 30 11.6 Q31.6 9.8 34 11.2 L47 22.6Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M32 28 Q31.4 19.4 33 16.4 L40.6 22.6Z" fill="#f9a8d4" />
      <g transform="matrix(-1 0 0 1 100 0)">
        <path d="M27.6 34 Q26 17 30 11.6 Q31.6 9.8 34 11.2 L47 22.6Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
        <path d="M32 28 Q31.4 19.4 33 16.4 L40.6 22.6Z" fill="#f9a8d4" />
      </g>
    </>) },
  roundglasses: { slot: 'face', group: 'rosto', node: (<>
      <circle cx={40.5} cy={49} r={7.6} fill="#e0f2fe" fillOpacity={0.3} stroke="var(--outline)" strokeWidth={2} />
      <path d="M35.4 45 Q37.6 43 40 42.8" fill="none" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" opacity={0.8} />
      <path d="M33 47.6 L27.4 46.4" fill="none" stroke="var(--outline)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <g transform="matrix(-1 0 0 1 100 0)">
        <circle cx={40.5} cy={49} r={7.6} fill="#e0f2fe" fillOpacity={0.3} stroke="var(--outline)" strokeWidth={2} />
        <path d="M35.4 45 Q37.6 43 40 42.8" fill="none" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" opacity={0.8} />
        <path d="M33 47.6 L27.4 46.4" fill="none" stroke="var(--outline)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M48 48.2 Q50 46.6 52 48.2" fill="none" stroke="var(--outline)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </>) },
  mustache: { slot: 'face', group: 'boca', node: (<>
      <path d="M50 55.8 Q46.4 52.6 42 54.8 Q39.8 56.2 41.2 58.6 Q44.6 56.6 50 57.8 Q55.4 56.6 58.8 58.6 Q60.2 56.2 58 54.8 Q53.6 52.6 50 55.8Z" fill="var(--hair)" stroke="var(--outline)" strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M44 55.6 Q46 54.6 48 55.2" fill="none" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" opacity={0.35} />
    </>) },
  scarf: { slot: 'body', group: 'pescoço', node: (<>
      <g className="scarf-tail">
        <path d="M56 77 L66.4 78.6 L65.6 95 Q61.6 97.4 57.6 95Z" fill="#f43f5e" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
        <path d="M56.6 84 L66 85.4 M56.8 90 L65.8 91.4" fill="none" stroke="#f8fafc" strokeWidth={2} opacity={0.9} />
      </g>
      <path d="M32.6 66 Q50 76.6 67.4 66 L69 73.4 Q50 84 31 73.4Z" fill="#f43f5e" stroke="var(--outline)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M32 71.4 Q50 82 68.4 71.4" fill="none" stroke="#f8fafc" strokeWidth={1.8} opacity={0.9} />
    </>) },
  flower: { slot: 'head', group: 'lateral', node: (<>
      <circle cx={69} cy={22.6} r={3.4} fill="#f472b6" stroke="var(--outline)" strokeWidth={1.2} strokeLinejoin="round" />
      <circle cx={73.2} cy={25.6} r={3.4} fill="#f472b6" stroke="var(--outline)" strokeWidth={1.2} strokeLinejoin="round" />
      <circle cx={71.6} cy={30.6} r={3.4} fill="#f472b6" stroke="var(--outline)" strokeWidth={1.2} strokeLinejoin="round" />
      <circle cx={66.4} cy={30.6} r={3.4} fill="#f472b6" stroke="var(--outline)" strokeWidth={1.2} strokeLinejoin="round" />
      <circle cx={64.8} cy={25.6} r={3.4} fill="#f472b6" stroke="var(--outline)" strokeWidth={1.2} strokeLinejoin="round" />
      <circle cx={69} cy={27} r={2.8} fill="#fde047" stroke="var(--outline)" strokeWidth={1.2} strokeLinejoin="round" />
    </>) },
};

const EXPRESSIONS: Record<ExpressionId, { brows: React.ReactNode; eyes: React.ReactNode; mouth: React.ReactNode; lid: boolean }> = {
  feliz: { brows: null, eyes: null, mouth: null, lid: false },
  alegre: { brows: null, eyes: (<>
      <path d="M36.9 50.4 Q40.5 45.4 44.1 50.4" fill="none" stroke="var(--outline)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M55.9 50.4 Q59.5 45.4 63.1 50.4" fill="none" stroke="var(--outline)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </>), mouth: (<>
      <path d="M44.6 57.2 Q50 56.4 55.4 57.2 Q55 64.6 50 64.6 Q45 64.6 44.6 57.2Z" fill="#7f1d1d" stroke="var(--outline)" strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M47 62.6 Q50 60.4 53 62.6 Q51.6 64.2 50 64.2 Q48.4 64.2 47 62.6Z" fill="#fb7185" />
    </>), lid: false },
  piscadinha: { brows: (<>
      <path d="M36.8 42.4 Q40.5 41.4 44.2 42" fill="none" stroke="var(--outline)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
      <path d="M55.8 39.8 Q59.5 38 63.2 39.8" fill="none" stroke="var(--outline)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
    </>), eyes: (<>
      <path d="M36.9 50.4 Q40.5 45.4 44.1 50.4" fill="none" stroke="var(--outline)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx={59.5} cy={49} rx={3.3} ry={4.1} fill="var(--outline)" />
      <circle cx={60.7} cy={47.4} r={1.35} fill="#fff" />
      <circle cx={58.5} cy={50.7} r={0.6} fill="#fff" opacity={0.8} />
    </>), mouth: (<>
      <path d="M45.6 58.8 Q50.6 62 55 57" fill="none" stroke="var(--outline)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </>), lid: false },
  surpreso: { brows: (<>
      <path d="M36.8 38.6 Q40.5 36.4 44.2 38" fill="none" stroke="var(--outline)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
      <path d="M55.8 38 Q59.5 36.4 63.2 38.6" fill="none" stroke="var(--outline)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
    </>), eyes: (<>
      <ellipse cx={40.5} cy={49} rx={3.8} ry={4.7} fill="var(--outline)" />
      <circle cx={41.8} cy={47.2} r={1.5} fill="#fff" />
      <circle cx={39.4} cy={51} r={0.7} fill="#fff" opacity={0.8} />
      <ellipse cx={59.5} cy={49} rx={3.8} ry={4.7} fill="var(--outline)" />
      <circle cx={60.8} cy={47.2} r={1.5} fill="#fff" />
      <circle cx={58.4} cy={51} r={0.7} fill="#fff" opacity={0.8} />
    </>), mouth: (<>
      <ellipse cx={50} cy={60.2} rx={2.5} ry={3.1} fill="#7f1d1d" stroke="var(--outline)" strokeWidth={1.8} strokeLinejoin="round" />
    </>), lid: false },
  bravo: { brows: (<>
      <path d="M36.4 39.4 L44.4 42.6" fill="none" stroke="var(--outline)" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M55.6 42.6 L63.6 39.4" fill="none" stroke="var(--outline)" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round" />
    </>), eyes: null, mouth: (<>
      <path d="M46 60.6 Q50 57.4 54 60.6" fill="none" stroke="var(--outline)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </>), lid: false },
  triste: { brows: (<>
      <path d="M36.8 41.8 Q40.8 41.4 44.2 39" fill="none" stroke="var(--outline)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
      <path d="M55.8 39 Q59.2 41.4 63.2 41.8" fill="none" stroke="var(--outline)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
    </>), eyes: null, mouth: (<>
      <path d="M45.8 61 Q50 57.4 54.2 61" fill="none" stroke="var(--outline)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M63.4 53.2 Q65.6 56.6 63.4 57.8 Q61.2 56.6 63.4 53.2Z" fill="#7dd3fc" stroke="var(--outline)" strokeWidth={1} strokeLinejoin="round" />
    </>), lid: false },
  convencido: { brows: (<>
      <path d="M36.8 41.8 Q40.5 40.8 44.2 41.6" fill="none" stroke="var(--outline)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
      <path d="M55.8 39.6 Q59.5 37.6 63.2 39.4" fill="none" stroke="var(--outline)" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
    </>), eyes: null, mouth: (<>
      <path d="M46 58.8 Q51 60.6 55 57.2" fill="none" stroke="var(--outline)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </>), lid: true },
};

const LIDS = {
  skin: (<>
    <path d="M36.6 49 Q36.6 44.2 40.5 44.2 Q44.4 44.2 44.4 49Z" fill="var(--skin)" />
    <path d="M36.7 48.6 H44.3" fill="none" stroke="var(--outline)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M55.6 49 Q55.6 44.2 59.5 44.2 Q63.4 44.2 63.4 49Z" fill="var(--skin)" />
    <path d="M55.7 48.6 H63.3" fill="none" stroke="var(--outline)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </>),
  corpse: (<>
    <path d="M36.6 49 Q36.6 44.2 40.5 44.2 Q44.4 44.2 44.4 49Z" fill="#f8fafc" />
    <path d="M36.7 48.6 H44.3" fill="none" stroke="var(--outline)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M55.6 49 Q55.6 44.2 59.5 44.2 Q63.4 44.2 63.4 49Z" fill="#f8fafc" />
    <path d="M55.7 48.6 H63.3" fill="none" stroke="var(--outline)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </>),
};

const MAKEUP_CORPSE_MARKS = (<>
    <path d="M32.5 44.5 Q34 38 40.5 38.4 Q46.6 39.4 46.1 46.5 Q45.7 52 43.4 55.5 L42 61 L40.2 55.8 Q37 56 35.6 52.6 L33.4 55.8 L33.6 50 Q32.3 47.5 32.5 44.5Z" fill="#0b0b10" />
    <g transform="matrix(-1 0 0 1 100 0)">
      <path d="M32.5 44.5 Q34 38 40.5 38.4 Q46.6 39.4 46.1 46.5 Q45.7 52 43.4 55.5 L42 61 L40.2 55.8 Q37 56 35.6 52.6 L33.4 55.8 L33.6 50 Q32.3 47.5 32.5 44.5Z" fill="#0b0b10" />
    </g>
    <ellipse cx={40.5} cy={49} rx={4.5} ry={5.3} fill="#f8fafc" />
    <ellipse cx={59.5} cy={49} rx={4.5} ry={5.3} fill="#f8fafc" />
    <path d="M47.8 52.4 Q50 51.4 52.2 52.4 L50 55.4Z" fill="#0b0b10" />
    <path d="M44.2 57.6 Q50 55.6 55.8 57.6 Q54.2 62 50 62.2 Q45.8 62 44.2 57.6Z" fill="#0b0b10" />
    <path d="M45.8 60.4 L44.8 65.4 L47.8 61.6Z M48.9 61.9 L50 66.8 L51.1 61.9Z M54.2 60.4 L55.2 65.4 L52.2 61.6Z" fill="#0b0b10" />
  </>);

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
