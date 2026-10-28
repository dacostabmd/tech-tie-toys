"use client";

import { useEffect, useState } from "react";
import { ActionIcon, Tooltip, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { Moon, Sun } from "lucide-react";

/** Night (default) / day switch with single active icon and hydration safety. */
export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme("dark", { getInitialValueInEffect: true });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? computed === "dark" : true;

  return (
    <Tooltip label={isDark ? "Mudar para modo claro" : "Mudar para modo noturno"}>
      <ActionIcon
        variant="default"
        size="lg"
        radius="xl"
        aria-label={isDark ? "Mudar para modo claro" : "Mudar para modo noturno"}
        onClick={() => setColorScheme(isDark ? "light" : "dark")}
        style={{
          transition: "transform 0.15s ease, border-color 0.2s ease",
        }}
      >
        {isDark ? (
          <Sun size={18} style={{ color: "var(--mantine-color-gold-4, #d4b14a)" }} />
        ) : (
          <Moon size={18} />
        )}
      </ActionIcon>
    </Tooltip>
  );
}

