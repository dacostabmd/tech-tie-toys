"use client";

import { useCallback, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { Me } from "./types";

export async function api<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? `Erro ${res.status}`);
  return data as T;
}

export function useMe() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try {
      setMe(await api<Me>("/api/me"));
    } catch {
      setMe(null);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch
    refresh();
  }, [refresh]);
  return { me, setMe, loading, refresh };
}

let socket: Socket | null = null;

export function getSocket() {
  socket ??= io({ path: "/socket.io", withCredentials: true, autoConnect: true, transports: ["websocket", "polling"] });
  return socket;
}

export async function logout() {
  await api("/api/auth/logout", {});
  socket?.disconnect();
  socket = null;
  // Full reload on purpose: drops every in-memory client state of the old session.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = "/";
}
