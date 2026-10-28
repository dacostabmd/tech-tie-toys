"use client";

import { useRef, useSyncExternalStore } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";

const LOGO_SRC = "/ttt-intro.svg";
const SOUND_SRC = "/liecio-diamond-found-190255.mp3";
const INTRO_MS = 4000;
/** When the gold sheen starts sweeping across the ties in ttt-intro.svg (66.667% of its 3s timeline). */
const SHINE_AT_S = 2;
const SOUND_S = 2.5;
const SOUND_FADE_S = 0.3;
/** Samples below this are treated as the track's leading silence, so the first hit lands on the shine. */
const SILENCE_THRESHOLD = 0.02;
const EASE = [0.22, 1, 0.36, 1] as const;

function firstAudibleSecond(buffer: AudioBuffer) {
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    if (Math.abs(data[i]) > SILENCE_THRESHOLD) return i / buffer.sampleRate;
  }
  return 0;
}

// Tiny external store: the host lives in the root layout, so the intro keeps playing while the
// login page navigates to the lobby underneath it.
type Intro = { ctx: AudioContext | null; buffer: Promise<AudioBuffer | null> } | null;
let current: Intro = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
let soundBytes: Promise<ArrayBuffer | null> | undefined;

/** Downloads the logo and the sound ahead of time (call it on the login page). */
export function preloadLoginIntro() {
  new Image().src = LOGO_SRC;
  soundBytes ??= fetch(SOUND_SRC)
    .then((res) => res.arrayBuffer())
    .catch(() => null);
}

/**
 * Creates the AudioContext. Call it synchronously inside the submit/click handler: browsers only
 * allow sound from a context created during a user gesture.
 */
export function unlockIntroAudio(): AudioContext | null {
  try {
    return new AudioContext();
  } catch {
    return null;
  }
}

/** Plays the T.T.T logo with the sound timed to the tie shine, on top of whatever page is loading. */
export function playLoginIntro(ctx: AudioContext | null) {
  preloadLoginIntro();
  const buffer = ctx
    ? soundBytes!.then((bytes) => (bytes ? ctx.decodeAudioData(bytes.slice(0)) : null)).catch(() => null)
    : Promise.resolve(null);
  const intro = { ctx, buffer };
  current = intro;
  emit();
  // Safety net in case the logo never loads.
  window.setTimeout(() => current === intro && finish(), INTRO_MS + 3000);
}

function finish() {
  void current?.ctx?.close();
  current = null;
  emit();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function LoginIntroHost() {
  const intro = useSyncExternalStore(subscribe, () => current, () => null);
  const started = useRef<Intro>(null);

  // The SVG animation starts when the logo loads; the sound is scheduled from that same instant.
  function startTimeline() {
    if (!intro || started.current === intro) return;
    started.current = intro;
    const { ctx, buffer } = intro;
    if (ctx) {
      const startAt = ctx.currentTime + SHINE_AT_S;
      void buffer.then((decoded) => {
        if (!decoded || ctx.state === "closed" || ctx.currentTime > startAt) return;
        const source = ctx.createBufferSource();
        source.buffer = decoded;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(1, startAt + SOUND_S - SOUND_FADE_S);
        gain.gain.linearRampToValueAtTime(0, startAt + SOUND_S);
        source.connect(gain).connect(ctx.destination);
        source.start(startAt, firstAudibleSecond(decoded), SOUND_S);
      });
    }
    window.setTimeout(finish, INTRO_MS);
  }

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {intro && (
          <motion.div
            key="intro"
            className="intro-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {/* Plain <img> (not next/image) so the SVG keeps its own CSS animations. */}
            <motion.img
              src={LOGO_SRC}
              alt="Tech Tie Toys"
              className="intro-logo"
              onLoad={startTimeline}
              onError={finish}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.06, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: EASE }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
