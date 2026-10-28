import { ChatAnthropic } from "@langchain/anthropic";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { filterProfanity, type ModerationResult } from "./profanity";

export { DEFAULT_PROFANITY_LIST, filterProfanity, type ModerationResult } from "./profanity";

let llm: ChatAnthropic | null = null;

function getLlm() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  if (!llm) {
    llm = new ChatAnthropic({
      apiKey,
      model: "claude-haiku-5-5",
      maxTokens: 300,
    });
  }
  return llm;
}

/**
 * Moderação semântica inteligente usando LangChain
 */
export async function moderateWithLangChain(
  text: string,
  customWords: string[] = [],
): Promise<ModerationResult> {
  // 1. Checagem rápida léxica inicial
  const quick = filterProfanity(text, customWords);

  const model = getLlm();

  // Se não houver LLM configurada, responde com base no filtro léxico
  if (!model) {
    return {
      flagged: quick.hasProfanity,
      toxicityScore: quick.hasProfanity ? 0.8 : 0.05,
      category: quick.hasProfanity ? "profanity" : "clean",
      reason: quick.hasProfanity
        ? `Palavra(s) ofensiva(s) detectada(s): ${quick.found.join(", ")}`
        : "Nenhuma linguagem inadequada detectada (modo léxico).",
      sanitizedText: quick.cleanText,
      matchedWords: quick.found,
    };
  }

  try {
    const template = `Você é um moderador de chat em tempo real de uma plataforma social.
Analise a mensagem a seguir e retorne ESTRITAMENTE um objeto JSON válido (sem tags markdown nem explicações).

Mensagem: "{message}"

Critérios:
- Se houver linguagem imprópria, assédio, ódio, ofensas graves ou palavras sujas veladas, defina flagged = true e atribua uma pontuação de toxicidade entre 0.0 e 1.0.
- Caso contrário, flagged = false e pontuação baixa (abaixo de 0.2).
- Em sanitizedText, substitua termos ofensivos por asteriscos (ex: p***).

Formato JSON esperado:
{{
  "flagged": boolean,
  "toxicityScore": number,
  "category": "clean" | "profanity" | "harassment" | "hate_speech" | "spam",
  "reason": "breve justificativa em português",
  "sanitizedText": "texto com termos ofensivos censurados"
}}`;

    const prompt = PromptTemplate.fromTemplate(template);
    const parser = new StringOutputParser();
    const chain = prompt.pipe(model).pipe(parser);

    const raw = await chain.invoke({ message: text });
    const cleanJson = raw.trim().replace(/^```json/, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(cleanJson);

    return {
      flagged: Boolean(parsed.flagged || quick.hasProfanity),
      toxicityScore: typeof parsed.toxicityScore === "number" ? parsed.toxicityScore : (quick.hasProfanity ? 0.7 : 0.1),
      category: parsed.category || (quick.hasProfanity ? "profanity" : "clean"),
      reason: parsed.reason || (quick.hasProfanity ? `Termos: ${quick.found.join(", ")}` : "Aprovado"),
      sanitizedText: parsed.sanitizedText || quick.cleanText,
      matchedWords: quick.found,
    };
  } catch {
    // Fallback gracioso se a chamada de IA falhar
    return {
      flagged: quick.hasProfanity,
      toxicityScore: quick.hasProfanity ? 0.75 : 0.1,
      category: quick.hasProfanity ? "profanity" : "clean",
      reason: quick.hasProfanity
        ? `Palavra(s) ofensiva(s) detectada(s): ${quick.found.join(", ")}`
        : "Mensagem verificada.",
      sanitizedText: quick.cleanText,
      matchedWords: quick.found,
    };
  }
}
