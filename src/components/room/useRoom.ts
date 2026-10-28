"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AFK_AFTER_MS } from "@/lib/avatar";
import { getSocket } from "@/lib/client";
import type { ChatMessage, MediaKind, NowPlaying, Presence, QueueItem, RoomModeration, RoomState, StreamInfo } from "@/lib/types";

type Ack = { ok: boolean; error?: string };

export function useRoom(roomId: string, onTokens?: (tokens: number) => void) {
  const socket = getSocket();
  const [state, setState] = useState<RoomState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(socket.connected);
  /** serverTime ≈ Date.now() + offset */
  const offset = useRef(0);
  const onTokensRef = useRef(onTokens);
  useEffect(() => {
    onTokensRef.current = onTokens;
  });

  useEffect(() => {
    const patch = (p: Partial<RoomState>) => setState((s) => (s ? { ...s, ...p } : s));
    const join = () =>
      socket.emit("room:join", { roomId }, (res: Ack) => {
        if (!res.ok) setError(res.error ?? "Não foi possível entrar");
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- each handler has its own payload type
    const handlers: Record<string, (...args: any[]) => void> = {
      connect: () => {
        setConnected(true);
        join();
      },
      disconnect: () => setConnected(false),
      connect_error: () => setError("Falha de conexão (sessão expirada?)"),
      "room:state": (s: RoomState) => {
        offset.current = s.serverNow - Date.now();
        setState(s);
      },
      "chat:message": (m: ChatMessage) => setState((s) => (s ? { ...s, chat: [...s.chat.slice(-99), m] } : s)),
      "queue:update": (queue: QueueItem[]) => patch({ queue }),
      "player:play": ({ current, serverNow }: { current: NowPlaying | null; serverNow: number }) => {
        offset.current = serverNow - Date.now();
        patch({ current, skipVotes: 0 });
      },
      "player:duration": ({ itemId, duration }: { itemId: string; duration: number }) =>
        setState((s) =>
          s?.current?.item.id === itemId ? { ...s, current: { ...s.current, duration } } : s,
        ),
      "player:skipVotes": (skipVotes: number) => patch({ skipVotes }),
      "presence:update": (presence: Presence[]) => patch({ presence }),
      "presence:move": ({ socketId, x, y }: { socketId: string; x: number; y: number }) =>
        setState((s) =>
          s ? { ...s, presence: s.presence.map((p) => (p.socketId === socketId ? { ...p, x, y } : p)) } : s,
        ),
      "stream:update": (stream: StreamInfo | null) => patch({ stream }),
      "tokens:update": ({ tokens }: { tokens: number }) => onTokensRef.current?.(tokens),
      "room:kicked": ({ minutes }: { minutes: number }) =>
        setError(`O dono da sala removeu você. Você poderá voltar em ${minutes} min.`),
    };

    for (const [ev, fn] of Object.entries(handlers)) socket.on(ev, fn);
    if (socket.connected) join();
    else socket.connect();

    return () => {
      for (const [ev, fn] of Object.entries(handlers)) socket.off(ev, fn);
      socket.emit("room:leave");
    };
  }, [roomId, socket]);

  // Heartbeat for time-based tokens: only while the tab is visible and the user interacted recently.
  useEffect(() => {
    let lastInteraction = Date.now();
    const touch = () => {
      lastInteraction = Date.now();
    };
    const beat = () => {
      if (document.visibilityState === "visible" && Date.now() - lastInteraction < AFK_AFTER_MS) socket.emit("presence:active");
    };
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    for (const e of events) window.addEventListener(e, touch, { passive: true });
    document.addEventListener("visibilitychange", beat);
    beat();
    const t = setInterval(beat, 30_000);
    return () => {
      for (const e of events) window.removeEventListener(e, touch);
      document.removeEventListener("visibilitychange", beat);
      clearInterval(t);
    };
  }, [socket]);

  const emitAck = useCallback(
    (event: string, payload?: unknown) =>
      new Promise<Ack>((resolve) => socket.timeout(15_000).emit(event, payload, (err: unknown, res: Ack) => resolve(err ? { ok: false, error: "Tempo esgotado" } : res))),
    [socket],
  );

  return {
    socket,
    state,
    error,
    connected,
    serverNow: () => Date.now() + offset.current,
    sendChat: (text: string) => socket.emit("chat:send", { text }),
    addToQueue: (url: string, kind: MediaKind = "auto", title?: string) => emitAck("queue:add", { url, kind, title }),
    removeFromQueue: (itemId: string) => socket.emit("queue:remove", { itemId }),
    moveInQueue: (itemId: string, delta: number) => socket.emit("queue:move", { itemId, delta }),
    reportDuration: (itemId: string, duration: number) => socket.emit("player:duration", { itemId, duration }),
    reportEnded: (itemId: string) => socket.emit("player:ended", { itemId }),
    skip: () => socket.emit("player:skip"),
    getModeration: () => emitAck("mod:get") as Promise<Ack & { moderation?: RoomModeration }>,
    setModeration: (m: RoomModeration) => emitAck("mod:set", m),
    mute: (userId: number, minutes: number) => emitAck("mod:mute", { userId, minutes }),
    kick: (userId: number) => emitAck("mod:kick", { userId }),
    move: (x: number, y: number) => socket.emit("presence:move", { x, y }),
    startStream: (kind: "screen" | "camera") => emitAck("stream:start", { kind }),
    stopStream: () => socket.emit("stream:stop"),
  };
}

export type RoomApi = ReturnType<typeof useRoom>;
