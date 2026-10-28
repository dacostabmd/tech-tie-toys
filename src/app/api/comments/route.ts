import { currentUser, json, unauthorized } from "@/server/session";

interface YtThread {
  id: string;
  snippet?: {
    topLevelComment?: {
      snippet?: {
        authorDisplayName?: string;
        authorProfileImageUrl?: string;
        textOriginal?: string;
        textDisplay?: string;
        likeCount?: number;
        publishedAt?: string;
      };
    };
  };
}

/** Most relevant YouTube comments for a video (requires YOUTUBE_API_KEY). */
export async function GET(req: Request) {
  if (!(await currentUser())) return unauthorized();
  const videoId = new URL(req.url).searchParams.get("videoId");
  if (!videoId || !/^[\w-]{11}$/.test(videoId)) return json({ error: "videoId inválido" }, 400);
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return json({ comments: [], disabled: true });

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&order=relevance&maxResults=20&videoId=${videoId}&key=${key}`,
    { signal: AbortSignal.timeout(8000) },
  ).catch(() => null);
  if (!res?.ok) {
    console.warn("[comments] YouTube respondeu", res?.status, await res?.text().catch(() => ""));
    return json({ comments: [], error: "Comentários indisponíveis para este vídeo" });
  }
  const data = (await res.json()) as { items?: YtThread[]; pageInfo?: { totalResults?: number } };
  const items = Array.isArray(data.items) ? data.items : [];
  const comments = items
    .map((t) => {
      const s = t.snippet?.topLevelComment?.snippet;
      if (!s) return null;
      return {
        id: t.id,
        author: s.authorDisplayName ?? "Anônimo",
        avatar: s.authorProfileImageUrl ?? "",
        text: s.textOriginal ?? s.textDisplay ?? "",
        likes: s.likeCount ?? 0,
        at: s.publishedAt ?? "",
      };
    })
    .filter((c) => c && c.text);
  if (!comments.length && items.length) {
    console.warn("[comments] resposta com itens mas sem comentários legíveis; chaves:", Object.keys(items[0] ?? {}));
  }
  return json({ comments });
}
