import type { ParsedMedia } from "@/lib/media";

export interface MediaMeta {
  title: string;
  author: string;
  thumbnail: string;
}

export async function fetchMeta(media: ParsedMedia): Promise<MediaMeta> {
  if (media.source === "youtube") {
    try {
      const res = await fetch(
        `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(media.url)}`,
        { signal: AbortSignal.timeout(5000) },
      );
      if (res.ok) {
        const data = (await res.json()) as { title?: string; author_name?: string; thumbnail_url?: string };
        return {
          title: data.title ?? media.ref,
          author: data.author_name ?? "",
          thumbnail: data.thumbnail_url ?? `https://i.ytimg.com/vi/${media.ref}/hqdefault.jpg`,
        };
      }
    } catch {
      // fall through to defaults
    }
    return { title: media.ref, author: "", thumbnail: `https://i.ytimg.com/vi/${media.ref}/hqdefault.jpg` };
  }
  const file = decodeURIComponent(new URL(media.url).pathname.split("/").pop() ?? "Vídeo");
  return { title: file.replace(/\.[^.]+$/, "").replace(/[._-]+/g, " "), author: new URL(media.url).hostname, thumbnail: "" };
}
