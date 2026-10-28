"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Badge, Box, Button, Group, Text, ThemeIcon, Tooltip, UnstyledButton } from "@mantine/core";
import { Coins, LogOut, Sparkles } from "lucide-react";
import type { Me } from "@/lib/types";
import { logout } from "@/lib/client";
import { Avatar } from "./Avatar";

interface Props {
  me: Me | null;
  center?: ReactNode;
  showTokens?: boolean;
}

export const NAVBAR_HEIGHT = 100;

export function Navbar({ me, center, showTokens = true }: Props) {
  return (
    <Box
      component="header"
      h={NAVBAR_HEIGHT}
      px={{ base: "sm", md: "lg" }}
      style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: "var(--mantine-spacing-md)",
        borderBottom: "1px solid var(--mantine-color-dark-4)",
        background: "var(--mantine-color-dark-7)",
      }}
    >
      <UnstyledButton component={Link} href="/lobby">
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon size={44} radius="md" variant="filled">
            <Sparkles size={22} />
          </ThemeIcon>
          <Text fw={800} size="lg" visibleFrom="sm">
            Tech Tie Toys
          </Text>
        </Group>
      </UnstyledButton>

      <Box style={{ flex: 1, minWidth: 0 }}>{center}</Box>

      {me && (
        <Group gap="sm" wrap="nowrap">
          {showTokens && (
            <Tooltip label="Ganhe tokens ficando em salas sociais e gaste no seu avatar">
              <Badge
                component={Link}
                href="/avatar"
                size="lg"
                variant="light"
                color="yellow"
                leftSection={<Coins size={14} />}
                style={{ cursor: "pointer" }}
              >
                {me.tokens}
              </Badge>
            </Tooltip>
          )}
          <Tooltip label="Editar avatar">
            <UnstyledButton component={Link} href="/avatar">
              <Group gap="xs" wrap="nowrap">
                <Avatar config={me.avatar} size={44} animated />
                <Text size="sm" fw={500} visibleFrom="md">
                  {me.name}
                </Text>
              </Group>
            </UnstyledButton>
          </Tooltip>
          <Button variant="default" leftSection={<LogOut size={16} />} onClick={logout} visibleFrom="xs">
            Sair
          </Button>
        </Group>
      )}
    </Box>
  );
}
