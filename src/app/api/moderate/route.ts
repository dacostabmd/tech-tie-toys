import { NextResponse } from "next/server";
import { moderateWithLangChain, filterProfanity } from "@/lib/moderation";
import { LIMITS, hit, tooMany } from "@/server/rateLimit";
import { currentUser, unauthorized } from "@/server/session";

export async function POST(req: Request) {
  // Logged-in users only, and rate limited: every call with the AI engine costs API credits.
  const me = await currentUser();
  if (!me) return unauthorized();
  const limit = hit(`moderate:${me.id}`, LIMITS.moderatePerUser);
  if (!limit.ok) return tooMany(limit.retryAfterS);

  try {
    const body = await req.json();
    const text = String(body.text ?? "").trim().slice(0, 1000);
    const customWords = Array.isArray(body.customWords) ? body.customWords : [];
    const useLangChain = body.useLangChain !== false;

    if (!text) {
      return NextResponse.json({ error: "Texto vazio" }, { status: 400 });
    }

    if (!useLangChain) {
      const quick = filterProfanity(text, customWords);
      return NextResponse.json({
        flagged: quick.hasProfanity,
        toxicityScore: quick.hasProfanity ? 0.8 : 0.0,
        category: quick.hasProfanity ? "profanity" : "clean",
        reason: quick.hasProfanity
          ? `Palavras detectadas: ${quick.found.join(", ")}`
          : "Nenhuma palavra ofensiva encontrada.",
        sanitizedText: quick.cleanText,
        matchedWords: quick.found,
        engine: "lexical",
      });
    }

    const result = await moderateWithLangChain(text, customWords);
    return NextResponse.json({
      ...result,
      engine: "langchain-anthropic",
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Falha na moderação" },
      { status: 500 }
    );
  }
}
