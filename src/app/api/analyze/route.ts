import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import type { Analysis, MediaKind } from "@/lib/types";
import { db } from "@/server/db";
import { currentUser, json, unauthorized } from "@/server/session";
import { LIMITS, hit, tooMany } from "@/server/rateLimit";

const AnalysisSchema = z.object({
  kind: z.enum(["music", "video", "movie"]),
  headline: z.string(),
  summary: z.string(),
  sections: z.array(z.object({ title: z.string(), body: z.string() })),
  facts: z.array(z.string()),
  tags: z.array(z.string()),
  rating: z.object({ score: z.number(), verdict: z.string() }).nullable(),
});

const SYSTEM = `Você é o curador de IA do Tech Tie Toys, uma sala onde pessoas assistem vídeos juntas.
Você recebe apenas metadados (título, canal/autor, link) — não assiste ao vídeo. Escreva em português do Brasil.

Primeiro classifique o conteúdo (a menos que o tipo já venha definido):
- "music": clipe, faixa, show ou álbum. Fale do artista/banda: integrantes (atuais e marcantes), origem, história,
  fases, o contexto desta música e curiosidades. Seções sugeridas: "O artista", "Integrantes", "História", "Sobre esta faixa".
- "movie": filme, trailer ou longa. Faça sinopse sem spoilers, ficha (direção, elenco, ano), contexto e uma crítica.
  Preencha "rating" com nota de 0 a 10 e um veredito curto.
- "video": qualquer outro vídeo. Escreva uma dissertação sobre o tema provável: contexto, pontos principais,
  por que é relevante e o que observar.

Regras: use só o que você sabe com segurança; quando não reconhecer o conteúdo, diga isso no summary e
mantenha as seções genéricas em vez de inventar nomes, datas ou números. "rating" é null para music e video.
"facts" traz 3–6 curiosidades curtas; "tags" traz 3–6 palavras-chave.`;

let client: Anthropic | null = null;

export async function POST(req: Request) {
  const me = await currentUser();
  if (!me) return unauthorized();
  const limit = hit(`analyze:${me.id}`, LIMITS.analyzePerUser);
  if (!limit.ok) return tooMany(limit.retryAfterS);
  const body = (await req.json().catch(() => ({}))) as {
    key?: string;
    title?: string;
    author?: string;
    url?: string;
    kind?: MediaKind;
  };
  if (!body.key || !body.title) return json({ error: "key e title obrigatórios" }, 400);

  const cached = db.prepare("SELECT data FROM analyses WHERE media_key = ?").get(body.key) as
    | { data: string }
    | undefined;
  if (cached) return json(JSON.parse(cached.data) as Analysis);

  const kindHint =
    body.kind && body.kind !== "auto" ? `Tipo definido pelo usuário: ${body.kind}` : "Tipo: classifique você.";

  try {
    client ??= new Anthropic();
    const response = await client.beta.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium", format: betaZodOutputFormat(AnalysisSchema) },
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Título: ${body.title}\nCanal/autor: ${body.author || "desconhecido"}\nLink: ${body.url ?? ""}\n${kindHint}`,
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      return json({ error: "A IA não pôde analisar este conteúdo." }, 422);
    }
    const analysis = response.parsed_output;
    if (!analysis) {
      console.warn("[analyze] resposta sem parsed_output; stop_reason:", response.stop_reason);
      return json({ error: "A IA retornou um formato inesperado." }, 502);
    }
    db.prepare("INSERT OR REPLACE INTO analyses (media_key, data) VALUES (?, ?)").run(body.key, JSON.stringify(analysis));
    return json(analysis satisfies Analysis);
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return json({ error: "IA ocupada, tente em instantes." }, 429);
    if (err instanceof Anthropic.AuthenticationError) return json({ error: "Chave da Anthropic inválida." }, 503);
    if (err instanceof Anthropic.APIError) {
      console.error("[analyze]", err.status, err.message);
      return json({ error: "Falha ao consultar a IA." }, 502);
    }
    // No credentials resolved (no ANTHROPIC_API_KEY, token or profile).
    if (err instanceof Error && /authentication method/i.test(err.message)) {
      console.warn("[analyze]", err.message);
      return json({ error: "IA desativada: defina ANTHROPIC_API_KEY no .env.local" }, 503);
    }
    throw err;
  }
}
