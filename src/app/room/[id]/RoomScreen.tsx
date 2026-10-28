"use client";

import Link from "next/link";
import { use, useState, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Menu,
  Stack,
  Tabs,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Group as PanelGroup, Panel, Separator, useDefaultLayout } from "react-resizable-panels";
import {
  ArrowLeft,
  Bot,
  Briefcase,
  Camera,
  CircleAlert,
  ListMusic,
  ListOrdered,
  Maximize2,
  MessageSquareText,
  MessageSquareOff,
  Minimize2,
  Monitor,
  PartyPopper,
  Settings,
  SkipForward,
  Square,
  Star,
  UserX,
  Users,
  WifiOff,
} from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { Navbar } from "@/components/Navbar";
import { Chat } from "@/components/room/Chat";
import { Lounge } from "@/components/room/Lounge";
import { AiNotes, Comments, Playlists, Queue, Ratings } from "@/components/room/Panels";
import { Player } from "@/components/room/Player";
import { SettingsPanel } from "@/components/room/SettingsPanel";
import { useRoom } from "@/components/room/useRoom";
import { useStream } from "@/components/room/useStream";
import { useMe } from "@/lib/client";
import { setPlayerPrefs, usePlayerPrefs } from "@/lib/playerPrefs";
import type { PublicUser } from "@/lib/types";

type Tab = "lounge" | "ai" | "queue" | "playlists" | "ratings" | "comments" | "settings";

const slideVariants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

const fill = { height: "100%", minHeight: 0 } as const;

// Panel sizes are a per-viewer convenience: safe on the server and in browsers that block storage.
const layoutStorage = {
  getItem(key: string) {
    try {
      return typeof window === "undefined" ? null : window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  },
};

export function RoomScreen({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { me, setMe } = useMe();
  const room = useRoom(id, (tokens) => setMe((m) => (m ? { ...m, tokens } : m)));
  const live = useStream(room);
  const [tab, setTab] = useState<Tab | null>(null);
  const [direction, setDirection] = useState<number>(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const desktop = useMediaQuery("(min-width: 62em)", true) ?? true;
  const orientation = desktop ? "horizontal" : "vertical";
  const mainLayout = useDefaultLayout({
    id: `ttt-room-main-${orientation}`,
    storage: layoutStorage,
  });
  const leftLayout = useDefaultLayout({
    id: "ttt-room-left",
    storage: layoutStorage,
  });
  const { cinema } = usePlayerPrefs();
  const [modError, setModError] = useState<string | null>(null);
  const { state } = room;

  if (room.error) {
    return (
      <>
        <Navbar me={me} />
        <Center style={{ flex: 1 }} p="xl">
          <Stack align="center">
            <Alert color="red" icon={<CircleAlert size={16} />}>
              {room.error}
            </Alert>
            <Button component={Link} href="/lobby" variant="default" leftSection={<ArrowLeft size={16} />}>
              Voltar ao lobby
            </Button>
          </Stack>
        </Center>
      </>
    );
  }
  if (!state || !me) {
    return (
      <Center h="100dvh">
        <Group c="dimmed">
          <Loader size="sm" /> Conectando…
        </Group>
      </Center>
    );
  }

  const social = state.room.mode === "social";
  const current = state.current?.item ?? null;
  const people = [...new Map(state.presence.map((p) => [p.id, p])).values()];
  const liveMedia = state.stream ? (live.isBroadcaster ? live.local : live.remote) : null;
  const activeTab: Tab = tab ?? (social ? "lounge" : "ai");
  const isOwner = state.room.ownerId === me.id;

  async function moderate(action: Promise<{ ok: boolean; error?: string }>) {
    const res = await action;
    setModError(res.ok ? null : (res.error ?? "Ação não permitida"));
  }

  /** The person chip; for the room owner it opens mute/kick actions. */
  const person = (p: PublicUser) => {
    const chip = social ? (
      <Avatar config={p.avatar} size={28} />
    ) : (
      <Badge variant="default" size="sm" style={{ cursor: isOwner ? "pointer" : undefined }}>
        {p.name}
      </Badge>
    );
    if (!isOwner || p.id === me.id) {
      return (
        <Tooltip key={p.id} label={p.name}>
          <Box>{chip}</Box>
        </Tooltip>
      );
    }
    return (
      <Menu key={p.id} position="bottom-start" withinPortal>
        <Menu.Target>
          <UnstyledButton aria-label={`Moderar ${p.name}`}>{chip}</UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{p.name}</Menu.Label>
          <Menu.Item leftSection={<MessageSquareOff size={14} />} onClick={() => moderate(room.mute(p.id, 5))}>
            Silenciar 5 min
          </Menu.Item>
          <Menu.Item leftSection={<MessageSquareOff size={14} />} onClick={() => moderate(room.mute(p.id, 60))}>
            Silenciar 1 hora
          </Menu.Item>
          <Menu.Item leftSection={<MessageSquareText size={14} />} onClick={() => moderate(room.mute(p.id, 0))}>
            Liberar chat
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item color="red" leftSection={<UserX size={14} />} onClick={() => moderate(room.kick(p.id))}>
            Remover da sala (10 min)
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  };

  const tabs: { value: Tab; label: string; icon: ReactNode; show: boolean }[] = [
    {
      value: "lounge",
      label: "Lounge",
      icon: <PartyPopper size={14} />,
      show: social,
    },
    {
      value: "ai",
      label: "Notas da IA",
      icon: <Bot size={14} />,
      show: true,
    },
    {
      value: "queue",
      label: `Fila (${state.queue.length})`,
      icon: <ListOrdered size={14} />,
      show: true,
    },
    {
      value: "playlists",
      label: "Playlists",
      icon: <ListMusic size={14} />,
      show: true,
    },
    {
      value: "ratings",
      label: "Avaliar",
      icon: <Star size={14} />,
      show: true,
    },
    {
      value: "comments",
      label: "Comentários",
      icon: <MessageSquareText size={14} />,
      show: true,
    },
    {
      value: "settings",
      label: "Configurações",
      icon: <Settings size={14} />,
      show: true,
    },
  ];

  const visibleTabs = tabs.filter((t) => t.show);

  function handleTabChange(nextTab: Tab) {
    if (nextTab === activeTab) return;
    const currentIndex = visibleTabs.findIndex((t) => t.value === activeTab);
    const nextIndex = visibleTabs.findIndex((t) => t.value === nextTab);
    setDirection(nextIndex > currentIndex ? 1 : -1);
    setTab(nextTab);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStartRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      const idx = visibleTabs.findIndex((t) => t.value === activeTab);
      if (deltaX < 0 && idx < visibleTabs.length - 1) {
        handleTabChange(visibleTabs[idx + 1].value);
      } else if (deltaX > 0 && idx > 0) {
        handleTabChange(visibleTabs[idx - 1].value);
      }
    }
  }

  return (
    <Box h="100dvh" style={{ display: "flex", flexDirection: "column" }}>
      <Navbar
        me={me}
        showTokens={social}
        center={
          <Group gap="sm" wrap="nowrap">
            <Title order={4} lineClamp={1}>
              {state.room.name}
            </Title>
            <Badge
              variant="light"
              color={social ? "grape" : "blue"}
              leftSection={social ? <PartyPopper size={12} /> : <Briefcase size={12} />}
              visibleFrom="sm"
            >
              {social ? "Social" : "Profissional"}
            </Badge>
            {!room.connected && (
              <Badge color="yellow" variant="light" leftSection={<WifiOff size={12} />}>
                reconectando
              </Badge>
            )}
          </Group>
        }
      />

      <Box style={{ flex: 1, minHeight: 0 }} p="xs">
        <PanelGroup
          key={`${orientation}-${cinema}`}
          orientation={orientation}
          defaultLayout={cinema ? undefined : mainLayout.defaultLayout}
          onLayoutChanged={cinema ? undefined : mainLayout.onLayoutChanged}
          style={fill}
        >
          <Panel id="stage" defaultSize={cinema ? "100" : "70"} minSize="35">
            <PanelGroup
              orientation="vertical"
              defaultLayout={leftLayout.defaultLayout}
              onLayoutChanged={leftLayout.onLayoutChanged}
              style={fill}
            >
              {/* Video */}
              <Panel id="player" defaultSize="62" minSize="25">
                <Card
                  padding="xs"
                  style={{
                    ...fill,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <Group gap="xs" wrap="wrap" justify="space-between">
                    <Box style={{ minWidth: 0, flex: "1 1 200px" }}>
                      <Text size="xs" c="dimmed" tt="uppercase">
                        Tocando agora
                      </Text>
                      <Text fw={600} truncate>
                        {current ? current.title : "—"}
                      </Text>
                      {current && (
                        <Text size="xs" c="dimmed" truncate>
                          {current.author} · colocado por {current.addedBy.name}
                        </Text>
                      )}
                    </Box>
                    <Group gap="xs">
                      <Tooltip label={cinema ? "Mostrar o chat" : "Modo cinema (esconde o chat)"}>
                        <ActionIcon
                          variant="default"
                          size="lg"
                          aria-label={cinema ? "Sair do modo cinema" : "Modo cinema"}
                          onClick={() => setPlayerPrefs({ cinema: !cinema })}
                        >
                          {cinema ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                        </ActionIcon>
                      </Tooltip>
                      {current && (
                        <Button size="xs" variant="default" leftSection={<SkipForward size={14} />} onClick={room.skip}>
                          Pular
                          {state.skipVotes > 0 ? ` (${state.skipVotes})` : ""}
                        </Button>
                      )}
                      {live.isBroadcaster ? (
                        <Button size="xs" color="red" leftSection={<Square size={14} />} onClick={live.stop}>
                          Parar transmissão
                        </Button>
                      ) : (
                        <>
                          <Tooltip label="Transmitir sua tela para a sala">
                            <Button
                              size="xs"
                              variant="default"
                              disabled={!!state.stream}
                              leftSection={<Monitor size={14} />}
                              onClick={() => live.start("screen")}
                            >
                              Tela
                            </Button>
                          </Tooltip>
                          <Tooltip label="Transmitir sua câmera para a sala">
                            <Button
                              size="xs"
                              variant="default"
                              disabled={!!state.stream}
                              leftSection={<Camera size={14} />}
                              onClick={() => live.start("camera")}
                            >
                              Câmera
                            </Button>
                          </Tooltip>
                        </>
                      )}
                    </Group>
                  </Group>
                  {live.error && (
                    <Alert color="red" icon={<CircleAlert size={14} />} py={4} withCloseButton={false}>
                      {live.error}
                    </Alert>
                  )}
                  <Box style={{ flex: 1, minHeight: 0 }}>
                    <Player
                      current={state.current}
                      serverNow={room.serverNow}
                      onDuration={room.reportDuration}
                      onEnded={room.reportEnded}
                      live={liveMedia}
                      liveLabel={state.stream?.user.name}
                    />
                  </Box>
                </Card>
              </Panel>

              <Separator className="resize-handle" />

              {/* The single tabs section below the video */}
              <Panel id="tabs" minSize="15">
                <Card padding={0} style={fill}>
                  <Tabs
                    value={activeTab}
                    onChange={(v) => handleTabChange(v as Tab)}
                    style={{
                      ...fill,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Tabs.List
                      className="room-tabs-list"
                      style={{
                        flexWrap: "nowrap",
                        overflowX: "auto",
                        flexShrink: 0,
                        position: "relative",
                      }}
                    >
                      {visibleTabs.map((t) => {
                        const isActive = activeTab === t.value;
                        return (
                          <Tabs.Tab
                            key={t.value}
                            value={t.value}
                            leftSection={t.icon}
                            style={{
                              whiteSpace: "nowrap",
                              position: "relative",
                            }}
                          >
                            {t.label}
                            {isActive && (
                              <motion.div
                                layoutId="room-tabs-indicator"
                                style={{
                                  position: "absolute",
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  height: 2,
                                  backgroundColor: "var(--mantine-primary-color-filled, #c9a43c)",
                                  borderRadius: "1px 1px 0 0",
                                  zIndex: 2,
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 450,
                                  damping: 35,
                                }}
                              />
                            )}
                          </Tabs.Tab>
                        );
                      })}
                    </Tabs.List>

                    <Box
                      style={{
                        flex: 1,
                        minHeight: 0,
                        position: "relative",
                        overflow: "hidden",
                      }}
                      onTouchStart={activeTab !== "lounge" ? handleTouchStart : undefined}
                      onTouchEnd={activeTab !== "lounge" ? handleTouchEnd : undefined}
                    >
                      <AnimatePresence initial={false} custom={direction} mode="popLayout">
                        <motion.div
                          key={activeTab}
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                            duration: 0.28,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            overflowY: activeTab === "lounge" ? "hidden" : "auto",
                            padding: activeTab === "lounge" ? 8 : 16,
                          }}
                        >
                          {activeTab === "lounge" && social && (
                            <Lounge presence={state.presence} chat={state.chat} mySocketId={room.socket.id} onMove={room.move} />
                          )}
                          {activeTab === "ai" && <AiNotes item={current} />}
                          {activeTab === "queue" && <Queue room={room} state={state} meId={me.id} />}
                          {activeTab === "playlists" && <Playlists room={room} current={current} />}
                          {activeTab === "ratings" && <Ratings item={current} />}
                          {activeTab === "comments" && <Comments item={current} />}
                          {activeTab === "settings" && <SettingsPanel room={room} me={me} isOwner={isOwner} />}
                        </motion.div>
                      </AnimatePresence>
                    </Box>
                  </Tabs>
                </Card>
              </Panel>
            </PanelGroup>
          </Panel>

          {!cinema && <Separator className="resize-handle" />}

          {/* Room chat (hidden in cinema mode) */}
          {!cinema && (
            <Panel id="chat" defaultSize="30" minSize="18">
              <Card padding={0} style={{ ...fill, display: "flex", flexDirection: "column" }}>
                <Box
                  p="sm"
                  style={{
                    borderBottom: "1px solid var(--mantine-color-dark-4)",
                  }}
                >
                  <Group gap={6} mb={6}>
                    <Users size={14} />
                    <Text size="sm" fw={600}>
                      Na sala
                    </Text>
                    <Text size="sm" c="dimmed">
                      ({people.length})
                    </Text>
                  </Group>
                  <Group gap={social ? 4 : 6}>{people.map(person)}</Group>
                  {modError && (
                    <Text size="xs" c="red" mt={4}>
                      {modError}
                    </Text>
                  )}
                </Box>
                <Box style={{ flex: 1, minHeight: 0 }}>
                  <Chat messages={state.chat} onSend={room.sendChat} meId={me.id} />
                </Box>
              </Card>
            </Panel>
          )}
        </PanelGroup>
      </Box>
    </Box>
  );
}
