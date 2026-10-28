"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Card, Container, Grid, Group, SegmentedControl, SimpleGrid, Stack, Text, TextInput, Title } from "@mantine/core";
import { Briefcase, CircleAlert, PartyPopper, Plus, Users } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { GoldButton } from "@/components/GoldButton";
import { api, useMe } from "@/lib/client";
import type { RoomInfo, RoomMode } from "@/lib/types";

export default function LobbyPage() {
  const router = useRouter();
  const { me } = useMe();
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [name, setName] = useState("");
  const [mode, setMode] = useState<RoomMode>("social");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [list, online] = await Promise.all([
      api<RoomInfo[]>("/api/rooms"),
      api<Record<string, number>>("/api/rooms/online").catch(() => ({}) as Record<string, number>),
    ]);
    // Filter rooms: show only rooms with active participants (or created < 15s ago while creator navigates in)
    const active = list
      .map((r) => ({ ...r, online: online[r.id] ?? 0 }))
      .filter((r) => (r.online ?? 0) > 0 || Date.now() - new Date(r.createdAt).getTime() < 15_000);
    setRooms(active);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch, state is set after it resolves
    load().catch(() => {});
    const t = setInterval(() => load().catch(() => {}), 4_000);
    return () => clearInterval(t);
  }, [load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const room = await api<RoomInfo>("/api/rooms", { name, mode });
      router.push(`/room/${room.id}`);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <>
      <Navbar me={me} center={<Title order={4}>Salas</Title>} />
      <Container size="lg" py="xl" w="100%">
        <Grid gap="lg">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card component="form" onSubmit={create} padding="lg">
              <Stack>
                <Title order={5}>Criar sala</Title>
                <TextInput
                  placeholder="Nome da sala"
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                  disabled={busy}
                />
                <SegmentedControl
                  fullWidth
                  bg="transparent"
                  value={mode}
                  onChange={(v) => setMode(v as RoomMode)}
                  disabled={busy}
                  data={[
                    {
                      value: "social",
                      label: (
                        <Group gap={6} justify="center" wrap="nowrap">
                          <PartyPopper size={16} /> Social
                        </Group>
                      ),
                    },
                    {
                      value: "professional",
                      label: (
                        <Group gap={6} justify="center" wrap="nowrap">
                          <Briefcase size={16} /> Profissional
                        </Group>
                      ),
                    },
                  ]}
                />
                <Text size="xs" c="dimmed">
                  {mode === "social" ? "Lounge com avatares e tokens." : "Foco no conteúdo, sem gamificação."}
                </Text>
                {error && (
                  <Alert color="red" icon={<CircleAlert size={16} />} py="xs">
                    {error}
                  </Alert>
                )}
                <GoldButton type="submit" fullWidth loading={busy} leftSection={<Plus size={16} />}>
                  Criar e entrar
                </GoldButton>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              {rooms.length === 0 && (
                <Card padding="xl" style={{ gridColumn: "1 / -1", textAlign: "center" }}>
                  <Text c="dimmed" size="sm">
                    Nenhuma sala ativa no momento. Crie uma sala ao lado para começar!
                  </Text>
                </Card>
              )}
              {rooms.map((r) => {
                const count = r.online ?? 0;
                return (
                  <Card
                    key={r.id}
                    component={Link}
                    href={`/room/${r.id}`}
                    padding="md"
                    style={{
                      transition: "transform 0.15s ease, border-color 0.2s ease",
                      cursor: "pointer",
                    }}
                  >
                    <Group justify="space-between" wrap="nowrap" mb={8}>
                      <Text fw={600} size="md" truncate style={{ flex: 1 }}>
                        {r.name}
                      </Text>
                      <Badge
                        variant="light"
                        color={r.mode === "social" ? "grape" : "blue"}
                        size="xs"
                        leftSection={r.mode === "social" ? <PartyPopper size={11} /> : <Briefcase size={11} />}
                      >
                        {r.mode === "social" ? "Social" : "Profissional"}
                      </Badge>
                    </Group>

                    <Group justify="space-between" align="center" mt="xs">
                      <Text size="xs" c="dimmed">
                        por <strong style={{ color: "var(--mantine-color-gold-4, #d4b14a)" }}>{r.ownerName}</strong>
                      </Text>
                      <Badge
                        variant={count > 0 ? "light" : "outline"}
                        color={count > 0 ? "teal" : "gray"}
                        size="sm"
                        leftSection={<Users size={12} />}
                      >
                        {count} {count === 1 ? "pessoa" : "pessoas"}
                      </Badge>
                    </Group>
                  </Card>
                );
              })}
            </SimpleGrid>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
