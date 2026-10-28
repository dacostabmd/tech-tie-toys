"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, Box, Card, PasswordInput, SegmentedControl, Stack, Text, TextInput } from "@mantine/core";
import { CircleAlert, LogIn, UserPlus } from "lucide-react";
import { api } from "@/lib/client";
import { playLoginIntro, preloadLoginIntro, unlockIntroAudio } from "@/components/LoginIntro";
import { GoldButton } from "@/components/GoldButton";

const DEV_LOGIN = process.env.NODE_ENV !== "production";

export function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const devSkip = DEV_LOGIN && mode === "login";

  useEffect(preloadLoginIntro, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    // Created before the await, while we are still inside the user's click.
    const audio = unlockIntroAudio();
    try {
      await api(mode === "login" ? "/api/auth/login" : "/api/auth/register", { name, password });
      playLoginIntro(audio);
      const next = params.get("next");
      router.push(next?.startsWith("/") ? next : "/lobby");
    } catch (err) {
      void audio?.close();
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card component="form" onSubmit={submit} padding="xl" w="100%" maw={400} mx="auto" style={{ minHeight: 345 }}>
      <Stack gap="md">
        <SegmentedControl
          fullWidth
          bg="transparent"
          value={mode}
          onChange={(v) => setMode(v as typeof mode)}
          data={[
            { value: "login", label: "Entrar" },
            { value: "register", label: "Criar conta" },
          ]}
        />
        <TextInput
          label="Nome de usuário"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          autoComplete="username"
          required={!devSkip}
        />
        <PasswordInput
          label="Senha"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required={!devSkip}
        />
        <Box style={{ minHeight: 32, display: "flex", alignItems: "center" }}>
          {devSkip ? (
            <Text size="xs" c="dimmed">
              Dev: clique em Entrar sem preencher para logar como &quot;dev&quot;.
            </Text>
          ) : null}
        </Box>
        {error && (
          <Alert color="red" icon={<CircleAlert size={16} />} py="xs">
            {error}
          </Alert>
        )}
        <GoldButton
          type="submit"
          fullWidth
          loading={busy}
          leftSection={mode === "login" ? <LogIn size={16} /> : <UserPlus size={16} />}
        >
          {mode === "login" ? "Entrar" : "Criar conta"}
        </GoldButton>
      </Stack>
    </Card>
  );
}
