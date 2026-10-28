"use client";

import { useState, type ReactNode } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  ColorSwatch,
  Container,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Switch,
  Tabs,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Coins,
  Hand,
  Footprints,
  Glasses,
  Lock,
  MessageCircle,
  Palette,
  PartyPopper,
  Pause,
  RotateCcw,
  Save,
  Scissors,
  Shirt,
  Smile,
  Sparkles,
} from "lucide-react";
import {
  CATALOG,
  Character,
  PRESETS,
  toggleAccessory,
  type CharacterConfig,
  type CharacterView,
  type Emote,
  type Facing,
} from "@/components/character/Character";
import { Navbar } from "@/components/Navbar";
import { DAILY_TOKEN_CAP, PRESET_IDS, TOKENS_PER_MINUTE, itemsOf, presetConfig, priceOf } from "@/lib/avatar";
import { api, useMe } from "@/lib/client";
import type { Me } from "@/lib/types";

const ACCESSORY_VIEW: Record<string, CharacterView> = { head: "head", face: "head", body: "neck" };
const same = (a: CharacterConfig, b: CharacterConfig) => JSON.stringify(a) === JSON.stringify(b);

export default function AvatarPage() {
  const { me, setMe } = useMe();
  const [draft, setDraft] = useState<CharacterConfig | null>(null);
  const [walking, setWalking] = useState(false);
  const [talking, setTalking] = useState(false);
  const [facing, setFacing] = useState<Facing>("none");
  const [emote, setEmote] = useState<Emote>("none");
  const [reduced, setReduced] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!me) return <Navbar me={null} />;

  const cfg = draft ?? me.avatar;
  const owned = new Set(me.owned);
  const locked = (id: string) => priceOf(id) > 0 && !owned.has(id);
  const cost = itemsOf(cfg)
    .filter(locked)
    .reduce((sum, id) => sum + priceOf(id), 0);
  const dirty = !same(cfg, me.avatar);
  const set = (patch: Partial<CharacterConfig>) => {
    setError(null);
    setDraft({ ...cfg, ...patch });
  };
  const preview = { walking, talking, facing, emote, className: reduced ? "ttt-rm" : undefined };

  async function save() {
    setSaving(true);
    setError(null);
    try {
      setMe(await api<Me>("/api/avatar", { avatar: cfg }));
      setDraft(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Navbar me={me} center={<Title order={4}>Seu personagem</Title>} />
      <Container size="xl" py="xl" w="100%">
        <Grid gap="lg">
          {/* Stage, preview controls and presets */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Stack>
              <Card padding="lg">
                <Stack>
                  <Box
                    className="lounge-floor"
                    style={{
                      borderRadius: 20,
                      padding: "30px 20px 18px",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      gap: 32,
                    }}
                  >
                    <Character config={cfg} size={210} withStyles={false} {...preview} />
                    <Stack gap={4} align="center">
                      <Character config={cfg} size={48} withStyles={false} {...preview} />
                      <Text size="xs" c="dimmed" ff="monospace">
                        48 × 67 px
                      </Text>
                    </Stack>
                  </Box>
                  <Group gap="xs" justify="center">
                    <PreviewToggle active={walking} onClick={() => setWalking((v) => !v)} icon={<Footprints size={16} />}>
                      Andar
                    </PreviewToggle>
                    <PreviewToggle active={talking} onClick={() => setTalking((v) => !v)} icon={<MessageCircle size={16} />}>
                      Falar
                    </PreviewToggle>
                    <PreviewToggle
                      active={facing === "left"}
                      onClick={() => setFacing((f) => (f === "left" ? "none" : "left"))}
                      icon={<ArrowLeft size={16} />}
                    >
                      Olhar
                    </PreviewToggle>
                    <PreviewToggle
                      active={facing === "right"}
                      onClick={() => setFacing((f) => (f === "right" ? "none" : "right"))}
                      icon={<ArrowRight size={16} />}
                      iconRight
                    >
                      Olhar
                    </PreviewToggle>
                    <PreviewToggle active={emote === "wave"} onClick={() => setEmote((e) => (e === "wave" ? "none" : "wave"))} icon={<Hand size={16} />}>
                      Acenar
                    </PreviewToggle>
                    <PreviewToggle active={emote === "cheer"} onClick={() => setEmote((e) => (e === "cheer" ? "none" : "cheer"))} icon={<PartyPopper size={16} />}>
                      Comemorar
                    </PreviewToggle>
                    <PreviewToggle active={reduced} onClick={() => setReduced((v) => !v)} icon={<Pause size={16} />}>
                      Movimento reduzido
                    </PreviewToggle>
                  </Group>
                </Stack>
              </Card>

              <Card padding="lg">
                <Text fw={700} mb="sm">
                  Presets
                </Text>
                <SimpleGrid cols={{ base: 4, sm: 6, md: 4, lg: 6 }} spacing="xs">
                  {PRESET_IDS.map((id) => {
                    const p = presetConfig(id);
                    return (
                      <UnstyledButton key={id} onClick={() => set(p)} aria-label={`Usar preset ${PRESETS[id].name}`}>
                        <Stack gap={4} align="center">
                          <Thumb selected={same(p, cfg)}>
                            <Character config={p} view="bust" staticPose withStyles={false} size={72} />
                          </Thumb>
                          <Text size="xs" fw={600} ta="center" lh={1.2}>
                            {PRESETS[id].name}
                          </Text>
                        </Stack>
                      </UnstyledButton>
                    );
                  })}
                </SimpleGrid>
              </Card>

              <Card padding="lg">
                <Group gap={6}>
                  <Coins size={22} color="var(--mantine-color-yellow-5)" />
                  <Text fz={24} fw={700}>
                    {me.tokens} tokens
                  </Text>
                </Group>
                <Text size="xs" c="dimmed">
                  Ganhe {TOKENS_PER_MINUTE} token por minuto ativo em salas sociais (até {DAILY_TOKEN_CAP} por dia). Itens com cadeado são comprados ao salvar.
                </Text>
              </Card>
            </Stack>
          </Grid.Col>

          {/* Editor */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Card padding="lg">
              <Tabs defaultValue="skin" keepMounted={false}>
                <Tabs.List mb="md">
                  <Tabs.Tab value="skin" leftSection={<Palette size={14} />}>
                    Pele
                  </Tabs.Tab>
                  <Tabs.Tab value="hair" leftSection={<Scissors size={14} />}>
                    Cabelo
                  </Tabs.Tab>
                  <Tabs.Tab value="top" leftSection={<Shirt size={14} />}>
                    Blusa
                  </Tabs.Tab>
                  <Tabs.Tab value="pants" leftSection={<Footprints size={14} />}>
                    Calça e tênis
                  </Tabs.Tab>
                  <Tabs.Tab value="face" leftSection={<Smile size={14} />}>
                    Rosto
                  </Tabs.Tab>
                  <Tabs.Tab value="acc" leftSection={<Glasses size={14} />}>
                    Acessórios
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="skin">
                  <ItemGrid>
                    {CATALOG.skins.map((s) => (
                      <Item
                        key={s.id}
                        name={s.name}
                        itemId={`skin:${s.id}`}
                        locked={locked}
                        selected={cfg.skin === s.hex}
                        onClick={() => set({ skin: s.hex })}
                      >
                        <Character config={{ ...cfg, skin: s.hex }} view="head" staticPose withStyles={false} size={88} />
                      </Item>
                    ))}
                  </ItemGrid>
                </Tabs.Panel>

                <Tabs.Panel value="hair">
                  <Stack>
                    <ItemGrid>
                      {CATALOG.hairs.map((h) => (
                        <Item
                          key={h.id}
                          name={h.name}
                          itemId={`hair:${h.id}`}
                          locked={locked}
                          selected={cfg.hair === h.id}
                          onClick={() => set({ hair: h.id })}
                        >
                          <Character config={{ ...cfg, hair: h.id }} view="head" staticPose withStyles={false} size={88} />
                        </Item>
                      ))}
                    </ItemGrid>
                    <Swatches label="Cor do cabelo" colors={CATALOG.hairColors} value={cfg.hairColor} onChange={(hairColor) => set({ hairColor })} />
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="top">
                  <Stack>
                    <ItemGrid>
                      {CATALOG.tops.map((t) => (
                        <Item
                          key={t.id}
                          name={t.name}
                          itemId={`top:${t.id}`}
                          locked={locked}
                          selected={cfg.top === t.id}
                          onClick={() => set({ top: t.id })}
                        >
                          <Character config={{ ...cfg, top: t.id }} view="torso" staticPose withStyles={false} size={88} />
                        </Item>
                      ))}
                    </ItemGrid>
                    <Swatches label="Cor da blusa" colors={CATALOG.clothColors} value={cfg.topColor} onChange={(topColor) => set({ topColor })} />
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="pants">
                  <Stack>
                    <Swatches label="Calça" colors={CATALOG.clothColors} value={cfg.pants} onChange={(pants) => set({ pants })} />
                    <Swatches label="Tênis" colors={CATALOG.clothColors} value={cfg.shoes} onChange={(shoes) => set({ shoes })} />
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="face">
                  <Stack>
                    <Text size="sm" fw={600}>
                      Formato do rosto
                    </Text>
                    <ItemGrid>
                      {CATALOG.faces.map((f) => (
                        <Item
                          key={f.id}
                          name={f.name}
                          itemId={`face:${f.id}`}
                          locked={locked}
                          selected={(cfg.face ?? "redondo") === f.id}
                          onClick={() => set({ face: f.id })}
                        >
                          <Character config={{ ...cfg, face: f.id }} view="head" staticPose withStyles={false} size={88} />
                        </Item>
                      ))}
                    </ItemGrid>
                    <Text size="sm" fw={600}>
                      Expressão
                    </Text>
                    <ItemGrid>
                      {CATALOG.expressions.map((e) => (
                        <Item
                          key={e.id}
                          name={e.name}
                          itemId={`expr:${e.id}`}
                          locked={locked}
                          selected={(cfg.expression ?? "feliz") === e.id}
                          onClick={() => set({ expression: e.id })}
                        >
                          <Character config={{ ...cfg, expression: e.id }} view="head" staticPose withStyles={false} size={88} />
                        </Item>
                      ))}
                    </ItemGrid>
                    <Text size="sm" fw={600}>
                      Maquiagem
                    </Text>
                    <ItemGrid>
                      {CATALOG.makeups.map((m) => (
                        <Item
                          key={m.id}
                          name={m.name}
                          itemId={`makeup:${m.id}`}
                          locked={locked}
                          selected={(cfg.makeup ?? "none") === m.id}
                          onClick={() => set({ makeup: m.id })}
                        >
                          <Character config={{ ...cfg, makeup: m.id }} view="head" staticPose withStyles={false} size={88} />
                        </Item>
                      ))}
                    </ItemGrid>
                    <Switch label="Cílios" checked={!!cfg.lashes} onChange={(e) => set({ lashes: e.currentTarget.checked })} />
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="acc">
                  <Stack gap="xs">
                    <Text size="xs" c="dimmed">
                      Um por grupo (topo, orelhas, rosto, boca, pescoço, lateral). Clique de novo para tirar.
                    </Text>
                    <ItemGrid>
                      {CATALOG.accessories.map((a) => {
                        const list = cfg.accessories ?? [];
                        return (
                          <Item
                            key={a.id}
                            name={a.name}
                            itemId={`acc:${a.id}`}
                            locked={locked}
                            selected={list.includes(a.id)}
                            onClick={() => set({ accessories: toggleAccessory(list, a.id) })}
                          >
                            <Character
                              config={{ ...cfg, accessories: toggleAccessory(list.filter((x) => x !== a.id), a.id) }}
                              view={ACCESSORY_VIEW[a.slot]}
                              staticPose
                              withStyles={false}
                              size={88}
                            />
                          </Item>
                        );
                      })}
                    </ItemGrid>
                  </Stack>
                </Tabs.Panel>
              </Tabs>

              <Group justify="space-between" mt="lg" pt="md" style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}>
                <Text size="sm" c="dimmed">
                  {cost > 0 ? `Novos itens: ${cost} tokens` : dirty ? "Alterações não salvas" : "Tudo salvo"}
                </Text>
                <Group gap="xs">
                  <Button variant="default" leftSection={<RotateCcw size={16} />} disabled={!dirty} onClick={() => setDraft(null)}>
                    Desfazer
                  </Button>
                  <Button
                    leftSection={cost > 0 ? <Coins size={16} /> : <Save size={16} />}
                    disabled={!dirty || cost > me.tokens}
                    loading={saving}
                    onClick={save}
                  >
                    {cost > 0 ? `Comprar e salvar (${cost})` : "Salvar"}
                  </Button>
                </Group>
              </Group>
              {cost > me.tokens && (
                <Text size="xs" c="red" ta="right" mt={4}>
                  Faltam {cost - me.tokens} tokens
                </Text>
              )}
              {error && (
                <Alert color="red" icon={<CircleAlert size={16} />} py="xs" mt="sm">
                  {error}
                </Alert>
              )}
            </Card>
          </Grid.Col>

          {/* The edited character next to the presets at real size */}
          <Grid.Col span={12}>
            <Card padding="lg">
              <Group gap={6} mb="sm">
                <Sparkles size={16} />
                <Text fw={700}>No chão do hub · 48 px</Text>
              </Group>
              <Box
                className="lounge-floor"
                style={{
                  borderRadius: 16,
                  padding: "56px 16px 16px",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  gap: 28,
                }}
              >
                {[...PRESET_IDS.map((id) => ({ key: id, config: presetConfig(id), label: PRESETS[id].name })), { key: "me", config: cfg, label: me.name }].map(
                  (c) => (
                    <Stack key={c.key} gap={4} align="center" pos="relative">
                      {talking && (
                        <Paper bg="white" c="dark.9" px={8} py={2} radius="lg" pos="absolute" bottom="100%" mb={6} style={{ whiteSpace: "nowrap" }}>
                          <Text size="xs">Oi!</Text>
                        </Paper>
                      )}
                      <Character config={c.config} size={48} withStyles={false} {...preview} />
                      <Badge size="xs" variant={c.key === "me" ? "filled" : "default"}>
                        {c.label}
                      </Badge>
                    </Stack>
                  ),
                )}
              </Box>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}

function PreviewToggle({
  active,
  onClick,
  icon,
  iconRight,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  iconRight?: boolean;
  children: ReactNode;
}) {
  return (
    <Button
      radius="xl"
      mih={44}
      variant={active ? "filled" : "default"}
      leftSection={iconRight ? undefined : icon}
      rightSection={iconRight ? icon : undefined}
      onClick={onClick}
      aria-pressed={active}
    >
      {children}
    </Button>
  );
}

function ItemGrid({ children }: { children: ReactNode }) {
  return <Box style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 10 }}>{children}</Box>;
}

function Thumb({ selected, children }: { selected?: boolean; children: ReactNode }) {
  return (
    <Box
      w="100%"
      style={{
        background: "#1e293b",
        borderRadius: 12,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        aspectRatio: "1",
        outline: selected ? "2px solid var(--mantine-primary-color-filled)" : undefined,
      }}
    >
      {children}
    </Box>
  );
}

function Item({
  name,
  itemId,
  locked,
  selected,
  onClick,
  children,
}: {
  name: string;
  itemId?: string;
  locked?: (id: string) => boolean;
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const isLocked = !!itemId && !!locked?.(itemId);
  return (
    <Card
      component="button"
      type="button"
      padding={8}
      radius="lg"
      onClick={onClick}
      aria-pressed={selected}
      style={{
        cursor: "pointer",
        textAlign: "center",
        borderWidth: selected ? 2 : undefined,
        borderColor: selected ? "var(--mantine-primary-color-filled)" : undefined,
        background: selected ? "var(--mantine-primary-color-light)" : undefined,
      }}
    >
      <Box pos="relative">
        <Thumb>{children}</Thumb>
        {isLocked && (
          <Badge
            size="sm"
            color="yellow"
            variant="filled"
            pos="absolute"
            top={4}
            right={4}
            leftSection={<Lock size={10} />}
          >
            {priceOf(itemId!)}
          </Badge>
        )}
        {selected && (
          <Box pos="absolute" top={4} left={4} c="var(--mantine-primary-color-contrast)" bg="var(--mantine-primary-color-filled)" style={{ borderRadius: 999, display: "grid", padding: 2 }}>
            <Check size={12} />
          </Box>
        )}
      </Box>
      <Text size="xs" fw={700} mt={6} lh={1.2}>
        {name}
      </Text>
    </Card>
  );
}

function Swatches({ label, colors, value, onChange }: { label: string; colors: readonly string[]; value: string; onChange: (c: string) => void }) {
  return (
    <Stack gap={6}>
      <Text size="sm" fw={600}>
        {label}
      </Text>
      <Group gap={8}>
        {colors.map((c) => {
          const selected = c.toLowerCase() === value.toLowerCase();
          return (
            <Tooltip key={c} label={c} openDelay={400}>
              <ColorSwatch
                component="button"
                type="button"
                color={c}
                size={34}
                radius={10}
                onClick={() => onChange(c)}
                aria-label={`${label} ${c}`}
                aria-pressed={selected}
                style={{
                  cursor: "pointer",
                  outline: selected ? "2px solid var(--mantine-primary-color-filled)" : undefined,
                  outlineOffset: 2,
                }}
              />
            </Tooltip>
          );
        })}
      </Group>
    </Stack>
  );
}
