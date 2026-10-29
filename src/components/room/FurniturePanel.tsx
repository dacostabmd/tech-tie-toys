"use client";

import { useState } from "react";
import { Alert, Badge, Box, Button, Card, Chip, ColorSwatch, Group, Stack, Tabs, Text, Tooltip } from "@mantine/core";
import { Archive, CircleAlert, Coins, FlipHorizontal2, PackageOpen, Plus, ShoppingCart, Store, Trash2 } from "lucide-react";
import {
  FURNITURE,
  FURNITURE_CATEGORIES,
  FURNITURE_COLORS,
  type FurnitureCategory,
  type FurnitureId,
  type PlacedFurniture,
} from "@/components/lounge/catalog";
import { api } from "@/lib/client";
import type { FurnitureCounts } from "@/lib/lounge";
import type { Me } from "@/lib/types";

const IDS = Object.keys(FURNITURE) as FurnitureId[];

export interface FurniturePanelProps {
  me: Me;
  onMe: (me: Me) => void;
  /** Pieces already placed (in this room and the owner's other rooms), per id. */
  used: FurnitureCounts;
  /** Only the room owner can place, move and store furniture. */
  canDecorate: boolean;
  selected: PlacedFurniture | null;
  missingBase: boolean;
  onPlace: (id: FurnitureId) => void;
  onStore: () => void;
  onFlip: () => void;
  onColor: (color: string | null) => void;
  onRestoreBase: () => void;
}

/** Shop and inventory for the lounge, plus the controls of the selected piece while decorating. */
export function FurniturePanel({ me, onMe, used, canDecorate, selected, missingBase, onPlace, onStore, onFlip, onColor, onRestoreBase }: FurniturePanelProps) {
  const [tab, setTab] = useState<string | null>("shop");
  const [cat, setCat] = useState<"all" | FurnitureCategory>("all");
  const [buying, setBuying] = useState<FurnitureId | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function buy(id: FurnitureId) {
    setBuying(id);
    setError(null);
    try {
      onMe(await api<Me>("/api/furniture", { id }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBuying(null);
    }
  }

  const shop = IDS.filter((id) => cat === "all" || FURNITURE[id].cat === cat);
  const inventory = IDS.filter((id) => (me.furniture[id] ?? 0) > 0);
  const sel = selected ? FURNITURE[selected.id] : null;

  return (
    <Stack gap="sm" p="xs">
      <Group justify="space-between" wrap="nowrap">
        <Group gap={6} wrap="nowrap">
          <Coins size={18} color="var(--mantine-color-yellow-5)" />
          <Text fw={700}>{me.tokens} tokens</Text>
        </Group>
        {canDecorate && missingBase && (
          <Button size="xs" variant="default" onClick={onRestoreBase}>
            Restaurar base
          </Button>
        )}
      </Group>

      {selected && sel && (
        <Card padding="sm" withBorder>
          <Stack gap="xs">
            <Group justify="space-between" wrap="nowrap">
              <Text fw={700} size="sm" truncate>
                {sel.name}
              </Text>
              <Group gap={6} wrap="nowrap">
                <Button size="xs" variant="default" leftSection={<FlipHorizontal2 size={14} />} onClick={onFlip}>
                  Espelhar
                </Button>
                <Button
                  size="xs"
                  variant="default"
                  leftSection={selected.base ? <Trash2 size={14} /> : <Archive size={14} />}
                  onClick={onStore}
                >
                  {selected.base ? "Remover" : "Guardar"}
                </Button>
              </Group>
            </Group>
            <Group gap={6}>
              {FURNITURE_COLORS.map((c) => (
                <Tooltip key={c} label={c} openDelay={400}>
                  <ColorSwatch
                    component="button"
                    type="button"
                    color={c}
                    size={24}
                    radius={8}
                    onClick={() => onColor(c)}
                    aria-label={`Cor ${c}`}
                    aria-pressed={selected.color?.toLowerCase() === c}
                    style={{
                      cursor: "pointer",
                      outline: selected.color?.toLowerCase() === c ? "2px solid var(--mantine-primary-color-filled)" : undefined,
                      outlineOffset: 2,
                    }}
                  />
                </Tooltip>
              ))}
              <Button size="compact-xs" variant="subtle" onClick={() => onColor(null)}>
                Cor padrão
              </Button>
            </Group>
          </Stack>
        </Card>
      )}

      <Tabs value={tab} onChange={setTab} keepMounted={false}>
        <Tabs.List grow>
          <Tabs.Tab value="shop" leftSection={<Store size={14} />}>
            Loja
          </Tabs.Tab>
          <Tabs.Tab value="inventory" leftSection={<PackageOpen size={14} />}>
            Inventário
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="shop" pt="sm">
          <Stack gap="sm">
            <Chip.Group multiple={false} value={cat} onChange={(v) => setCat(v as "all" | FurnitureCategory)}>
              <Group gap={6}>
                <Chip value="all" size="xs">
                  Todos
                </Chip>
                {(Object.keys(FURNITURE_CATEGORIES) as FurnitureCategory[]).map((c) => (
                  <Chip key={c} value={c} size="xs">
                    {FURNITURE_CATEGORIES[c]}
                  </Chip>
                ))}
              </Group>
            </Chip.Group>
            <TileGrid>
              {shop.map((id) => {
                const d = FURNITURE[id];
                const missing = d.price - me.tokens;
                const have = me.furniture[id] ?? 0;
                return (
                  <Tile key={id} id={id} name={d.name} note={have > 0 ? `Você tem ${have}` : undefined}>
                    <Button
                      size="xs"
                      fullWidth
                      variant={missing > 0 ? "default" : "filled"}
                      leftSection={missing > 0 ? <Coins size={14} /> : <ShoppingCart size={14} />}
                      disabled={missing > 0}
                      loading={buying === id}
                      onClick={() => buy(id)}
                    >
                      {missing > 0 ? `Faltam ${missing}` : `Comprar · ${d.price}`}
                    </Button>
                  </Tile>
                );
              })}
            </TileGrid>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="inventory" pt="sm">
          {inventory.length === 0 ? (
            <Text size="sm" c="dimmed">
              Nada por aqui ainda. Compre móveis na loja.
            </Text>
          ) : (
            <Stack gap="sm">
              {!canDecorate && (
                <Text size="xs" c="dimmed">
                  Só o dono da sala decora. Seus móveis ficam guardados para as salas que você criar.
                </Text>
              )}
              <TileGrid>
                {inventory.map((id) => {
                  const own = me.furniture[id] ?? 0;
                  const placed = used[id] ?? 0;
                  const free = own - placed > 0;
                  return (
                    <Tile key={id} id={id} name={FURNITURE[id].name} note={`colocados ${placed}/${own}`}>
                      <Button
                        size="xs"
                        fullWidth
                        variant={free && canDecorate ? "filled" : "default"}
                        leftSection={<Plus size={14} />}
                        disabled={!free || !canDecorate}
                        onClick={() => onPlace(id)}
                      >
                        {free ? "Colocar" : "Todos colocados"}
                      </Button>
                    </Tile>
                  );
                })}
              </TileGrid>
            </Stack>
          )}
        </Tabs.Panel>
      </Tabs>

      {error && (
        <Alert color="red" icon={<CircleAlert size={16} />} py="xs">
          {error}
        </Alert>
      )}
    </Stack>
  );
}

function TileGrid({ children }: { children: React.ReactNode }) {
  return <Box style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>{children}</Box>;
}

function Tile({ id, name, note, children }: { id: FurnitureId; name: string; note?: string; children: React.ReactNode }) {
  return (
    <Card padding="xs" radius="lg" withBorder>
      <Stack gap={6}>
        <Box
          style={{ background: "#c7c7c7", borderRadius: 10, height: 84, display: "grid", placeItems: "center", overflow: "hidden" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- small static SVG thumbnail */}
          <img src={`/lounge/furniture/${id}.svg`} alt="" style={{ maxWidth: "88%", maxHeight: 74, objectFit: "contain" }} />
        </Box>
        <Box>
          <Text size="sm" fw={700} lh={1.2}>
            {name}
          </Text>
          {note && (
            <Badge size="xs" variant="default" mt={4} ff="monospace" tt="none">
              {note}
            </Badge>
          )}
        </Box>
        {children}
      </Stack>
    </Card>
  );
}
