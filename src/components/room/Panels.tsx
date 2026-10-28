"use client";

import { useEffect, useState } from "react";
import {
  ActionIcon,
  Alert,
  Avatar as MAvatar,
  Badge,
  Button,
  Card,
  Center,
  Group,
  Image,
  Loader,
  Rating,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  ArrowDown,
  ArrowUp,
  Bot,
  CircleAlert,
  Clapperboard,
  Film,
  ListPlus,
  Music,
  Play,
  Plus,
  Star,
  ThumbsUp,
  Trash2,
  Tv,
  X,
  type LucideIcon,
} from "lucide-react";
import { api } from "@/lib/client";
import { mediaKey } from "@/lib/media";
import type { Analysis, MediaKind, Playlist, QueueItem, RoomState } from "@/lib/types";
import type { RoomApi } from "./useRoom";

const KIND: Record<Analysis["kind"], { label: string; icon: LucideIcon; color: string }> = {
  music: { label: "Música", icon: Music, color: "grape" },
  video: { label: "Vídeo", icon: Tv, color: "blue" },
  movie: { label: "Filme", icon: Film, color: "orange" },
};

export function AiNotes({ item }: { item: QueueItem | null }) {
  const [data, setData] = useState<{ key: string; analysis?: Analysis; error?: string } | null>(null);
  const key = item ? mediaKey(item) : null;

  useEffect(() => {
    if (!item || !key) return;
    let cancelled = false;
    api<Analysis>("/api/analyze", { key, title: item.title, author: item.author, url: item.url, kind: item.kind })
      .then((analysis) => !cancelled && setData({ key, analysis }))
      .catch((err: Error) => !cancelled && setData({ key, error: err.message }));
    return () => {
      cancelled = true;
    };
  }, [key, item]);

  if (!item) return <Empty icon={Bot} text="As notas da IA aparecem quando algo estiver tocando." />;
  if (data?.key !== key)
    return (
      <Group gap="xs" c="dimmed">
        <Loader size="xs" />
        <Text size="sm">A IA está pesquisando sobre “{item.title}”…</Text>
      </Group>
    );
  if (data.error) return <ErrorText text={data.error} />;
  const a = data.analysis!;
  const kind = KIND[a.kind];
  return (
    <Stack gap="md">
      <div>
        <Badge variant="light" color={kind.color} leftSection={<kind.icon size={12} />}>
          {kind.label}
        </Badge>
        <Title order={4} mt="xs">
          {a.headline}
        </Title>
        <Text size="sm" c="dimmed" mt={4}>
          {a.summary}
        </Text>
      </div>
      {a.rating && (
        <Card padding="sm">
          <Group wrap="nowrap">
            <Text fz={32} fw={900} c="yellow">
              {a.rating.score.toFixed(1)}
            </Text>
            <Text size="sm">{a.rating.verdict}</Text>
          </Group>
        </Card>
      )}
      {a.sections.map((s) => (
        <div key={s.title}>
          <Text fw={600}>{s.title}</Text>
          <Text size="sm" style={{ whiteSpace: "pre-line" }}>
            {s.body}
          </Text>
        </div>
      ))}
      {a.facts.length > 0 && (
        <Stack gap={4}>
          {a.facts.map((f) => (
            <Text key={f} size="sm" c="dimmed">
              • {f}
            </Text>
          ))}
        </Stack>
      )}
      <Group gap={6}>
        {a.tags.map((t) => (
          <Badge key={t} variant="default" size="sm">
            #{t}
          </Badge>
        ))}
      </Group>
      <Text size="xs" c="dimmed">
        Gerado por IA a partir do título e canal — pode conter imprecisões.
      </Text>
    </Stack>
  );
}

interface RatingSummary {
  average: number | null;
  count: number;
  mine: { stars: number; review: string } | null;
  reviews: { name: string; stars: number; review: string; at: string }[];
}

export function Ratings({ item }: { item: QueueItem | null }) {
  const key = item ? mediaKey(item) : null;
  const [summary, setSummary] = useState<{ key: string; data: RatingSummary } | null>(null);
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    if (!key) return;
    api<RatingSummary>(`/api/ratings?key=${encodeURIComponent(key)}`)
      .then((data) => {
        setSummary({ key, data });
        setStars(data.mine?.stars ?? 0);
        setReview(data.mine?.review ?? "");
      })
      .catch(() => {});
  }, [key]);

  if (!item || !key) return <Empty icon={Star} text="Avalie o que estiver tocando." />;
  const data = summary?.key === key ? summary.data : null;

  async function save() {
    if (!key) return;
    setSummary({ key, data: await api<RatingSummary>("/api/ratings", { key, stars, review }) });
  }

  return (
    <Stack>
      <Group>
        <Text fz={32} fw={900} c="yellow">
          {data?.average ? data.average.toFixed(1) : "–"}
        </Text>
        <Text size="sm" c="dimmed">
          {data?.count ?? 0} avaliações da comunidade
        </Text>
      </Group>
      <Rating value={stars} onChange={setStars} size="lg" />
      <Textarea placeholder="Escreva uma crítica (opcional)" autosize minRows={2} value={review} onChange={(e) => setReview(e.currentTarget.value)} />
      <Button w="fit-content" disabled={!stars} onClick={save}>
        Salvar avaliação
      </Button>
      {data?.reviews.map((r) => (
        <Card key={r.name + r.at} padding="sm">
          <Group gap="xs">
            <Text size="sm" fw={600}>
              {r.name}
            </Text>
            <Rating value={r.stars} readOnly size="xs" />
          </Group>
          <Text size="sm" c="dimmed">
            {r.review}
          </Text>
        </Card>
      ))}
    </Stack>
  );
}

interface YtComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likes: number;
}

export function Comments({ item }: { item: QueueItem | null }) {
  const videoId = item?.source === "youtube" ? item.ref : null;
  const [res, setRes] = useState<{ id: string; comments: YtComment[]; disabled?: boolean; error?: string } | null>(null);

  useEffect(() => {
    if (!videoId) return;
    api<{ comments: YtComment[]; disabled?: boolean; error?: string }>(`/api/comments?videoId=${videoId}`)
      .then((r) => setRes({ id: videoId, ...r }))
      .catch((err: Error) => setRes({ id: videoId, comments: [], error: err.message }));
  }, [videoId]);

  if (!videoId) return <Empty icon={ThumbsUp} text="Comentários disponíveis para vídeos do YouTube." />;
  if (res?.id !== videoId) return <Loader size="sm" />;
  if (res.disabled) return <Empty icon={ThumbsUp} text="Defina YOUTUBE_API_KEY no .env.local para ver os comentários do YouTube." />;
  if (res.error) return <ErrorText text={res.error} />;
  if (!res.comments.length) return <Empty icon={ThumbsUp} text="Nenhum comentário." />;
  return (
    <Stack gap="md">
      {res.comments.map((c) => (
        <Group key={c.id} align="flex-start" wrap="nowrap" gap="sm">
          <MAvatar src={c.avatar} size={32} radius="xl" />
          <div style={{ minWidth: 0 }}>
            <Group gap="xs">
              <Text size="sm" fw={600}>
                {c.author}
              </Text>
              <Group gap={2} c="dimmed">
                <ThumbsUp size={12} />
                <Text size="xs">{c.likes}</Text>
              </Group>
            </Group>
            <Text size="sm" style={{ whiteSpace: "pre-line", overflowWrap: "anywhere" }}>
              {c.text}
            </Text>
          </div>
        </Group>
      ))}
    </Stack>
  );
}

export function Queue({ room, state, meId }: { room: RoomApi; state: RoomState; meId: number }) {
  const [url, setUrl] = useState("");
  const [kind, setKind] = useState<MediaKind>("auto");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const isOwner = state.room.ownerId === meId;

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await room.addToQueue(url, kind);
    setBusy(false);
    if (res.ok) {
      setUrl("");
      setError(null);
    } else setError(res.error ?? "Erro");
  }

  return (
    <Stack>
      <Group component="form" onSubmit={add} align="flex-end" gap="xs" wrap="wrap">
        <TextInput
          style={{ flex: "1 1 240px" }}
          placeholder="Link do YouTube ou de um vídeo (.mp4/.webm)"
          value={url}
          onChange={(e) => setUrl(e.currentTarget.value)}
        />
        <Select
          w={140}
          value={kind}
          onChange={(v) => setKind((v as MediaKind) ?? "auto")}
          allowDeselect={false}
          data={[
            { value: "auto", label: "Tipo: auto" },
            { value: "music", label: "Música" },
            { value: "video", label: "Vídeo" },
            { value: "movie", label: "Filme" },
          ]}
        />
        <Button type="submit" loading={busy} disabled={!url} leftSection={<Plus size={16} />}>
          Adicionar
        </Button>
      </Group>
      {error && <ErrorText text={error} />}
      {state.queue.length === 0 ? (
        <Empty icon={ListPlus} text="Fila vazia." />
      ) : (
        <Stack gap="xs">
          {state.queue.map((q, i) => (
            <Card key={q.id} padding="xs">
              <Group wrap="nowrap" gap="sm">
                <Text size="xs" c="dimmed" w={18} ta="center">
                  {i + 1}
                </Text>
                {q.thumbnail ? (
                  <Image src={q.thumbnail} alt="" w={64} h={40} radius="sm" fit="cover" />
                ) : (
                  <Center w={64} h={40} bg="dark.6" style={{ borderRadius: 4 }}>
                    <Clapperboard size={16} />
                  </Center>
                )}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <Text size="sm" fw={500} truncate>
                    {q.title}
                  </Text>
                  <Text size="xs" c="dimmed" truncate>
                    por {q.addedBy.name}
                  </Text>
                </div>
                {isOwner && (
                  <>
                    <ActionIcon variant="default" size="sm" onClick={() => room.moveInQueue(q.id, -1)} aria-label="Subir">
                      <ArrowUp size={14} />
                    </ActionIcon>
                    <ActionIcon variant="default" size="sm" onClick={() => room.moveInQueue(q.id, 1)} aria-label="Descer">
                      <ArrowDown size={14} />
                    </ActionIcon>
                  </>
                )}
                {(isOwner || q.addedBy.id === meId) && (
                  <ActionIcon variant="default" size="sm" color="red" onClick={() => room.removeFromQueue(q.id)} aria-label="Remover">
                    <X size={14} />
                  </ActionIcon>
                )}
              </Group>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export function Playlists({ room, current }: { room: RoomApi; current: QueueItem | null }) {
  const [lists, setLists] = useState<Playlist[]>([]);
  const [name, setName] = useState("");
  const [addUrl, setAddUrl] = useState<Record<number, string>>({});
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    api<Playlist[]>("/api/playlists").then(setLists).catch(() => {});
  }, []);

  const act = async (body: Record<string, unknown>) => {
    try {
      setLists(await api<Playlist[]>("/api/playlists", body));
      setMsg(null);
    } catch (err) {
      setMsg((err as Error).message);
    }
  };

  async function playAll(p: Playlist) {
    for (const it of p.items) await room.addToQueue(it.url, "auto", it.title);
    setMsg(`${p.items.length} itens enviados para a fila`);
  }

  return (
    <Stack>
      <Group
        component="form"
        gap="xs"
        onSubmit={(e) => {
          e.preventDefault();
          act({ action: "create", name }).then(() => setName(""));
        }}
      >
        <TextInput style={{ flex: 1 }} placeholder="Nova playlist" value={name} onChange={(e) => setName(e.currentTarget.value)} />
        <Button type="submit" disabled={!name} leftSection={<Plus size={16} />}>
          Criar
        </Button>
      </Group>
      {msg && (
        <Text size="sm" c="dimmed">
          {msg}
        </Text>
      )}
      {lists.length === 0 && <Empty icon={ListPlus} text="Você ainda não tem playlists." />}
      {lists.map((p) => (
        <Card key={p.id} padding="sm">
          <Stack gap="xs">
            <Group gap="xs" wrap="wrap">
              <Text fw={600} style={{ flex: 1 }}>
                {p.name}{" "}
                <Text span size="xs" c="dimmed">
                  ({p.items.length})
                </Text>
              </Text>
              {current && (
                <Button size="compact-xs" variant="default" leftSection={<Plus size={12} />} onClick={() => act({ action: "add", playlistId: p.id, url: current.url })}>
                  Atual
                </Button>
              )}
              <Button size="compact-xs" variant="default" leftSection={<Play size={12} />} disabled={!p.items.length} onClick={() => playAll(p)}>
                Tudo na fila
              </Button>
              <Tooltip label="Excluir playlist">
                <ActionIcon size="sm" variant="default" onClick={() => act({ action: "delete", playlistId: p.id })} aria-label="Excluir playlist">
                  <Trash2 size={12} />
                </ActionIcon>
              </Tooltip>
            </Group>
            {p.items.map((it) => (
              <Group key={it.id} gap="xs" wrap="nowrap">
                <Text size="sm" truncate style={{ flex: 1 }}>
                  {it.title}
                </Text>
                <Tooltip label="Adicionar à fila">
                  <ActionIcon size="sm" variant="subtle" onClick={() => room.addToQueue(it.url, "auto", it.title)} aria-label="Adicionar à fila">
                    <ListPlus size={14} />
                  </ActionIcon>
                </Tooltip>
                <ActionIcon size="sm" variant="subtle" color="red" onClick={() => act({ action: "removeItem", playlistId: p.id, itemId: it.id })} aria-label="Remover">
                  <X size={14} />
                </ActionIcon>
              </Group>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                act({ action: "add", playlistId: p.id, url: addUrl[p.id] }).then(() => setAddUrl((s) => ({ ...s, [p.id]: "" })));
              }}
            >
              <TextInput
                size="xs"
                placeholder="Adicionar link e Enter"
                value={addUrl[p.id] ?? ""}
                onChange={(e) => setAddUrl((s) => ({ ...s, [p.id]: e.currentTarget.value }))}
              />
            </form>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}

function Empty({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <Stack align="center" gap="xs" py="lg" c="dimmed">
      <ThemeIcon variant="light" color="gray" size="lg" radius="xl">
        <Icon size={18} />
      </ThemeIcon>
      <Text size="sm" ta="center">
        {text}
      </Text>
    </Stack>
  );
}

function ErrorText({ text }: { text: string }) {
  return (
    <Alert color="yellow" icon={<CircleAlert size={16} />} py="xs">
      {text}
    </Alert>
  );
}
