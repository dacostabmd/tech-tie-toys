import { Suspense } from "react";
import { Box, Card, Container, SimpleGrid, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { Bot, Clapperboard, Coins, Radio } from "lucide-react";
import { AuthForm } from "./AuthForm";
import { Avatar } from "@/components/Avatar";
import { ColorSchemeToggle } from "@/components/ColorSchemeToggle";
import { PRESET_IDS, presetConfig } from "@/lib/avatar";

const FEATURES = [
  { icon: Clapperboard, title: "Assista junto", text: "Fila colaborativa de YouTube e vídeos, sincronizada para toda a sala." },
  { icon: Bot, title: "Notas de IA", text: "Histórias de bandas, dissertações sobre vídeos e críticas de filmes." },
  { icon: Coins, title: "Ganhe tokens", text: "Fique nas salas sociais e gaste tokens no seu personagem." },
  { icon: Radio, title: "Transmita", text: "Compartilhe sua tela ou câmera direto do navegador." },
];

export default function Home() {
  return (
    <>
      <Box pos="fixed" top={16} right={16} style={{ zIndex: 10 }}>
        <ColorSchemeToggle />
      </Box>
      <Container size="lg" py={48}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={48} style={{ alignItems: "center" }}>
          <Stack gap="lg">
            <Box style={{ display: "flex", gap: 4 }}>
              {PRESET_IDS.map((id) => (
                <Avatar key={id} size={64} config={presetConfig(id)} animated />
              ))}
            </Box>
            <div>
              <Title order={1} fz={{ base: 36, md: 48 }} fw={900}>
                Tech Tie Toys
              </Title>
              <Text
                fz={{ base: 28, md: 40 }}
                fw={900}
                variant="gradient"
                gradient={{ from: "gold.3", to: "gold.8", deg: 90 }}
                lh={1.1}
              >
                o Plug.dj, de novo.
              </Text>
            </div>
            <Text c="dimmed">
              Crie uma sala, chame a galera, coloque vídeos na fila e converse enquanto assiste. Salas sociais têm lounge
              com personagens; salas profissionais são focadas e sem gamificação.
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <Card key={title} padding="md">
                  <ThemeIcon variant="light" size="lg">
                    <Icon size={18} />
                  </ThemeIcon>
                  <Text fw={600} mt="xs">
                    {title}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {text}
                  </Text>
                </Card>
              ))}
            </SimpleGrid>
          </Stack>
          <Suspense>
            <AuthForm />
          </Suspense>
        </SimpleGrid>
      </Container>
    </>
  );
}
