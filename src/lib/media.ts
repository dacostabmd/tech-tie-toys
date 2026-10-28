import type { MediaSource } from "./types";

export interface ParsedMedia {
  source: MediaSource;
  ref: string;
  url: string;
}

const YT_ID = /^[\w-]{11}$/;

export function parseMediaUrl(input: string): ParsedMedia | null {
  const raw = input.trim();
  if (YT_ID.test(raw)) {
    return { source: "youtube", ref: raw, url: `https://www.youtube.com/watch?v=${raw}` };
  }
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;

  const host = u.hostname.replace(/^www\.|^m\./, "");
  let id: string | null = null;
  if (host === "youtu.be") id = u.pathname.slice(1, 12);
  else if (host === "youtube.com" || host === "music.youtube.com") {
    id = u.searchParams.get("v");
    if (!id) {
      const m = u.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{11})/);
      id = m?.[1] ?? null;
    }
  }
  if (id && YT_ID.test(id)) {
    return { source: "youtube", ref: id, url: `https://www.youtube.com/watch?v=${id}` };
  }

  if (/\.(mp4|webm|ogg|ogv|m3u8|mov)$/i.test(u.pathname)) {
    return { source: "file", ref: u.toString(), url: u.toString() };
  }
  return null;
}

export function mediaKey(m: { source: MediaSource; ref: string }) {
  return `${m.source}:${m.ref}`;
}
