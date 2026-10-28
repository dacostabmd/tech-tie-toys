"use client";

import type { ReactNode } from "react";
import { MantineProvider, localStorageColorSchemeManager, type MantineThemeOverride } from "@mantine/core";

// Own key so a scheme saved before night mode became the default doesn't override it.
export const COLOR_SCHEME_KEY = "ttt-color-scheme";
const colorSchemeManager = localStorageColorSchemeManager({ key: COLOR_SCHEME_KEY });

/** The color scheme manager holds functions, so it can't be passed from the (server) root layout. */
export function ThemeProvider({ theme, children }: { theme: MantineThemeOverride; children: ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark" colorSchemeManager={colorSchemeManager}>
      {children}
    </MantineProvider>
  );
}
