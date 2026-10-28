"use client";

import { useEffect, useRef, useState } from "react";
import { ActionIcon, Box, Group, ScrollArea, Stack, Text, TextInput } from "@mantine/core";
import { MessageCircle, SendHorizontal } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import type { ChatMessage } from "@/lib/types";

export function Chat({ messages, onSend, meId }: { messages: ChatMessage[]; onSend: (t: string) => void; meId: number }) {
  const [text, setText] = useState("");
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    viewport.current?.scrollTo({ top: viewport.current.scrollHeight });
  }, [messages.length]);

  return (
    <Stack gap={0} h="100%" style={{ minHeight: 0 }}>
      <ScrollArea viewportRef={viewport} style={{ flex: 1, minHeight: 0 }} px="md" py="sm">
        {messages.length === 0 && (
          <Stack align="center" gap={4} c="dimmed" py="xl">
            <MessageCircle size={28} />
            <Text size="sm">Diga oi para a sala</Text>
          </Stack>
        )}
        <Stack gap="sm">
          {messages.map((m) =>
            m.system ? (
              <Text key={m.id} size="xs" c="dimmed" ta="center">
                {m.text}
              </Text>
            ) : (
              <Group key={m.id} gap="xs" align="flex-start" wrap="nowrap">
                <Avatar config={m.user.avatar} size={32} />
                <Box style={{ minWidth: 0 }}>
                  <Group gap={6}>
                    <Text size="xs" fw={600} c={m.user.id === meId ? "var(--mantine-primary-color-filled)" : undefined}>
                      {m.user.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {new Date(m.at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </Text>
                  </Group>
                  <Text size="sm" style={{ overflowWrap: "anywhere" }}>
                    {m.text}
                  </Text>
                </Box>
              </Group>
            ),
          )}
        </Stack>
      </ScrollArea>
      <Box
        component="form"
        p="sm"
        style={{ borderTop: "1px solid var(--mantine-color-dark-4)" }}
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          onSend(text);
          setText("");
        }}
      >
        <TextInput
          placeholder="Mensagem…"
          value={text}
          maxLength={500}
          onChange={(e) => setText(e.currentTarget.value)}
          rightSection={
            <ActionIcon type="submit" variant="filled" aria-label="Enviar">
              <SendHorizontal size={16} />
            </ActionIcon>
          }
        />
      </Box>
    </Stack>
  );
}
