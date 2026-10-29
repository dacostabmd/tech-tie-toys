"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Badge, Box, Button, Group, Paper, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Armchair, Footprints, MousePointerClick, Store } from "lucide-react";
import { Group as PanelGroup, Panel, Separator } from "react-resizable-panels";
import { Character, type Facing } from "@/components/character/Character";
import {
  FURNITURE,
  STAGE,
  clampPlacement,
  furnitureZ,
  isBlocked,
  type FurnitureId,
  type PlacedFurniture,
} from "@/components/lounge/catalog";
import { Furniture } from "@/components/lounge/Furniture";
import { FurniturePanel } from "@/components/room/FurniturePanel";
import { BASE_LAYOUT, countPlaced, type FurnitureCounts } from "@/lib/lounge";
import type { AvatarConfig, ChatMessage, Me, Presence } from "@/lib/types";

const BUBBLE_MS = 6000;
const AVATAR_PX = 48;
/** Walking speed in % of the stage per second. */
const WALK_SPEED = 28;
const WALL_BG = "#aeb0b8";
const FLOOR_BG = "#c7c7c7";

const newUid = () => "u" + Math.random().toString(36).slice(2, 10);

type Result = { ok: boolean; error?: string };

interface LoungeProps {
  presence: Presence[];
  chat: ChatMessage[];
  mySocketId?: string;
  onMove: (x: number, y: number) => void;
  furniture: PlacedFurniture[];
  /** Pieces placed across all of the owner's rooms (server-side count). */
  furniturePlaced?: FurnitureCounts;
  onFurnitureChange: (layout: PlacedFurniture[]) => Promise<Result>;
  me: Me;
  onMe: (me: Me) => void;
  isOwner: boolean;
}

/**
 * Social rooms: a cinema lounge where avatars walk around (click to move) and talk in bubbles.
 * The scene is a fixed 640 x 420 stage scaled to fit its container. The owner can decorate it with furniture.
 */
export function Lounge({ presence, chat, mySocketId, onMove, furniture, furniturePlaced, onFurnitureChange, me, onMe, isOwner }: LoungeProps) {
  const [now, setNow] = useState(() => Date.now());
  const [mode, setMode] = useState<"walk" | "edit">("walk");
  const [shopOpen, setShopOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wide = useMediaQuery("(min-width: 48em)", true) ?? true;
  const editing = isOwner && mode === "edit";

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const here = countPlaced(furniture);
  // The server's count includes this room; before the first sync fall back to what is on screen.
  const used = furniturePlaced ?? here;
  const selectedItem = furniture.find((p) => p.uid === selected) ?? null;
  const missingBase = BASE_LAYOUT.some((b) => !furniture.some((p) => p.uid === b.uid));

  async function commit(next: PlacedFurniture[]) {
    setError(null);
    const res = await onFurnitureChange(next);
    if (!res.ok) setError(res.error ?? "Não foi possível salvar");
  }
  const patchSelected = (fn: (p: PlacedFurniture) => PlacedFurniture) => commit(furniture.map((p) => (p.uid === selected ? fn(p) : p)));

  function place(id: FurnitureId) {
    // Each new piece lands a bit away from the previous ones, so they don't pile up on one spot.
    const n = furniture.length;
    const pos = clampPlacement(id, STAGE.w / 2 + ((n % 5) - 2) * 70, FURNITURE[id].layer === "wall" ? STAGE.wallH - 2 : 250 + (n % 3) * 50);
    const uid = newUid();
    setMode("edit");
    setSelected(uid);
    commit([...furniture, { uid, id, ...pos }]);
  }

  const panel = (
    <Box h="100%" style={{ overflowY: "auto" }}>
      <FurniturePanel
        me={me}
        onMe={onMe}
        used={used}
        canDecorate={isOwner}
        selected={editing ? selectedItem : null}
        missingBase={missingBase}
        onPlace={place}
        onStore={() => {
          setSelected(null);
          commit(furniture.filter((p) => p.uid !== selected));
        }}
        onFlip={() => patchSelected((p) => ({ ...p, flip: !p.flip }))}
        onColor={(color) => patchSelected((p) => ({ ...p, color }))}
        onRestoreBase={() => commit([...furniture, ...BASE_LAYOUT.filter((b) => !furniture.some((p) => p.uid === b.uid))])}
      />
    </Box>
  );

  return (
    <Box style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, gap: 8 }}>
      <Group gap="xs" wrap="wrap" justify="space-between">
        <Group gap="xs">
          <Button
            radius="xl"
            size="xs"
            variant={editing ? "default" : "filled"}
            leftSection={<Footprints size={14} />}
            aria-pressed={!editing}
            onClick={() => setMode("walk")}
          >
            Andar
          </Button>
          {isOwner && (
            <Button
              radius="xl"
              size="xs"
              variant={editing ? "filled" : "default"}
              leftSection={<Armchair size={14} />}
              aria-pressed={editing}
              onClick={() => {
                setMode("edit");
                setShopOpen(true);
              }}
            >
              Decorar
            </Button>
          )}
          <Button
            radius="xl"
            size="xs"
            variant={shopOpen ? "filled" : "default"}
            leftSection={<Store size={14} />}
            aria-pressed={shopOpen}
            onClick={() => setShopOpen((v) => !v)}
          >
            Loja
          </Button>
        </Group>
        <Text size="xs" c={error ? "red" : "dimmed"} style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {error ?? (
            <>
              <MousePointerClick size={12} /> {editing ? "Arraste os móveis para mudar de lugar" : "Clique no chão para andar"}
            </>
          )}
        </Text>
      </Group>

      <Box style={{ flex: 1, minHeight: 0 }}>
        {shopOpen ? (
          <PanelGroup key={wide ? "h" : "v"} orientation={wide ? "horizontal" : "vertical"} style={{ height: "100%" }}>
            <Panel id="lounge-stage" defaultSize="62" minSize="30">
              <Stage
                presence={presence}
                chat={chat}
                now={now}
                mySocketId={mySocketId}
                onMove={onMove}
                furniture={furniture}
                editing={editing}
                selected={selected}
                onSelect={setSelected}
                onCommit={commit}
              />
            </Panel>
            <Separator className="resize-handle" />
            <Panel id="lounge-shop" defaultSize="38" minSize="20">
              {panel}
            </Panel>
          </PanelGroup>
        ) : (
          <Stage
            presence={presence}
            chat={chat}
            now={now}
            mySocketId={mySocketId}
            onMove={onMove}
            furniture={furniture}
            editing={editing}
            selected={selected}
            onSelect={setSelected}
            onCommit={commit}
          />
        )}
      </Box>
    </Box>
  );
}

interface StageProps {
  presence: Presence[];
  chat: ChatMessage[];
  now: number;
  mySocketId?: string;
  onMove: (x: number, y: number) => void;
  furniture: PlacedFurniture[];
  editing: boolean;
  selected: string | null;
  onSelect: (uid: string | null) => void;
  onCommit: (layout: PlacedFurniture[]) => void;
}

/** The scaled scene: wall, floor, furniture and walkers. Everything inside is positioned in stage px times `scale`. */
function Stage({ presence, chat, now, mySocketId, onMove, furniture, editing, selected, onSelect, onCommit }: StageProps) {
  const holder = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [drag, setDrag] = useState<{ uid: string; x: number; y: number } | null>(null);
  const dragStart = useRef({ ox: 0, oy: 0 });
  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Fit the whole stage in the container, keeping its 640 x 420 proportions.
  const scale = Math.max(0, Math.min(box.w / STAGE.w, box.h / STAGE.h));
  const stageW = STAGE.w * scale;
  const stageH = STAGE.h * scale;

  const bubbles = new Map<number, ChatMessage>();
  for (const m of chat) if (!m.system && now - m.at < BUBBLE_MS) bubbles.set(m.user.id, m);

  // Sorted by depth (y) so avatars lower on the floor are drawn in front.
  const sorted = [...presence].sort((a, b) => a.y - b.y);
  const items = drag ? furniture.map((p) => (p.uid === drag.uid ? { ...p, x: drag.x, y: drag.y } : p)) : furniture;

  // Latest values for the pointer handlers below, which stay stable so memoized pieces don't re-render while dragging.
  const live = useRef({ furniture, drag, scale, editing, onSelect, onCommit });
  useEffect(() => {
    live.current = { furniture, drag, scale, editing, onSelect, onCommit };
  });
  const point = useCallback((e: { clientX: number; clientY: number }) => {
    const r = stage.current!.getBoundingClientRect();
    return { x: (e.clientX - r.left) / live.current.scale, y: (e.clientY - r.top) / live.current.scale };
  }, []);

  const onDown = useCallback(
    (p: PlacedFurniture, e: React.PointerEvent<HTMLDivElement>) => {
      if (!live.current.editing) return;
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      const pt = point(e);
      dragStart.current = { ox: pt.x - p.x, oy: pt.y - p.y };
      live.current.onSelect(p.uid);
    },
    [point],
  );
  const onMoveTo = useCallback(
    (p: PlacedFurniture, e: React.PointerEvent<HTMLDivElement>) => {
      if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
      const pt = point(e);
      setDrag({ uid: p.uid, ...clampPlacement(p.id, pt.x - dragStart.current.ox, pt.y - dragStart.current.oy) });
    },
    [point],
  );
  const onUp = useCallback((p: PlacedFurniture) => {
    const { drag: d, furniture: list, onCommit: commit } = live.current;
    if (!d || d.uid !== p.uid) return;
    setDrag(null);
    const x = Math.round(d.x);
    const y = Math.round(d.y);
    if (x !== p.x || y !== p.y) commit(list.map((q) => (q.uid === p.uid ? { ...q, x, y } : q)));
  }, []);

  function walkTo(e: React.MouseEvent) {
    const pt = point(e);
    const x = pt.x;
    let y = pt.y;
    // Clicks on a piece of furniture go to the nearest free spot, below it first, then above.
    for (let i = 0; i < 12 && isBlocked(furniture, x, y); i++) y += 5;
    if (isBlocked(furniture, x, y)) {
      y = pt.y;
      for (let i = 0; i < 12 && isBlocked(furniture, x, y); i++) y -= 5;
    }
    if (isBlocked(furniture, x, y)) return;
    onMove((x / STAGE.w) * 100, (y / STAGE.h) * 100);
  }

  return (
    <Box ref={holder} h="100%" mih={160} style={{ display: "grid", placeItems: "center", overflow: "hidden" }}>
      {scale > 0 && (
        <Box
          ref={stage}
          pos="relative"
          style={{
            width: stageW,
            height: stageH,
            overflow: "hidden",
            background: FLOOR_BG,
            borderRadius: 14,
            boxShadow: "0 0 0 2px #3b3626, 0 10px 28px rgba(0,0,0,.4)",
            cursor: editing ? "default" : "crosshair",
            userSelect: "none",
            touchAction: "none",
          }}
          onClick={(e) => (editing ? onSelect(null) : walkTo(e))}
        >
          {/* Floor checker and wall band */}
          <Box
            pos="absolute"
            left={0}
            right={0}
            bottom={0}
            style={{
              top: STAGE.wallH * scale,
              backgroundImage: "repeating-conic-gradient(rgba(0,0,0,.04) 0% 25%, transparent 0% 50%)",
              backgroundSize: `${48 * scale}px ${48 * scale}px`,
              pointerEvents: "none",
            }}
          />
          <Box pos="absolute" left={0} right={0} top={0} style={{ height: STAGE.wallH * scale, background: WALL_BG, pointerEvents: "none" }}>
            <Box pos="absolute" inset={0} style={{ backgroundImage: `repeating-linear-gradient(90deg, rgba(0,0,0,.05) 0 2px, transparent 2px ${64 * scale}px)` }} />
            <Box pos="absolute" left={0} right={0} top={0} style={{ height: 6 * scale, background: "rgba(0,0,0,.12)" }} />
            <Box pos="absolute" left={0} right={0} bottom={0} style={{ height: 8 * scale, background: "rgba(0,0,0,.2)" }} />
          </Box>

          {items.map((p) => (
            <Piece
              key={p.uid}
              p={p}
              scale={scale}
              editing={editing}
              selected={editing && selected === p.uid}
              onDown={onDown}
              onMoveTo={onMoveTo}
              onUp={onUp}
            />
          ))}

          {sorted.map((p) => {
            const bubble = bubbles.get(p.id);
            return (
              <Walker
                key={p.socketId}
                x={p.x}
                y={p.y}
                stageW={stageW}
                stageH={stageH}
                scale={scale}
                name={p.name}
                avatar={p.avatar}
                mine={p.socketId === mySocketId}
                bubbleText={bubble?.text}
                bubbleAt={bubble?.at}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
}

interface PieceProps {
  p: PlacedFurniture;
  scale: number;
  editing: boolean;
  selected: boolean;
  onDown: (p: PlacedFurniture, e: React.PointerEvent<HTMLDivElement>) => void;
  onMoveTo: (p: PlacedFurniture, e: React.PointerEvent<HTMLDivElement>) => void;
  onUp: (p: PlacedFurniture) => void;
}

/** One piece of furniture. Memoized: dragging one piece doesn't re-render the others. */
const Piece = memo(function Piece({ p, scale, editing, selected, onDown, onMoveTo, onUp }: PieceProps) {
  const d = FURNITURE[p.id];
  return (
    <Box
      pos="absolute"
      onPointerDown={(e) => onDown(p, e)}
      onPointerMove={(e) => onMoveTo(p, e)}
      onPointerUp={() => onUp(p)}
      onPointerCancel={() => onUp(p)}
      onClick={(e) => e.stopPropagation()}
      style={{
        left: (p.x - d.w / 2) * scale,
        top: (p.y - d.h) * scale,
        width: d.w * scale,
        height: d.h * scale,
        zIndex: furnitureZ(p),
        pointerEvents: editing ? "auto" : "none",
        cursor: editing ? "grab" : "default",
        outline: selected ? "2px dashed #facc15" : undefined,
        outlineOffset: 2,
        borderRadius: 8,
      }}
    >
      <Furniture id={p.id} color={p.color} flip={p.flip} scale={scale} withStyles={false} style={{ display: "block" }} />
    </Box>
  );
});

interface WalkerProps {
  x: number;
  y: number;
  stageW: number;
  stageH: number;
  scale: number;
  name: string;
  avatar: AvatarConfig;
  mine: boolean;
  bubbleText?: string;
  bubbleAt?: number;
}

/** One player on the floor. Walking, facing and talking are derived locally from position and chat changes. */
const Walker = memo(function Walker({ x, y, stageW, stageH, scale, name, avatar, mine, bubbleText, bubbleAt }: WalkerProps) {
  // Derived during render so the new transition duration applies in the same frame as the new position.
  const [step, setStep] = useState({ x, y, ms: 0, facing: "none" as Facing, id: 0, stageW, stageH });
  if (step.stageW !== stageW || step.stageH !== stageH) {
    // Panel resized: snap to the new pixel position instead of sliding there.
    setStep({ ...step, stageW, stageH, ms: 0 });
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
      stageW,
      stageH,
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
  const size = AVATAR_PX * scale;
  const feetY = (y / 100) * STAGE.h;
  // Only transform changes: the browser hands the movement to the GPU compositor (no layout per frame).
  const move = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    transform: `translate3d(${(x / 100) * stageW}px, ${(y / 100) * stageH}px, 0)`,
    transition: step.ms ? `transform ${step.ms}ms linear` : "none",
    pointerEvents: "none",
  } as const;

  return (
    <>
      <Box pos="absolute" className="lounge-walker" style={{ ...move, zIndex: Math.round(feetY) + 10 }}>
        {/* Anchor (50, 130) of the viewBox sits exactly on the floor point. */}
        <Box pos="absolute" left={0} top={0} style={{ transform: "translate(-50%, -93%)" }}>
          <Character
            config={avatar}
            size={size}
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
      {/* Bubbles live on their own layer, above every piece of furniture, and move together with the walker. */}
      {bubbleText && (
        <Box pos="absolute" className="lounge-walker" style={{ ...move, zIndex: 9000 }}>
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
            style={{ bottom: size * 1.4 * 0.93 + 2, transform: "translateX(-50%)" }}
          >
            <Text size="xs">{bubbleText.length > 80 ? bubbleText.slice(0, 80) + "…" : bubbleText}</Text>
          </Paper>
        </Box>
      )}
    </>
  );
});
