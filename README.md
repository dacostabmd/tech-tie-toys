# Tech Tie Toys

Um "Plug.dj" moderno. Em cada sala as pessoas montam juntas uma fila de vídeos, assistem tudo sincronizado, conversam no chat e recebem notas de IA sobre o que está tocando. Salas **sociais** têm um lounge com personagens que andam e ganham tokens por tempo. Salas **profissionais** são focadas e não têm gamificação.

## Sumário

1. [Visão geral](#1-visão-geral)
2. [Como rodar](#2-como-rodar)
3. [Variáveis de ambiente](#3-variáveis-de-ambiente)
4. [Arquitetura](#4-arquitetura)
5. [Funcionalidades](#5-funcionalidades)
6. [Sistema de personagens e loja](#6-sistema-de-personagens-e-loja) (inclui o [lounge e a mobília](#lounge-do-cinema-e-mobília))
7. [Tokens e gamificação](#7-tokens-e-gamificação)
8. [Moderação e segurança](#8-moderação-e-segurança)
9. [Referência técnica](#9-referência-técnica) (banco, rotas da API, eventos do Socket.IO)
10. [Hospedagem, domínio e custos](#10-hospedagem-domínio-e-custos)
11. [Convenções do projeto](#11-convenções-do-projeto)
12. [Histórico do que foi feito](#12-histórico-do-que-foi-feito)
13. [Pendências e próximos passos](#13-pendências-e-próximos-passos)
14. [Limitações conhecidas](#14-limitações-conhecidas)

---

## 1. Visão geral

| | |
|---|---|
| **Framework** | Next.js 16.4 (App Router, Turbopack, Cache Components, `proxy.ts`) com React 19.3 |
| **Interface** | Mantine 9 (todo card é `Card`), Lucide React (sem emojis), `react-resizable-panels` v4, framer-motion |
| **Tempo real** | Socket.IO 4.8: chat, fila, sincronia do player, lounge, moderação e tokens |
| **Áudio e vídeo ao vivo** | LiveKit (SFU próprio na VPS): `livekit-client` 2.23 e `livekit-server-sdk` 2.19 |
| **Banco** | SQLite nativo do Node (`node:sqlite`, modo WAL) em `data/ttt.db` |
| **IA** | Claude via `@anthropic-ai/sdk` (notas dos vídeos) e LangChain + Claude Haiku (verificador de mensagens) |
| **Servidor** | `server.ts` customizado (HTTP + Next + Socket.IO), rodando com `tsx` |
| **Requisito** | Node 24 ou mais novo (por causa do `node:sqlite`) |

Telas:

| Rota | O que é |
|---|---|
| `/` | Apresentação e formulário de login ou cadastro |
| `/lobby` | Lista de salas e criação de sala (social ou profissional) |
| `/room/[id]` | A sala: navbar de 100px, player com uma única seção de abas abaixo, chat à direita, tudo redimensionável |
| `/avatar` | Editor do personagem com loja |

As rotas `/lobby`, `/room` e `/avatar` exigem sessão. O [src/proxy.ts](src/proxy.ts) manda para `/` quem não tem o cookie de sessão. A validação de verdade acontece na API e no servidor de Socket.IO.

---

## 2. Como rodar

```bash
npm install
cp .env.example .env.local          # preencha ANTHROPIC_API_KEY (e, se quiser, YOUTUBE_API_KEY)
# transmissão local: suba o LiveKit em modo dev (comando abaixo)
npm run dev                         # http://localhost:3000
```

LiveKit local (só é preciso para transmitir tela ou câmera):

```bash
docker run --rm -p 7880:7880 -p 7881:7881 -p 7882:7882/udp livekit/livekit-server:v1.13.11 --dev --bind 0.0.0.0
```

| Script | Faz |
|---|---|
| `npm run dev` | `tsx watch server.ts`: reinicia ao mudar `server.ts` ou `src/server`. Mudanças em `src/app` e `src/components` usam o hot reload do Next |
| `npm run build` | Build do Next |
| `npm start` | Produção (`NODE_ENV=production tsx server.ts`) |
| `npm run lint` / `npm run typecheck` | ESLint e TypeScript |

> **Atenção:** rode **um** `npm run dev` por vez. Vários ao mesmo tempo disputam a mesma trava do Next, e nenhum consegue abrir a porta 3000.

**Login de desenvolvimento:** fora de produção, o login não confere a senha. Clicar em "Entrar" com o formulário vazio entra como `dev`, e um nome novo cria a conta na hora.

---

## 3. Variáveis de ambiente

| Variável | Obrigatória | Para quê |
|---|---|---|
| `ANTHROPIC_API_KEY` | Sim, para a IA | Notas da IA e verificador de mensagens. Sem ela, a rota de análise responde 503 e o verificador usa só a lista de palavras |
| `YOUTUBE_API_KEY` | Não | Aba "Comentários" (YouTube Data API v3) |
| `PORT` | Não | Porta HTTP (padrão 3000; em produção, 3100) |
| `LIVEKIT_URL` | Para transmitir | `ws://localhost:7880` no local; `wss://live.<domínio>` em produção |
| `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET` | Para transmitir | `devkey` / `secret` no modo dev; em produção, gerar e usar as mesmas em `deploy/livekit/livekit.yaml` |
| `SUPABASE_*` | Não | Reservadas; o código ainda não usa Supabase |

O `server.ts` carrega o `.env.local` com `loadEnvConfig` do `@next/env`, então o Socket.IO enxerga as mesmas variáveis que o Next.

---

## 4. Arquitetura

```
 Navegador
   │  HTTPS (páginas + /api/*)       WebSocket (Socket.IO)         WebRTC (UDP)
   ▼                                  ▼                             ▼
┌─────────────────── server.ts (um processo Node) ───────────────┐  ┌────────────────┐
│  Next.js 16 ── rotas /api/* ───┐                                │  │ LiveKit (SFU)  │
│                                ├── src/server/db.ts ── SQLite   │  │ Docker na VPS  │
│  Socket.IO ── src/server/rooms.ts (salas em memória) ┘          │  └────────▲───────┘
│        └── gera os tokens de acesso ao LiveKit ─────────────────┼───────────┘
└─────────────────────────────────────────────────────────────────┘
```

- **Estado das salas:** fica na memória do processo ([rooms.ts](src/server/rooms.ts)) e é salvo no SQLite com um atraso de 1 s, juntando várias mudanças numa só escrita. Fila, vídeo atual e chat voltam depois de um reinício.
- **Sincronia do player:** o servidor guarda o `startedAt` do vídeo atual. Cada cliente calcula o próprio offset pelo relógio do servidor e corrige sozinho quando passa da tolerância escolhida.
- **Transmissão:**
  1. O Socket.IO controla a vez de transmitir (um transmissor por sala) e gera o token do LiveKit. Só quem detém a vez recebe permissão para publicar.
  2. O vídeo vai direto do navegador para o LiveKit por UDP, sem passar pelo Node.
- **Desempenho do lounge:** o personagem anda com `transform: translate3d`, que vai para o compositor da GPU, e não com `left/top`. Cada personagem fica na sua própria camada (`.lounge-walker` em `globals.css`). A respiração é uma leve escala vertical a partir da cintura (`ttt-breathe-scale` em `globals.css`), e não o `translateY` de 1,2px do handoff: um deslocamento tão pequeno se encaixa em pixels inteiros e parece rodar a 3 fps. As animações internas do SVG (pernas, braços, piscar) continuam no navegador, porque browsers não aceleram transforms de grupos SVG na GPU.
- **Banco compartilhado:** as rotas do Next e o Socket.IO abrem conexões próprias com o mesmo arquivo. O modo WAL torna isso seguro.

Estrutura de pastas:

```
server.ts                      HTTP + Socket.IO + Next
src/proxy.ts                   redireciona para / quem não tem sessão
src/app/                       páginas (/, /lobby, /room/[id], /avatar) e rotas /api/*
src/app/room/[id]/RoomScreen   tela da sala (painéis redimensionáveis, abas, modo cinema, menu de moderação)
src/components/room/           Player, Chat, Lounge, Panels (IA, fila, playlists, avaliação, comentários),
                               SettingsPanel, hooks useRoom e useStream
src/components/character/      Character.tsx (arte final do handoff) e catalog.ts (dados, usados também no servidor)
src/components/lounge/         Furniture.tsx (arte dos 16 móveis) e catalog.ts (catálogo, preços e regras de colocação)
src/components/Avatar.tsx      busto ou corpo do personagem para chat, navbar e listas
src/components/LoginIntro.tsx  intro animada com som depois do login
src/lib/avatar.ts              preços, validação, presets e regras de tokens
src/lib/lounge.ts              validação do layout do lounge, contagem de móveis e base da sala
src/lib/playerPrefs.ts         preferências do player de cada pessoa (salvas no navegador)
src/lib/profanity.ts           lista de palavrões e filtro (sem dependências de IA)
src/lib/moderation.ts          verificador com LangChain + Claude Haiku
src/server/                    db, auth, sessão, salas, LiveKit, limite de taxa, metadados
public/avatar/                 SVGs dos presets e miniaturas do editor
public/lounge/furniture/       SVGs dos móveis (miniaturas da loja)
tools/characters.js            fonte da arte dos personagens (gera Character.tsx e os SVGs); tools/generate.js é o gerador
tools/furniture.js             fonte da arte dos móveis; tools/generate-furniture.js gera Furniture.tsx e os SVGs
deploy/                        LiveKit (Docker), Nginx, systemd e o guia de deploy
```

---

## 5. Funcionalidades

| Área | Como funciona |
|---|---|
| **Layout** | Navbar de 100px e duas colunas redimensionáveis: palco (player e abas) à esquerda, chat à direita. No celular as colunas ficam empilhadas. Os tamanhos são lembrados por pessoa |
| **Player** | YouTube (IFrame API) e arquivos `.mp4`/`.webm`, sincronizados pelo relógio do servidor, com botão de ressincronizar e correção automática |
| **Fila** | Todos adicionam vídeos e ela avança sozinha. O dono reordena e remove; quem adicionou pode tirar o próprio vídeo |
| **Pular** | O dono e quem colocou o vídeo pulam na hora; os demais votam, e a maioria decide |
| **Notas da IA** | Classifica como música, vídeo ou filme: banda, integrantes e história; uma dissertação; ou crítica com nota de 0 a 10. A análise fica em cache por vídeo |
| **Avaliar** | Estrelas e crítica da comunidade, ao lado da nota da IA |
| **Comentários** | Comentários do YouTube (precisa de `YOUTUBE_API_KEY`) |
| **Playlists** | Por usuário: criar, adicionar o vídeo atual ou um link, mandar tudo para a fila |
| **Lounge** (sala social) | Lounge de cinema: clique para andar, as falas viram balões, e o dono decora a sala com móveis comprados com tokens ([detalhes](#lounge-do-cinema-e-mobília)) |
| **Sala profissional** | Sem lounge, tokens nem loja; participantes aparecem como lista de nomes |
| **Transmissão** | Tela (com áudio) ou câmera e microfone via LiveKit, com um transmissor por vez |
| **Configurações** (aba da sala) | Personagem (atalho para o editor), Vídeo & Player, e Filtro de Chat (editável só pelo dono) |
| **Preferências do player** | Tolerância de sincronia (1, 2 ou 4 s), volume padrão, iniciar no mudo e modo cinema, que esconde o chat. Há um botão de modo cinema acima do player |
| **Intro** | Logo animado com som sincronizado ao brilho das gravatas. Toca depois do login ou do cadastro, enquanto o lobby carrega por baixo |
| **Tema** | Paleta dourada e escura (mármore, carvão, couro, ouro), com alternância entre claro e escuro |

---

## 6. Sistema de personagens e loja

Os personagens vêm do handoff de design (`design_handoff_character_system`), na versão **v3** (formato do rosto, 11 presets, gestos de acenar e comemorar).

**Arte**
- [Character.tsx](src/components/character/Character.tsx) é o código de produção do handoff, sem mudanças na arte: SVG de corpo inteiro (viewBox `0 0 100 140`) com animação só em CSS.
  - Anda: o pé sobe, o corpo balança e os braços vão e voltam.
  - Fala: a boca abre e fecha e a cabeça acena.
  - Olha para a esquerda ou para a direita.
  - Acena e comemora (`emote="wave"` e `emote="cheer"`).
  - Respira e pisca quando está parado e respeita `prefers-reduced-motion`.
- Os dados (catálogo, presets e tipos) foram separados em [catalog.ts](src/components/character/catalog.ts). Assim o servidor consegue validar sem carregar código de React.
- O CSS dos personagens é carregado **uma vez** no layout raiz, e todo `<Character>` usa `withStyles={false}`.

**Catálogo**

| Grupo | Itens |
|---|---|
| Pele | 10: 7 tons naturais e 3 de fantasia (ciano, verde, lilás) |
| Formato do rosto | 5: redondo, oval, quadrado, coração, bochechuda |
| Cabelos | 13 |
| Blusas | 8 |
| Expressões | 7 |
| Maquiagem | 2, incluindo corpse paint |
| Acessórios | 15, no máximo um por grupo: topo, orelhas, rosto, boca, pescoço, lateral |
| Cores | 15 de cabelo e 16 de roupa |
| Presets | 11: Feminino A e B, Masculino A e B, Horror Punk, Alienígena, Rabugento Verde, Bruxa, Gatinha, Nerd, Rei |

**Editor `/avatar`**
- Palco com o personagem grande e em 48 px.
- Botões para testar Andar, Falar, Olhar, Acenar, Comemorar e Movimento reduzido.
- Presets e as abas Pele, Cabelo, Blusa, Calça e tênis, Rosto e Acessórios.
- Faixa "No chão do hub" com o personagem em tamanho real.
- A pessoa monta à vontade e paga só ao salvar: itens não comprados aparecem com cadeado e o botão vira "Comprar e salvar (N)".

**Preços** (em tokens; ajuste em `PRICES` de [src/lib/avatar.ts](src/lib/avatar.ts))

| Grátis | Pagos |
|---|---|
| Tons de pele naturais, todas as cores, cílios. Rosto redondo e oval. Cabelos: liso, black power, curto, cacheado, careca. Blusas: camiseta, moletom, listrada. Expressões: feliz, alegre, triste. Sem maquiagem | Pele de fantasia 40. Rosto quadrado, coração e bochechuda 10. Cabelos: coque, rabo de cavalo, chanel e maria-chiquinha 15; moicano e espetado 25; selvagem 30; devilock 40. Blusas: regata 10, camisa 20, bomber 30, robe 35, couro 40. Acessórios: flor 20, boné 20, chapéu de festa 25, gravata 25, óculos redondo 25, óculos escuro 30, bigode 30, cachecol 30, corrente 45, orelhas de gato 45, gorro de Natal 50, fone 60, chapéu de bruxa 60, antenas 70, coroa 120. Expressões: surpreso 10, piscadinha 15, convencido 15, bravo 15. Corpse paint 50 |

**Regras no servidor** (`POST /api/avatar`)
1. Valida cada campo contra o catálogo e recusa item inexistente com **400**.
2. Calcula quais itens pagos ainda não foram comprados.
3. Desconta os tokens numa única operação no banco (`UPDATE … WHERE tokens >= custo`), sem apagar tokens que chegaram ao mesmo tempo. Sem saldo, responde **402**.
- O que está equipado conta como comprado. Por isso quem ganha um preset com itens pagos não é cobrado.
- **Migração:** usuários do avatar antigo recebem um preset definido pelo id. Compras da loja antiga (coroa, boné, fone, óculos escuros, corrente, gravata, moicano, piscadinha) viram os itens equivalentes.


### Lounge do cinema e mobília

O cenário vem do handoff v4 (`Cinema Lounge`). Todos os móveis são SVGs independentes, recoloráveis por `--main` e `--accent`, com âncora na base central.

**Cena**
- Palco lógico de **640 × 420**, escalado para caber no painel (`Lounge.tsx`). Parede em y 0–104, chão abaixo.
- Posições de pessoas e móveis são do palco, então ficam iguais em qualquer tamanho de tela. A presença continua em porcentagem do palco.
- Ordem de desenho: tapete, parede, depois móveis e pessoas por `y` (quem está mais embaixo fica na frente). Os balões de fala ficam numa camada acima de tudo.
- Clicar em cima de um móvel manda a pessoa para o ponto livre mais próximo (pegada `foot` de cada móvel). O caminho em linha reta não desvia dos móveis.

**Quem decora**
- Só o **dono da sala** coloca, move e guarda móveis. Visitantes veem a sala decorada e podem comprar móveis para as salas que criarem.
- Cada peça comprada só pode estar em um lugar: o servidor soma o que o dono já colocou em todas as salas dele.
- Toda sala social nasce com a **base** (a tela, grátis, que não sai do inventário). Dá para remover e restaurar no painel.

**Catálogo** (preços em `FURNITURE`, em [src/components/lounge/catalog.ts](src/components/lounge/catalog.ts))

| Categoria | Itens (tokens) |
|---|---|
| Assentos | poltrona 40, sofá 90 |
| Lanchonete | pipoca 120, refri 110, bilheteria 150, mesinha 45 |
| Decoração | fliperama 130, planta 25, tapete 60, cordão 35, abajur 30, lixeira 15 |
| Parede | telão 300, pôster foguete 40, pôster clapete 40, neon 85 |

**Regras no servidor**
1. `POST /api/furniture` valida o id, confere o saldo e desconta o preço do catálogo numa única operação (`UPDATE … WHERE tokens >= preço`). Sem saldo, **402**.
2. O evento `furni:set` só vale para o dono, em sala social, com limite de taxa. O layout é validado por `sanitizeLayout` (ids, no máximo 60 peças, posição presa ao chão ou à parede, cor hex) e por `saveRoomLayout` (estoque do dono, contando as outras salas dele).
3. Peças da base só valem com o `uid` e o `id` originais, para ninguém criar móvel de graça.
4. Se o servidor recusa, ele reenvia o layout verdadeiro e a tela do dono volta ao estado certo.

**Arte e regeneração:** `tools/furniture.js` é a fonte e `tools/generate-furniture.js` gera `Furniture.tsx` e os SVGs. O CSS dos móveis (`FurnitureStyles`) é carregado uma vez no layout raiz.

---

## 7. Tokens e gamificação

- **Regra:** 1 token por minuto em sala social, **só para quem está ativo**:
  - aba visível;
  - pelo menos uma interação (clique, tecla, rolagem ou toque) nos últimos 30 min.

  A janela é longa de propósito, para não punir quem só está assistindo um vídeo comprido.
- **Como é medido:** o cliente manda um sinal `presence:active` a cada 30 s, apenas quando atende às duas condições. O servidor só paga quem mandou o sinal nos últimos 75 s.
- **Teto diário:** 240 tokens (4 h), controlado no banco pelas colunas `earned_day` e `earned_today`.
- **Salas profissionais:** não pagam tokens.
- **Onde ajustar:** `TOKENS_PER_MINUTE`, `DAILY_TOKEN_CAP` e `AFK_AFTER_MS` em [src/lib/avatar.ts](src/lib/avatar.ts).

---

## 8. Moderação e segurança

### Filtro do chat (no servidor)
- A **lista padrão** de palavrões vale sempre (em [src/lib/profanity.ts](src/lib/profanity.ts)).
- **Por sala**, o dono configura (em Configurações > Filtro de Chat):
  - palavras extras (até 200, cada uma com até 40 caracteres);
  - estilo de censura: `p***a` ou `[censurado]`;
  - liga/desliga das palavras extras.

  Tudo fica salvo na coluna `rooms.moderation`. Quem não é dono só vê as regras.
- **Verificador inteligente:** a pessoa testa uma frase sob demanda (LangChain + `claude-haiku-5-5`). Ele **não** roda em toda mensagem, porque cada verificação custa créditos.

### Ações do dono da sala
Ficam no menu que abre ao clicar numa pessoa em "Na sala":

| Ação | Efeito |
|---|---|
| Silenciar 5 min / 1 h | A pessoa recebe um aviso e as mensagens dela não chegam à sala |
| Liberar chat | Desfaz o silêncio |
| Remover da sala | A pessoa sai na hora e não consegue voltar por 10 min |

O dono não pode moderar a si mesmo. Silenciados e removidos ficam só na memória e são esquecidos num reinício.

### Limites de taxa
Definidos em [src/server/rateLimit.ts](src/server/rateLimit.ts):

| O quê | Limite |
|---|---|
| Login | 8 tentativas por conta e 30 por IP a cada 15 min (o contador zera após um login certo) |
| Cadastro | 5 por IP por hora (só em produção) |
| Chat | 8 mensagens a cada 10 s; quem passa recebe um aviso que só a própria pessoa vê |
| Fila | 10 vídeos por minuto |
| Notas da IA / verificador | 10 e 20 por minuto por usuário |
| Movimento no lounge / ações de moderação | 20 por segundo / 20 por minuto |
| Decorar o lounge / comprar móvel | 30 por 10 s / 30 por minuto |

Quem passa do limite na API recebe **429** com o cabeçalho `Retry-After`. O IP vem do Nginx (`X-Real-IP`).

### Outras proteções
- Toda rota da API, exceto login, cadastro e logout, exige sessão. Isso inclui `/api/moderate`, que antes era aberta.
- O Socket.IO valida o cookie de sessão na conexão.
- Senhas guardadas com hash. Sessões com token aleatório de 32 bytes, válidas por 30 dias.
- Só o transmissor da vez recebe um token do LiveKit com permissão para publicar.

---

## 9. Referência técnica

### Banco (SQLite, `data/ttt.db`)

| Tabela | Conteúdo |
|---|---|
| `users` | nome, hash da senha, `tokens`, `avatar` (JSON do personagem), `owned` (itens do personagem), `furniture` (inventário de móveis, JSON `{id: quantidade}`), `earned_day`, `earned_today` |
| `sessions` | token, usuário, validade |
| `rooms` | nome, modo (`social`/`professional`), dono, `moderation` (JSON) |
| `room_state` | fila, vídeo atual e chat de cada sala (JSON) |
| `room_layout` | móveis colocados no lounge de cada sala (JSON) |
| `playlists` / `playlist_items` | playlists por usuário |
| `analyses` | cache das notas da IA por vídeo |
| `ratings` | estrelas e crítica por vídeo e usuário |

As colunas novas são criadas automaticamente na inicialização, com `ALTER TABLE` quando faltam. Não há passo manual de migração.

### Rotas da API

| Rota | Método | Faz |
|---|---|---|
| `/api/auth/register` | POST | Cria a conta e inicia a sessão |
| `/api/auth/login` | POST | Entra |
| `/api/auth/logout` | POST | Sai |
| `/api/me` | GET | Usuário atual (tokens, personagem, itens) |
| `/api/avatar` | POST | Salva o personagem e compra os itens que faltam |
| `/api/furniture` | POST | Compra um móvel com tokens (preço do catálogo no servidor) |
| `/api/rooms` | GET / POST | Lista e cria salas |
| `/api/rooms/online` | GET | Pessoas online por sala (servido direto pelo `server.ts`) |
| `/api/playlists` | GET / POST | Playlists do usuário |
| `/api/analyze` | POST | Notas da IA de um vídeo (com cache) |
| `/api/ratings` | GET / POST | Avaliações da comunidade |
| `/api/comments` | GET | Comentários do YouTube |
| `/api/moderate` | POST | Verificador de mensagens |

### Eventos do Socket.IO

**Do cliente para o servidor**

| Evento | Faz |
|---|---|
| `room:join`, `room:leave` | Entra e sai da sala (recusa quem foi removido) |
| `chat:send` | Envia mensagem (filtro, silêncio e limite) |
| `queue:add`, `queue:remove`, `queue:move` | Mexe na fila |
| `player:duration`, `player:ended`, `player:skip` | Informa duração, fim e pedido de pular |
| `presence:move` | Anda no lounge |
| `furni:set` | Salva o layout do lounge (só o dono); o servidor valida tudo e responde com o total de peças em uso |
| `presence:active` | Sinal de atividade, para os tokens |
| `stream:start`, `stream:stop` | Pega e solta a vez de transmitir |
| `stream:token` | Pede o token do LiveKit |
| `mod:get`, `mod:set` | Lê e altera o filtro da sala (alterar: só o dono) |
| `mod:mute`, `mod:kick` | Silencia e remove (só o dono) |

**Do servidor para o cliente**

| Evento | Faz |
|---|---|
| `room:state` | Estado completo da sala ao entrar |
| `chat:message` | Nova mensagem |
| `queue:update` | Fila atualizada |
| `player:play`, `player:duration`, `player:skipVotes` | Mudanças no player |
| `presence:update`, `presence:move` | Quem está na sala e onde |
| `furni:update` | Layout do lounge mudou (ou o servidor desfez uma alteração recusada) |
| `stream:update` | Transmissão começou ou parou |
| `tokens:update` | Novo saldo |
| `room:kicked` | Aviso para quem foi removido |

---

## 10. Hospedagem, domínio e custos

### Onde roda
**Tudo na VPS (KVM2 da Hostinger).** O app inteiro e o LiveKit rodam lá. O passo a passo para o Claude da VPS está em [deploy/README.md](deploy/README.md):

1. Diagnóstico.
2. Swap de 4 GB.
3. Usuário e Node 24.
4. Código e `.env.local`.
5. Serviço systemd na porta 3100.
6. LiveKit via Docker.
7. Firewall.
8. Nginx e HTTPS.
9. Verificação.
10. Backups.

A VPS é **compartilhada** com outros sistemas: nunca pare, reinicie ou reconfigure serviços que não são deste projeto.

### Por que não a Vercel
- O LiveKit precisa de um processo sempre ligado e de portas UDP (50000–60000). Isso é impossível em serverless.
- O app usa um servidor próprio (`server.ts`) com Socket.IO e SQLite em disco.
- Separar as páginas na Vercel exigiria levar o banco para o Supabase, mover o Socket.IO para um subdomínio e refazer o login entre domínios: cerca de 3 a 5 dias de trabalho, com pouco ganho para o MVP.

### Domínio (exemplo com `techtietoys.com.br`)

| Registro | Tipo | Aponta para | Uso |
|---|---|---|---|
| `techtietoys.com.br` | A | IP da VPS | App (Nginx → porta 3100) |
| `www` | CNAME | domínio principal | Redireciona |
| `live` | A | IP da VPS | LiveKit (Nginx → 7880) e TURN |

- Se o DNS estiver na Cloudflare, o `live` precisa ficar como **"DNS only"** (nuvem cinza), porque o proxy dela não passa WebRTC.
- No app, use `LIVEKIT_URL=wss://live.<domínio>`.
- Portas a abrir no `ufw` **e** no painel da Hostinger: 7881/tcp, 3478/udp e 50000–60000/udp.

### Capacidade da KVM2 (avaliada para 50 usuários)

A máquina tem 2 vCPU, 7,8 GiB de RAM com cerca de 2,2 GiB livres e é dividida com outros sistemas.

| Uso | Cabe? |
|---|---|
| 50 pessoas assistindo, conversando e andando no lounge | Sim |
| Uma transmissão para 49 espectadores (cerca de 75 Mbit/s e 33 GB por hora) | Arriscado: a CPU já chega no limite nos picos |

**Plano B para a transmissão:** LiveKit Cloud, trocando só as três variáveis `LIVEKIT_*`. O plano Build é grátis e dá cerca de 1,5 h por mês para 50 pessoas. O Ship custa US$ 50 com cerca de 7 h de banda incluída; depois, cerca de US$ 4 por hora.

### Custos estimados (por mês)

| Item | Custo |
|---|---|
| VPS e Supabase | Já pagos |
| Notas da IA, sem filmes | Cerca de US$ 2–6 com OpenAI (GPT-5 mini ~US$ 5; nano ~US$ 1). Com Claude: Opus 5.5 ~US$ 55, Haiku 5.5 ~US$ 1,35. Hoje o código usa Claude Opus 5.5; trocar de provedor dá cerca de meio dia de trabalho |
| Hospedar filmes (100 títulos) | Mux ~US$ 30–130, Cloudflare Stream ~US$ 100–250, ou na própria VPS ~US$ 5 (mas pesado em CPU e banda) |
| Transmissão | US$ 0 na VPS, ou o plano B do LiveKit Cloud acima |

---

## 11. Convenções do projeto

Também estão no [CLAUDE.md](CLAUDE.md).

- **Interface:** Mantine 9; todo card é `Card`; layout com `Group`, `Stack` e `SimpleGrid`; sem Tailwind.
- **Ícones:** Lucide React. **Nunca** emojis, nem na interface nem nas mensagens do sistema.
- **Responsivo e redimensionável:** todo componente se adapta ao tamanho da tela; áreas grandes são redimensionáveis com `react-resizable-panels` v4.
- **Abas:** na sala existe **uma única seção de abas**, abaixo do vídeo.
- **Divisão de responsabilidades:** tempo real no Socket.IO (`src/server/rooms.ts`); áudio e vídeo ao vivo no LiveKit.
- **Dados:** regras de negócio (preços, catálogo, filtro) ficam em módulos sem React nem dependências pesadas, para o servidor e o cliente usarem os mesmos.
- **Next.js 16:** esta versão tem mudanças de API. Leia `node_modules/next/dist/docs/` antes de escrever código (ver [AGENTS.md](AGENTS.md)).

---

## 12. Histórico do que foi feito

### Fase 1: base do produto
- Projeto Next.js 16 criado com o servidor próprio (`server.ts`), Socket.IO e SQLite nativo.
- Login e cadastro com sessão em cookie; lobby; salas sociais e profissionais.
- Player sincronizado (YouTube e arquivos), fila coletiva, votação para pular, playlists.
- Notas da IA por tipo de vídeo (música, vídeo, filme), com saída estruturada do Claude e cache.
- Avaliações da comunidade e comentários do YouTube.
- Lounge estilo Habbo e tokens por minuto em salas sociais.

### Fase 2: documentação e custos
- Documento didático (Claude Doc) com as pendências do MVP, o LiveKit, a hospedagem e os maiores desafios.
- Avaliação da arquitetura sugerida (Supabase, Mux/Cloudflare Stream, R2 + MediaConvert) e dos custos com e sem filmes (seção 10).

### Fase 3: interface e infraestrutura
- Interface toda refeita com Mantine e Lucide; Tailwind removido.
- Layout redimensionável, uma única seção de abas abaixo do vídeo, versão para celular.
- Transmissão migrada de P2P para **LiveKit**, com token só para quem detém a vez.
- Avaliação da KVM2 para 50 usuários e pasta `deploy/` (LiveKit em Docker, Nginx, systemd, guia em 10 etapas).
- Respondido como fazer o deploy, por que não usar a Vercel e como organizar o domínio (seção 10).

### Fase 4: personagens e intro
- Sistema de personagens do handoff integrado em todo o app: lounge, chat, navbar, lista da sala e home.
- No lounge, o personagem anda em velocidade constante, fala enquanto o balão aparece e olha para o lado de onde veio.
- Editor `/avatar` com loja; servidor validando catálogo e saldo; migração dos usuários antigos.
- Intro animada movida da abertura do site para depois do login e do cadastro.
- Corrigidos no caminho: nomes que sumiam no lounge e usuários novos que eram cobrados pelo preset que receberam.

### Fase 5: personagens v3
- Atualização para o handoff v3: formato do rosto (5), 11 presets, 6 cabelos, 1 blusa, 8 acessórios e 3 peles de fantasia novos; gestos de acenar e comemorar no editor.
- Peles de fantasia, formatos de rosto e os itens novos entraram na loja com preço em `PRICES`; o servidor valida `face` e cobra `skin:*` como item pago.
- `tools/generate.js` e a arte (`public/avatar/`) atualizados.

### Fase 5: lounge do cinema e mobília (handoff v4)
- Cenário novo: parede de 104 px com tela, piso cinza com xadrez, palco fixo de 640 × 420 que escala para caber no painel (redimensionável).
- 16 móveis em SVG (assentos, lanchonete, decoração, parede), recoloríveis, com preço em tokens.
- Loja e inventário dentro da aba Lounge; modo **Decorar** para arrastar, espelhar, trocar a cor e guardar.
- Layout salvo por sala no banco e sincronizado em tempo real; servidor valida dono, estoque, posição e cor.
- Personagens passam atrás ou na frente dos móveis conforme a posição vertical; balões ficam sempre por cima.

### Fase 5: revisão do MVP
1. **Segurança:**
   - `/api/moderate` passou a exigir login e mudou de `claude-3-5-haiku-latest`, que foi aposentado, para `claude-haiku-5-5`;
   - limites de taxa em login, cadastro, chat, fila, IA, lounge e moderação.
2. **Tokens justos:** só para quem está ativo, com teto de 240 por dia.
3. **Moderação da sala:** filtro por sala salvo no servidor; o dono pode silenciar e remover.
4. **Configurações:**
   - o Player passou a usar as preferências (sincronia automática, volume, mudo, modo cinema);
   - a opção "Qualidade preferida" foi removida, porque o YouTube ignora esse pedido;
   - o editor de personagem ficou num lugar só;
   - o verificador perdeu o histórico com dados inventados.
5. **Persistência:** fila, vídeo atual e chat salvos no SQLite e restaurados depois de reinícios.
- A lista de palavras foi separada do código de IA, para o navegador não carregar a LangChain.

Cada fase foi verificada com TypeScript, ESLint e testes no navegador (Playwright com Edge).

---

## 13. Pendências e próximos passos

| # | Item | Situação |
|---|---|---|
| 1 | **Deploy na VPS** (app + LiveKit + domínio) | Aguardando o domínio e a forma de enviar o código para a VPS (o repositório ainda não tem remoto) |
| 2 | TURN/TLS na porta 5349, para redes corporativas | Desligado; ligar depois do deploy |
| 3 | IA mais precisa: mandar descrição e transcrição do vídeo | Opcional |
| 4 | Moderação automática por IA em toda mensagem | Opcional; tem custo por mensagem |
| 5 | Guardar silenciados e removidos no banco | Hoje se perdem num reinício |
| 6 | Escalar para mais de um processo (Redis + adapter do Socket.IO) | Só se o tráfego pedir |
| 7 | Usar o Supabase que já está pago (autenticação e banco) | As variáveis existem no `.env.example`; o código ainda não usa |

---

## 14. Limitações conhecidas

- **IA:** recebe só o **título e o canal** do vídeo, sem assistir. Ela foi instruída a não inventar quando não reconhece o conteúdo.
- **Estado em memória:** silenciados, removidos e limites de taxa vivem só na memória de um processo. Fila, vídeo atual e chat são salvos com atraso de até 1 s, então um desligamento abrupto pode perder o último segundo.
- **Transmissão para muita gente:** uma transmissão para a sala toda pesa na KVM2 compartilhada (ver seção 10).
- **Preferências do player:** são de cada pessoa e ficam no navegador; não acompanham a conta entre dispositivos.
