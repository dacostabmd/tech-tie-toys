import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ColorSchemeScript, createTheme, mantineHtmlProps } from "@mantine/core";
import { CharacterStyles } from "@/components/character/Character";
import { FurnitureStyles } from "@/components/lounge/Furniture";
import { LoginIntroHost } from "@/components/LoginIntro";
import { COLOR_SCHEME_KEY, ThemeProvider } from "@/components/ThemeProvider";
import "@mantine/core/styles.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Brand palette: black marble, warm charcoal, leather brown and gold.
const theme = createTheme({
  colors: {
    gold: ["#fdf8ec", "#f6ecd0", "#ecdcaa", "#e2ca81", "#d9bb5f", "#d4b14a", "#c9a43c", "#b08e30", "#9a7b27", "#82671d"],
    dark: ["#ddd7cc", "#b9b1a4", "#8f877a", "#6b6457", "#4a443b", "#2f2b25", "#1d1a16", "#151310", "#0f0e0c", "#0b0a09"],
  },
  primaryColor: "gold",
  primaryShade: { light: 7, dark: 6 },
  autoContrast: true,
  defaultRadius: "md",
  fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
  fontFamilyMonospace: "var(--font-geist-mono), monospace",
  components: {
    Card: { defaultProps: { withBorder: true, radius: "lg" } },
    SegmentedControl: {
      defaultProps: {
        radius: "md",
      },
      styles: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
  },
});

export const metadata: Metadata = {
  title: "Tech Tie Toys",
  description: "Assista vídeos junto com outras pessoas, converse e ganhe tokens para seu avatar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" localStorageKey={COLOR_SCHEME_KEY} />
      </head>
      <body>
        {/* Character CSS once for the whole app; every <Character> uses withStyles={false}. */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
          <CharacterStyles />
          <FurnitureStyles />
        </svg>
        <ThemeProvider theme={theme}>
          {children}
          <LoginIntroHost />
        </ThemeProvider>
      </body>
    </html>
  );
}
