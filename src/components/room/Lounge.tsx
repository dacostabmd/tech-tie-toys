"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Badge, Box, Paper, Text } from "@mantine/core";
import { MousePointerClick } from "lucide-react";
import { Character, type Facing } from "@/components/character/Character";
import type { AvatarConfig, ChatMessage, Presence } from "@/lib/types";

const BUBBLE_MS = 6000;
const AVATAR_PX = 48;
/** Rendered height of the full-body character (viewBox 100 x 140). */
const AVATAR_H = AVATAR_PX * 1.4;
/** Walking speed in % of the floor per second. */
const WALK_SPEED = 28;

/** Social rooms: a floor where avatars walk around (click to move) and talk in bubbles. Fills its container. */
export function Lounge({
  presence,
  chat,
  mySocketId,
  onMove,
}: {
  presence: Presence[];
  chat: ChatMessage[];
  mySocketId?: string;
  onMove: (x: number, y: number) => void;
}) {
  const [now, setNow] = useState(() => Date.now());
  // Floor size in px: walkers move with translate3d (GPU compositor), which needs pixels, not %.
  const floor = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = floor.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const bubbles = new Map<number, ChatMessage>();
  for (const m of chat) if (!m.system && now - m.at < BUBBLE_MS) bubbles.set(m.user.id, m);

  // Sorted by depth (y) so avatars lower on the floor are drawn in front.
  const sorted = [...presence].sort((a, b) => a.y - b.y);

  return (
    <Box
      ref={floor}
      className="lounge-floor"
      pos="relative"
      h="100%"
      mih={220}
      style={{ overflow: "hidden", cursor: "crosshair", userSelect: "none", borderRadius: "var(--mantine-radius-md)" }}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        onMove(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
      }}
    >
      <Text size="xs" c="dimmed" pos="absolute" top={8} left={12} style={{ display: "flex", gap: 4, alignItems: "center", pointerEvents: "none" }}>
        <MousePointerClick size={12} /> Clique no chão para andar
      </Text>
      {size.w > 0 && sorted.map((p) => {
        const bubble = bubbles.get(p.id);
        return (
          <Walker
            key={p.socketId}
            x={p.x}
            y={p.y}
            floorW={size.w}
            floorH={size.h}
            name={p.name}
            avatar={p.avatar}
            mine={p.socketId === mySocketId}
            bubbleText={bubble?.text}
            bubbleAt={bubble?.at}
          />
        );
      })}
    </Box>
  );
}

interface WalkerProps {
  x: number;
  y: number;
  floorW: number;
  floorH: number;
  name: string;
  avatar: AvatarConfig;
  mine: boolean;
  bubbleText?: string;
  bubbleAt?: number;
}

/** One player on the floor. Walking, facing and talking are derived locally from position and chat changes. */
const Walker = memo(function Walker({ x, y, floorW, floorH, name, avatar, mine, bubbleText, bubbleAt }: WalkerProps) {
  // Derived during render so the new transition duration applies in the same frame as the new position.
  const [step, setStep] = useState({ x, y, ms: 0, facing: "none" as Facing, id: 0, floorW, floorH });
  if (step.floorW !== floorW || step.floorH !== floorH) {
    // Panel resized: snap to the new pixel position instead of sliding there.
    setStep({ ...step, floorW, floorH, ms: 0 });
  } else if (step.x !== x || step.y !== y) {
    const dx = x - step.x;
    const dist = Math.hypot(dx, y - step.y);
    setStep({
      x,
      y,
      ms: Math.min(4000, Math.max(300, (dist / WALK_SPEED) * 1000)),
      // Keeps the last horizontal direction, so they keep looking where they came from after stopping.
      facing: Math.abs(dx) > 0.5 ? (dx < 0 ? "left" : "right") : step.facing,
      id: step.id + 1,
      floorW,
      floorH,
    });
  }
  const [arrived, setArrived] = useState(0);
  const [talking, setTalking] = useState(false);

  useEffect(() => {
    if (!step.id) return;
    const t = setTimeout(() => setArrived(step.id), step.ms);
    return () => clearTimeout(t);
  }, [step.id, step.ms]);

  useEffect(() => {
    if (!bubbleText || !bubbleAt) return;
    // About 1.5 s per phrase, longer for longer messages.
    const ms = Math.min(5000, Math.max(1500, bubbleText.length * 70)) - (Date.now() - bubbleAt);
    if (ms <= 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- starts a timed animation for a new message
    setTalking(true);
    const t = setTimeout(() => setTalking(false), ms);
    return () => clearTimeout(t);
  }, [bubbleText, bubbleAt]);

  const walking = step.id > 0 && arrived !== step.id;

  return (
    <Box
      pos="absolute"
      className="lounge-walker"
      style={{
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        zIndex: Math.round(y),
        // Only transform changes: the browser hands the movement to the GPU compositor (no layout per frame).
        transform: `translate3d(${(x / 100) * floorW}px, ${(y / 100) * floorH}px, 0)`,
        transition: step.ms ? `transform ${step.ms}ms linear` : "none",
        pointerEvents: "none",
      }}
    >
      {bubbleText && (
        <Paper
          bg="white"
          c="dark.9"
          px={8}
          py={4}
          radius="lg"
          shadow="sm"
          w="max-content"
          maw={160}
          pos="absolute"
          left={0}
          bottom={AVATAR_H * 0.93 + 2}
          style={{ transform: "translateX(-50%)" }}
        >
          <Text size="xs">{bubbleText.length > 80 ? bubbleText.slice(0, 80) + "…" : bubbleText}</Text>
        </Paper>
      )}
      {/* Anchor (50, 130) of the viewBox sits exactly on the floor point. */}
      <Box pos="absolute" left={0} top={0} style={{ transform: "translate(-50%, -93%)" }}>
        <Character
          config={avatar}
          size={AVATAR_PX}
          walking={walking}
          talking={talking}
          facing={step.facing}
          walkCycle="0.5s"
          withStyles={false}
        />
      </Box>
      <Badge
        size="xs"
        variant={mine ? "filled" : "default"}
        pos="absolute"
        top={6}
        left={0}
        style={{ transform: "translateX(-50%)", width: "max-content", maxWidth: "none", overflow: "visible" }}
      >
        {name}
      </Badge>
    </Box>
  );
});
