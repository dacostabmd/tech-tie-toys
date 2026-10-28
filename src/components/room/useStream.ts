"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Room, RoomEvent, Track, type RemoteParticipant, type RemoteTrack } from "livekit-client";
import type { RoomApi } from "./useRoom";

type TokenAck = { ok: boolean; error?: string; url?: string; token?: string };

/**
 * Live screen/camera via LiveKit (SFU). The Socket.IO room grants the single broadcaster slot and the
 * LiveKit tokens; we only connect to LiveKit while a stream is live, so idle rooms cost nothing.
 */
export function useStream(room: RoomApi) {
  const { socket, state, startStream, stopStream } = room;
  const stream = state?.stream ?? null;
  const isBroadcaster = !!stream && stream.socketId === socket.id;
  const [local, setLocal] = useState<MediaStream | null>(null);
  const [remote, setRemote] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lkRoom = useRef<Room | null>(null);

  const token = useCallback(
    (publish: boolean) =>
      new Promise<TokenAck>((resolve) =>
        socket.timeout(10_000).emit("stream:token", { publish }, (err: unknown, res: TokenAck) =>
          resolve(err ? { ok: false, error: "Tempo esgotado" } : res),
        ),
      ),
    [socket],
  );

  const disconnect = useCallback(() => {
    lkRoom.current?.disconnect();
    lkRoom.current = null;
    setLocal(null);
    setRemote(null);
  }, []);

  const stop = useCallback(() => {
    stopStream();
    disconnect();
  }, [stopStream, disconnect]);

  const start = useCallback(
    async (kind: "screen" | "camera") => {
      setError(null);
      const lock = await startStream(kind);
      if (!lock.ok) return setError(lock.error ?? "Não foi possível transmitir");
      try {
        const access = await token(true);
        if (!access.ok) throw new Error(access.error);
        const lk = new Room({ adaptiveStream: true, dynacast: true });
        lkRoom.current = lk;
        await lk.connect(access.url!, access.token!);
        const refreshLocal = () => {
          const tracks = [...lk.localParticipant.trackPublications.values()]
            .map((p) => p.track?.mediaStreamTrack)
            .filter((t): t is MediaStreamTrack => !!t);
          setLocal(tracks.length ? new MediaStream(tracks) : null);
        };
        lk.on(RoomEvent.LocalTrackPublished, refreshLocal);
        lk.on(RoomEvent.LocalTrackUnpublished, (pub) => {
          // The browser's own "Stop sharing" button ends the screen track.
          if (pub.source === Track.Source.ScreenShare || pub.source === Track.Source.Camera) stop();
          else refreshLocal();
        });
        if (kind === "screen") {
          await lk.localParticipant.setScreenShareEnabled(true, { audio: true });
        } else {
          await lk.localParticipant.setCameraEnabled(true);
          await lk.localParticipant.setMicrophoneEnabled(true);
        }
        refreshLocal();
      } catch (err) {
        stop();
        setError((err as Error).message || "Permissão negada");
      }
    },
    [startStream, token, stop],
  );

  // Viewer: join the LiveKit room and collect the broadcaster's tracks.
  const broadcasterId = !isBroadcaster ? stream?.socketId : undefined;
  useEffect(() => {
    if (!broadcasterId) return;
    let cancelled = false;
    const lk = new Room({ adaptiveStream: true, dynacast: true });
    const isBroadcasterParticipant = (p: RemoteParticipant) => p.identity === `s:${broadcasterId}`;
    const refresh = () => {
      // disconnect() still fires TrackUnsubscribed with the old tracks; ignore events after cleanup.
      if (cancelled) return;
      const p = [...lk.remoteParticipants.values()].find(isBroadcasterParticipant);
      const tracks = p
        ? [...p.trackPublications.values()]
            .map((pub) => (pub.track as RemoteTrack | undefined)?.mediaStreamTrack)
            .filter((t): t is MediaStreamTrack => !!t)
        : [];
      setRemote(tracks.length ? new MediaStream(tracks) : null);
    };
    lk.on(RoomEvent.TrackSubscribed, refresh);
    lk.on(RoomEvent.TrackUnsubscribed, refresh);
    lk.on(RoomEvent.ParticipantDisconnected, refresh);

    token(false).then(async (access) => {
      if (cancelled) return;
      if (!access.ok) return setError(access.error ?? "Sem acesso à transmissão");
      try {
        await lk.connect(access.url!, access.token!);
        if (!cancelled) refresh();
      } catch {
        if (!cancelled) setError("Não foi possível conectar à transmissão");
      }
    });
    return () => {
      cancelled = true;
      lk.disconnect();
      setRemote(null);
    };
  }, [broadcasterId, token]);

  // Lock released elsewhere (e.g. reconnect) → drop our publisher connection.
  useEffect(() => {
    if (!isBroadcaster && lkRoom.current) disconnect();
  }, [isBroadcaster, disconnect]);

  useEffect(
    () => () => {
      lkRoom.current?.disconnect();
    },
    [],
  );

  return { stream, isBroadcaster, local, remote, error, start, stop };
}
