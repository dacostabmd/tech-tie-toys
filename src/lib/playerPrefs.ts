"use client";

import { useSyncExternalStore } from "react";

/** Per-viewer player preferences. Browser storage is fine here: they are conveniences, not shared state. */
export interface PlayerPrefs {
  /** Seconds of drift tolerated before the player jumps back to the room's position. */
  syncDrift: 1 | 2 | 4;
  /** 0–100, applied to every new video. */
  volume: number;
  startMuted: boolean;
  /** Hides the chat column so the stage uses the whole width. */
  cinema: boolean;
}

const KEY = "ttt_video_settings";
const DEFAULTS: PlayerPrefs = { syncDrift: 2, volume: 80, startMuted: false, cinema: false };

let cached: PlayerPrefs | null = null;
const listeners = new Set<() => void>();

function read(): PlayerPrefs {
  if (cached) return cached;
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Record<string, unknown>;
    const drift = Number(raw.syncDrift);
    cached = {
      syncDrift: drift === 1 || drift === 4 ? drift : 2,
      volume: typeof raw.volume === "number" ? Math.min(100, Math.max(0, raw.volume)) : typeof raw.defaultVolume === "number" ? raw.defaultVolume : DEFAULTS.volume,
      startMuted: raw.startMuted === true,
      cinema: raw.cinema === true || raw.cinemaMode === true,
    };
  } catch {
    cached = DEFAULTS;
  }
  return cached;
}

export function setPlayerPrefs(patch: Partial<PlayerPrefs>) {
  cached = { ...read(), ...patch };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cached));
  } catch {
    // Private mode or blocked storage: keep the in-memory value.
  }
  listeners.forEach((l) => l());
}

/** Snapshot for code outside React (e.g. player callbacks). */
export const getPlayerPrefs = () => (typeof window === "undefined" ? DEFAULTS : read());

export function usePlayerPrefs(): PlayerPrefs {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    getPlayerPrefs,
    () => DEFAULTS,
  );
}
