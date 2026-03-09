import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import type { UIMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { getReportContentRaw, getReportDirName } from "@/lib/reports";
import { getCorpusText } from "@/lib/corpus";
import type { QAFallbackPair } from "@/lib/types";
import fs from "fs";
import path from "path";

const SYSTEM_PROMPT_PREFIX = `You are an analyst at Inflection Labs specializing in market access intelligence for the TNF-alpha target area. You have access to the full report and all underlying source documents.

Answer questions about the report, its findings, the competitive landscape, payer formularies, clinical thresholds, and biosimilar dynamics. Reference specific data from the sources when relevant. If a question is outside the scope of TNF-alpha market access, politely redirect the user.

`;

function buildSystemMessages(reportId: string) {
  const reportContent = getReportContentRaw(reportId);
  const corpus = getCorpusText();

  return [
    {
      role: "system" as const,
      content:
        SYSTEM_PROMPT_PREFIX +
        `=== REPORT ===\n${reportContent}\n\n=== SOURCE DOCUMENTS ===\n${corpus}`,
      providerOptions: {
        anthropic: {
          cacheControl: { type: "ephemeral" },
        },
      },
    },
  ];
}

function loadFallbackPairs(reportId: string): QAFallbackPair[] {
  const dirName = getReportDirName(reportId);
  if (!dirName) return [];
  const filePath = path.join(
    process.cwd(),
    "data",
    "reports",
    dirName,
    "qa-fallback.json"
  );
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function findFallbackAnswer(
  question: string,
  pairs: QAFallbackPair[]
): string | null {
  const q = question.toLowerCase();
  let bestMatch: QAFallbackPair | null = null;
  let bestScore = 0;

  for (const pair of pairs) {
    const score = pair.keywords.filter((kw) =>
      q.includes(kw.toLowerCase())
    ).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = pair;
    }
  }

  return bestScore >= 2 ? bestMatch!.answer : null;
}

function extractUserText(messages: UIMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return "";
  const textPart = lastUser.parts.find((p) => p.type === "text");
  return textPart && "text" in textPart ? textPart.text : "";
}

export async function POST(req: Request) {
  const body = await req.json();
  const messages: UIMessage[] = body.messages;
  const reportId: string =
    body.reportId || "tnf-alpha-landscape-2026-03-10";

  // Fallback mode when no API key is set
  if (!process.env.ANTHROPIC_API_KEY) {
    const pairs = loadFallbackPairs(reportId);
    const userText = extractUserText(messages);
    const answer =
      findFallbackAnswer(userText, pairs) ||
      "I can answer questions about the TNF-alpha market access landscape covered in this report. Try asking about payer formularies, biosimilar dynamics, or clinical thresholds.";

    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        writer.write({ type: "text-start", id: "fallback" });
        writer.write({ type: "text-delta", delta: answer, id: "fallback" });
        writer.write({ type: "text-end", id: "fallback" });
        writer.write({ type: "finish", finishReason: "stop" });
      },
    });

    return createUIMessageStreamResponse({ stream });
  }

  const system = buildSystemMessages(reportId);
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
