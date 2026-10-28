"use client";

import { useEffect, useRef, useState } from "react";
import { ActionIcon, Badge, Box, Button, Center, Stack, Text, Tooltip } from "@mantine/core";
import { Headphones, Radio, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { getPlayerPrefs } from "@/lib/playerPrefs";
import type { NowPlaying } from "@/lib/types";

/* Minimal typings for the YouTube IFrame API */
interface YTPlayer {
  loadVideoById(opts: { videoId: string; startSeconds?: number }): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getDuration(): number;
  getCurrentTime(): number;
  getPlayerState(): number;
  setVolume(volume: number): void;
  mute(): void;
  unMute(): void;
  playVideo(): void;
  destroy(): void;
}
interface YTNamespace {
  Player: new (
    el: HTMLElement,
    opts: {
      width?: string;
      height?: string;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: () => void;
        onStateChange?: (e: { data: number }) => void;
      };
    },
  ) => YTPlayer;
  PlayerState: { ENDED: number; PLAYING: number };
}
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytReady: Promise<YTNamespace> | null = null;
function loadYouTube() {
  ytReady ??= new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT);
    window.onYouTubeIframeAPIReady = () => resolve(window.YT!);
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  });
  return ytReady;
}

interface Props {
  current: NowPlaying | null;
  serverNow: () => number;
  onDuration: (itemId: string, seconds: number) => void;
  onEnded: (itemId: string) => void;
  live: MediaStream | null;
  liveLabel?: string;
}

export function Player({ current, serverNow, onDuration, onEnded, live, liveLabel }: Props) {
  return (
    <Box pos="relative" w="100%" h="100%" bg="black" style={{ overflow: "hidden", borderRadius: "var(--mantine-radius-md)" }}>
      {live ? (
        <LiveVideo stream={live} label={liveLabel} />
      ) : !current ? (
        <Center h="100%">
          <Stack align="center" gap="xs" c="dimmed">
            <Headphones size={40} />
            <Text>Nada tocando. Adicione um link na fila!</Text>
          </Stack>
        </Center>
      ) : current.item.source === "youtube" ? (
        <YouTube current={current} serverNow={serverNow} onDuration={onDuration} onEnded={onEnded} />
      ) : (
        <FileVideo current={current} serverNow={serverNow} onDuration={onDuration} onEnded={onEnded} />
      )}
    </Box>
  );
}

type SubProps = Omit<Props, "live" | "liveLabel" | "current"> & { current: NowPlaying };

const offsetSeconds = (c: NowPlaying, now: number) => Math.max(0, (now - c.startedAt) / 1000);
/** How often playback is compared against the room clock. */
const DRIFT_CHECK_MS = 3000;
const YT_PLAYING = 1;

function applyYouTubePrefs(p: YTPlayer) {
  const prefs = getPlayerPrefs();
  p.setVolume(prefs.volume);
  if (prefs.startMuted) p.mute();
}

function YouTube({ current, serverNow, onDuration, onEnded }: SubProps) {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);
  const ready = useRef(false);
  const latest = useRef({ current, serverNow, onDuration, onEnded });
  useEffect(() => {
    latest.current = { current, serverNow, onDuration, onEnded };
  });

  useEffect(() => {
    let disposed = false;
    loadYouTube().then((YT) => {
      if (disposed || !host.current) return;
      const mount = document.createElement("div");
      host.current.appendChild(mount);
      player.current = new YT.Player(mount, {
        width: "100%",
        height: "100%",
        playerVars: { autoplay: 1, playsinline: 1, rel: 0 },
        events: {
          onReady: () => {
            ready.current = true;
            const { current: cur, serverNow: n } = latest.current;
            if (player.current) applyYouTubePrefs(player.current);
            player.current?.loadVideoById({ videoId: cur.item.ref, startSeconds: offsetSeconds(cur, n()) });
          },
          onStateChange: (e) => {
            const { current: cur, onDuration: od, onEnded: oe } = latest.current;
            if (e.data === YT.PlayerState.PLAYING) {
              const d = player.current?.getDuration();
              if (d && !cur.duration) od(cur.item.id, d);
            }
            if (e.data === YT.PlayerState.ENDED) oe(cur.item.id);
          },
        },
      });
    });
    return () => {
      disposed = true;
      player.current?.destroy();
      player.current = null;
      ready.current = false;
    };
  }, []);

  // New item → load it at the synced offset.
  const itemId = current.item.id;
  useEffect(() => {
    if (!ready.current || !player.current) return;
    const { current: c, serverNow: now } = latest.current;
    applyYouTubePrefs(player.current);
    player.current.loadVideoById({ videoId: c.item.ref, startSeconds: offsetSeconds(c, now()) });
  }, [itemId]);

  // Automatic resync: when playback drifts past the viewer's tolerance, jump back to the room position.
  useEffect(() => {
    const t = setInterval(() => {
      const p = player.current;
      if (!ready.current || !p || p.getPlayerState() !== YT_PLAYING) return;
      const { current: c, serverNow: now } = latest.current;
      const expected = offsetSeconds(c, now());
      if (c.duration && expected >= c.duration) return;
      if (Math.abs(p.getCurrentTime() - expected) > getPlayerPrefs().syncDrift) p.seekTo(expected, true);
    }, DRIFT_CHECK_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <div ref={host} className="yt-host" style={{ width: "100%", height: "100%" }} />
      <SyncButton
        onSync={() => {
          const { current: c, serverNow: now } = latest.current;
          player.current?.seekTo(offsetSeconds(c, now()), true);
          player.current?.playVideo();
        }}
      />
    </>
  );
}

function FileVideo({ current, serverNow, onDuration, onEnded }: SubProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const sync = () => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = offsetSeconds(current, serverNow());
    v.play().catch(() => {});
  };
  const latest = useRef({ current, serverNow });
  useEffect(() => {
    latest.current = { current, serverNow };
  });

  useEffect(() => {
    const t = setInterval(() => {
      const v = ref.current;
      if (!v || v.paused || v.ended) return;
      const expected = offsetSeconds(latest.current.current, latest.current.serverNow());
      if (expected < v.duration && Math.abs(v.currentTime - expected) > getPlayerPrefs().syncDrift) v.currentTime = expected;
    }, DRIFT_CHECK_MS);
    return () => clearInterval(t);
  }, []);
  return (
    <>
      <video
        ref={ref}
        key={current.item.id}
        src={current.item.ref}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        controls
        autoPlay
        playsInline
        onLoadedMetadata={(e) => {
          const v = e.currentTarget;
          if (Number.isFinite(v.duration)) onDuration(current.item.id, v.duration);
          const prefs = getPlayerPrefs();
          v.volume = prefs.volume / 100;
          v.muted = prefs.startMuted;
          sync();
        }}
        onEnded={() => onEnded(current.item.id)}
      />
      <SyncButton onSync={sync} />
    </>
  );
}

function LiveVideo({ stream, label }: { stream: MediaStream; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);
  return (
    <>
      <video ref={ref} style={{ width: "100%", height: "100%", objectFit: "contain" }} autoPlay playsInline muted={muted} />
      <Badge pos="absolute" top={12} left={12} color="red" variant="filled" leftSection={<Radio size={12} />}>
        Ao vivo{label ? ` · ${label}` : ""}
      </Badge>
      <Button
        pos="absolute"
        bottom={12}
        right={12}
        size="xs"
        variant="default"
        leftSection={muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        onClick={() => setMuted((m) => !m)}
      >
        {muted ? "Ativar som" : "Silenciar"}
      </Button>
    </>
  );
}

function SyncButton({ onSync }: { onSync: () => void }) {
  return (
    <Tooltip label="Ressincronizar com a sala">
      <ActionIcon pos="absolute" top={12} right={12} variant="default" style={{ opacity: 0.75 }} onClick={onSync} aria-label="Sincronizar">
        <RefreshCw size={16} />
      </ActionIcon>
    </Tooltip>
  );
}
