"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Paper,
  Progress,
  Radio,
  Slider,
  Stack,
  Switch,
  Tabs,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { Brain, Check, CircleAlert, Lock, Palette, Plus, Save, ShieldAlert, ShieldCheck, Sparkles, Trash2, Tv, User } from "lucide-react";
import { Character } from "@/components/character/Character";
import { GoldButton } from "@/components/GoldButton";
import { DEFAULT_PROFANITY_LIST, type ModerationResult } from "@/lib/profanity";
import { setPlayerPrefs, usePlayerPrefs, type PlayerPrefs } from "@/lib/playerPrefs";
import type { Me, RoomModeration } from "@/lib/types";
import type { RoomApi } from "./useRoom";

type SubTab = "avatar" | "video" | "moderation";
/** Survives remounts (toggling cinema mode rebuilds the panel layout). */
let lastSubTab: SubTab = "avatar";

export function SettingsPanel({ room, me, isOwner }: { room: RoomApi; me: Me; isOwner: boolean }) {
  const [subTab, setSubTabState] = useState<SubTab>(lastSubTab);
  const setSubTab = (t: SubTab) => setSubTabState((lastSubTab = t));

  return (
    <Stack gap="md" style={{ width: "100%", maxWidth: 800, margin: "0 auto" }}>
      <div>
        <Title order={4} fw={700}>
          Configurações da Sala & Preferências
        </Title>
        <Text size="xs" c="dimmed">
          Seu personagem, o seu player de vídeo e os filtros de segurança do chat.
        </Text>
      </div>

      <Tabs value={subTab} onChange={(v) => setSubTab(v as SubTab)} variant="pills" radius="xl">
        <Tabs.List>
          <Tabs.Tab value="avatar" leftSection={<User size={14} />}>
            Personagem
          </Tabs.Tab>
          <Tabs.Tab value="video" leftSection={<Tv size={14} />}>
            Vídeo & Player
          </Tabs.Tab>
          <Tabs.Tab value="moderation" leftSection={<ShieldAlert size={14} />}>
            Filtro de Chat
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {subTab === "avatar" && <AvatarSection me={me} />}
      {subTab === "video" && <VideoSection />}
      {subTab === "moderation" && <ModerationSection room={room} isOwner={isOwner} />}
    </Stack>
  );
}

/** The editor lives in one place (/avatar); here only the preview and a shortcut. */
function AvatarSection({ me }: { me: Me }) {
  const router = useRouter();
  return (
    <Card withBorder padding="md">
      <Group gap="xl" wrap="wrap" justify="center">
        <Box className="lounge-floor" p="md" style={{ borderRadius: 12 }}>
          <Character config={me.avatar} size={110} withStyles={false} />
        </Box>
        <Stack gap="xs" style={{ flex: "1 1 220px" }}>
          <Text fw={600}>Seu personagem</Text>
          <Text size="xs" c="dimmed">
            Pele, cabelo, roupas, expressões, maquiagem e acessórios ficam no editor completo, com a loja de itens.
          </Text>
          <GoldButton onClick={() => router.push("/avatar")} leftSection={<Palette size={16} />}>
            Abrir editor de personagem
          </GoldButton>
        </Stack>
      </Group>
    </Card>
  );
}

function VideoSection() {
  const prefs = usePlayerPrefs();
  const set = (patch: Partial<PlayerPrefs>) => setPlayerPrefs(patch);

  return (
    <Card withBorder padding="md">
      <Stack gap="md">
        <div>
          <Text fw={600} size="sm">
            Sincronização de Reprodução
          </Text>
          <Text size="xs" c="dimmed">
            Quanto o seu vídeo pode se adiantar ou atrasar em relação à sala antes de pular de volta automaticamente.
          </Text>
          <Radio.Group value={String(prefs.syncDrift)} onChange={(v) => set({ syncDrift: Number(v) as PlayerPrefs["syncDrift"] })} mt="xs">
            <Group gap="md">
              <Radio value="1" label="Preciso (1s - ideal para clipes)" />
              <Radio value="2" label="Equilibrado (2s - padrão)" />
              <Radio value="4" label="Suave (4s - conexões lentas)" />
            </Group>
          </Radio.Group>
        </div>

        <Divider />

        <div>
          <Text fw={600} size="sm">
            Volume Padrão
          </Text>
          <Text size="xs" c="dimmed">
            Volume inicial a cada novo vídeo: {prefs.volume}%
          </Text>
          <Slider value={prefs.volume} onChange={(volume) => set({ volume })} min={0} max={100} step={5} mt="xs" color="gold" />
        </div>

        <Divider />

        <Group justify="space-between" wrap="nowrap">
          <div>
            <Text fw={600} size="sm">
              Iniciar vídeos no mudo
            </Text>
            <Text size="xs" c="dimmed">
              Evita sustos sonoros ao trocar de vídeo automaticamente.
            </Text>
          </div>
          <Switch checked={prefs.startMuted} onChange={(e) => set({ startMuted: e.currentTarget.checked })} color="gold" />
        </Group>

        <Group justify="space-between" wrap="nowrap">
          <div>
            <Text fw={600} size="sm">
              Modo Cinema
            </Text>
            <Text size="xs" c="dimmed">
              Esconde a coluna do chat para o vídeo ocupar a largura toda. Também dá para alternar no botão acima do player.
            </Text>
          </div>
          <Switch checked={prefs.cinema} onChange={(e) => set({ cinema: e.currentTarget.checked })} color="gold" />
        </Group>
      </Stack>
    </Card>
  );
}

function ModerationSection({ room, isOwner }: { room: RoomApi; isOwner: boolean }) {
  const [moderation, setModeration] = useState<RoomModeration | null>(null);
  const [newWord, setNewWord] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void room.getModeration().then((res) => {
      if (!cancelled && res.moderation) setModeration(res.moderation);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once per mount; room methods are recreated each render
  }, []);

  if (!moderation) return null;

  const change = (patch: Partial<RoomModeration>) => {
    setSaved(false);
    setModeration({ ...moderation, ...patch });
  };
  const addWord = () => {
    const w = newWord.trim().toLowerCase();
    if (w && !moderation.words.includes(w)) change({ words: [...moderation.words, w] });
    setNewWord("");
  };

  async function save() {
    if (!moderation) return;
    setSaving(true);
    setError(null);
    const res = await room.setModeration(moderation);
    setSaving(false);
    if (res.ok) setSaved(true);
    else setError(res.error ?? "Não foi possível salvar");
  }

  return (
    <Card withBorder padding="md">
      <Stack gap="md">
        <Group justify="space-between" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            <ThemeIcon color="gold" variant="light" size="lg" radius="md">
              <ShieldCheck size={20} />
            </ThemeIcon>
            <div>
              <Group gap={6}>
                <Text fw={600} size="sm">
                  Filtro de Palavras da Sala
                </Text>
                <Badge color={moderation.enabled ? "green" : "gray"} variant="dot" size="sm">
                  {moderation.enabled ? "Ativo" : "Só a lista padrão"}
                </Badge>
              </Group>
              <Text size="xs" c="dimmed">
                Vale para todas as mensagens da sala, aplicado no servidor. A lista padrão ({DEFAULT_PROFANITY_LIST.length} termos) está
                sempre ligada.
              </Text>
            </div>
          </Group>
          <Switch
            checked={moderation.enabled}
            disabled={!isOwner}
            onChange={(e) => change({ enabled: e.currentTarget.checked })}
            color="gold"
            aria-label="Usar as palavras extras da sala"
          />
        </Group>

        {!isOwner && (
          <Alert color="gray" icon={<Lock size={16} />} py="xs">
            Só o dono da sala pode mudar o filtro. Ele também pode silenciar ou remover pessoas pela lista &quot;Na sala&quot;.
          </Alert>
        )}

        <Divider />

        <div>
          <Text fw={600} size="sm" mb={4}>
            Estilo de Censura no Chat
          </Text>
          <Radio.Group value={moderation.censorStyle} onChange={(v) => change({ censorStyle: v === "censor" ? "censor" : "asterisk" })}>
            <Group gap="lg">
              <Radio value="asterisk" label="Ocultar com asteriscos (ex: p***a)" disabled={!isOwner} />
              <Radio value="censor" label="Substituir por [censurado]" disabled={!isOwner} />
            </Group>
          </Radio.Group>
        </div>

        <div>
          <Text fw={600} size="sm" mb={2}>
            Palavras Extras Bloqueadas
          </Text>
          {isOwner && (
            <Group gap="xs" my="xs">
              <TextInput
                placeholder="Nova palavra proibida…"
                size="xs"
                value={newWord}
                maxLength={40}
                onChange={(e) => setNewWord(e.currentTarget.value)}
                onKeyDown={(e) => e.key === "Enter" && addWord()}
                style={{ flex: 1 }}
              />
              <Button size="xs" variant="default" onClick={addWord} leftSection={<Plus size={14} />}>
                Adicionar
              </Button>
            </Group>
          )}
          <Group gap={6}>
            {moderation.words.length === 0 ? (
              <Text size="xs" c="dimmed" fs="italic">
                Nenhuma palavra extra.
              </Text>
            ) : (
              moderation.words.map((word) => (
                <Badge
                  key={word}
                  variant="filled"
                  color="dark"
                  rightSection={
                    isOwner && (
                      <ActionIcon
                        size="xs"
                        color="gray"
                        variant="transparent"
                        aria-label={`Remover ${word}`}
                        onClick={() => change({ words: moderation.words.filter((w) => w !== word) })}
                      >
                        <Trash2 size={10} />
                      </ActionIcon>
                    )
                  }
                >
                  {word}
                </Badge>
              ))
            )}
          </Group>
        </div>

        {isOwner && (
          <Group justify="flex-end" gap="xs">
            {error && (
              <Text size="xs" c="red" style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <CircleAlert size={12} /> {error}
              </Text>
            )}
            <GoldButton size="sm" loading={saving} onClick={save} leftSection={saved ? <Check size={14} /> : <Save size={14} />}>
              {saved ? "Filtro salvo" : "Salvar filtro"}
            </GoldButton>
          </Group>
        )}

        <Divider />

        <MessageTester words={moderation.words} />
      </Stack>
    </Card>
  );
}

/** Tries a sentence against the AI moderator (on demand only: each check costs API credits). */
function MessageTester({ words }: { words: string[] }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ModerationResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ text: string; score: number; flagged: boolean; at: string; reason: string }[]>([]);

  async function check() {
    if (!text.trim()) return;
    setBusy(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, customWords: words, useLangChain: true }),
      });
      const data = (await res.json()) as ModerationResult & { error?: string };
      if (!res.ok) throw new Error(data.error ?? `Erro ${res.status}`);
      setResult(data);
      setHistory((prev) => [
        {
          text,
          score: data.toxicityScore,
          flagged: data.flagged,
          at: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
          reason: data.reason,
        },
        ...prev.slice(0, 9),
      ]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Paper p="sm" withBorder style={{ background: "rgba(201, 164, 60, 0.03)", borderColor: "rgba(201, 164, 60, 0.2)" }}>
      <Group gap={6} mb="xs">
        <Sparkles size={16} color="#c9a43c" />
        <Text size="xs" fw={700} tt="uppercase" c="gold.4">
          Verificador Inteligente de Mensagens
        </Text>
      </Group>
      <Text size="xs" c="dimmed" mb="sm">
        Teste se uma frase seria considerada ofensiva, inclusive quando tenta driblar o filtro de palavras.
      </Text>
      <Group gap="xs">
        <TextInput
          placeholder="Digite uma mensagem para testar…"
          size="xs"
          value={text}
          maxLength={1000}
          onChange={(e) => setText(e.currentTarget.value)}
          onKeyDown={(e) => e.key === "Enter" && check()}
          style={{ flex: 1 }}
        />
        <GoldButton size="xs" loading={busy} onClick={check} leftSection={<Brain size={14} />}>
          Verificar
        </GoldButton>
      </Group>

      {error && (
        <Text size="xs" c="red" mt="xs">
          {error}
        </Text>
      )}

      {result && (
        <Stack gap="xs" mt="md" p="xs" style={{ background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
          <Group justify="space-between">
            {result.flagged ? (
              <Badge color="red" leftSection={<ShieldAlert size={12} />}>
                Inadequado ({result.category})
              </Badge>
            ) : (
              <Badge color="green" leftSection={<ShieldCheck size={12} />}>
                Seguro / Aprovado
              </Badge>
            )}
            <Text size="xs" fw={600}>
              Grau de Inadequação: {(result.toxicityScore * 100).toFixed(0)}%
            </Text>
          </Group>
          <Progress
            value={result.toxicityScore * 100}
            color={result.toxicityScore > 0.6 ? "red" : result.toxicityScore > 0.3 ? "yellow" : "green"}
            size="sm"
            radius="xl"
          />
          <Text size="xs">
            <strong>Avaliação:</strong> {result.reason}
          </Text>
          <Text size="xs" c="dimmed">
            <strong>Como aparece no chat:</strong> {result.sanitizedText}
          </Text>
        </Stack>
      )}

      {history.length > 0 && (
        <Stack gap={6} mt="md">
          <Text size="xs" fw={600} tt="uppercase" c="dimmed">
            Suas últimas verificações
          </Text>
          {history.map((h, i) => (
            <Group key={i} justify="space-between" p="xs" style={{ background: "rgba(0,0,0,0.15)", borderRadius: 6 }}>
              <Box style={{ minWidth: 0, flex: 1 }}>
                <Text size="xs" lineClamp={1}>
                  &quot;{h.text}&quot;
                </Text>
                <Text size="xs" c="dimmed">
                  {h.reason} • {h.at}
                </Text>
              </Box>
              <Badge color={h.flagged ? "red" : "green"} size="xs" variant="light">
                {(h.score * 100).toFixed(0)}%
              </Badge>
            </Group>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
