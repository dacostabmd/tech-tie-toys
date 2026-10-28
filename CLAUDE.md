@AGENTS.md

# Tech Tie Toys — convenções

- UI com **Mantine** (`@mantine/core` 9): todo card é `Card` do Mantine; layout com `Group`, `Stack`, `SimpleGrid`. Sem Tailwind.
- Ícones com **Lucide React** (`lucide-react`). Nunca usar emojis na interface nem em mensagens do sistema.
- Todo componente deve ser responsivo; áreas grandes da tela são redimensionáveis com `react-resizable-panels` v4 (`Group`, `Panel`, `Separator`).
- Na sala existe uma única seção de Tabs, abaixo do vídeo.
- Tempo real (chat, fila, lounge, sincronia) fica no Socket.IO (`src/server/rooms.ts`); áudio/vídeo ao vivo fica no LiveKit.
- Deploy na VPS: siga `deploy/README.md`. A VPS é compartilhada com outros sistemas — nunca pare ou reconfigure serviços que não são deste projeto.
