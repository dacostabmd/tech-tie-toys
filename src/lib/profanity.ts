// Word filter and shared types, with no AI dependencies (safe to import in the browser).

// Lista base de termos ofensivos comuns (PT-BR e EN)
export const DEFAULT_PROFANITY_LIST = [
  "porra",
  "caralho",
  "puta",
  "merda",
  "foder",
  "foda",
  "fodasse",
  "foda-se",
  "arrombado",
  "filho da puta",
  "otario",
  "otária",
  "otário",
  "viado",
  "bicha",
  "cu",
  "cuzão",
  "buceta",
  "cacete",
  "bosta",
  "desgraça",
  "imbecil",
  "idiota",
  "babaca",
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "bastard",
];

export interface ModerationResult {
  flagged: boolean;
  toxicityScore: number; // 0 a 1
  category: "clean" | "profanity" | "harassment" | "hate_speech" | "spam";
  reason: string;
  sanitizedText: string;
  matchedWords: string[];
}

/**
 * Filtro léxico rápido por regex para censura instantânea
 */
export function filterProfanity(
  text: string,
  customWords: string[] = [],
  maskType: "asterisk" | "censor" = "asterisk",
): { cleanText: string; hasProfanity: boolean; found: string[] } {
  const allWords = [...new Set([...DEFAULT_PROFANITY_LIST, ...customWords.map((w) => w.toLowerCase().trim())])];
  let cleanText = text;
  const found: string[] = [];

  for (const word of allWords) {
    if (!word) continue;
    // Escapa caracteres especiais de regex
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");

    if (regex.test(cleanText)) {
      found.push(word);
      cleanText = cleanText.replace(regex, (match) => {
        if (maskType === "censor") return "[censurado]";
        if (match.length <= 2) return "*".repeat(match.length);
        return match[0] + "*".repeat(match.length - 2) + match[match.length - 1];
      });
    }
  }

  return {
    cleanText,
    hasProfanity: found.length > 0,
    found,
  };
}
