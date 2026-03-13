import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  tool,
  stepCountIs,
} from "ai";
import type { UIMessage } from "ai";
import { z } from "zod";
import { anthropic } from "@ai-sdk/anthropic";
import { getReportContentRaw, getReportDirName } from "@/lib/reports";
import { searchCorpus, getDocument, listDocuments } from "@/lib/corpus";
import type { QAFallbackPair } from "@/lib/types";
import fs from "fs";
import path from "path";

const SYSTEM_PROMPT_PREFIX = `You are an analyst at Inflection Labs specializing in market access intelligence for the TNF-alpha target area. You have access to the full report below.

IMPORTANT — tool use rules:
1. Always attempt to answer from the report content first. The report is already in your context; read it before considering any tool call.
2. Only call a tool if the report genuinely lacks the detail needed to answer the question (e.g. the user asks for full methodology, raw statistical tables, or direct quotes from a source paper).
3. Make at most ONE tool call per response. Use search_corpus with a precise query. Do not call list_documents or get_document unless search_corpus returns nothing useful.
4. If the report contains sufficient information to answer — even partially — respond from it directly without using any tools.

Answer questions about the report, its findings, the competitive landscape, clinical thresholds, and biosimilar dynamics. If a question is outside the scope of TNF-alpha market access, politely redirect the user.

`;

function buildSystemPrompt(reportId: string): string {
  const reportContent = getReportContentRaw(reportId);
  return SYSTEM_PROMPT_PREFIX + `=== REPORT ===\n${reportContent}`;
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

  const systemPrompt = buildSystemPrompt(reportId);
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: systemPrompt,
    messages: modelMessages,
    stopWhen: stepCountIs(2),
    tools: {
      search_corpus: tool<{ query: string }, string>({
        description:
          "Search the underlying source documents for specific data, methodology details, statistics, or quotes. Use this when the report summary does not contain enough detail to answer the question.",
        inputSchema: z.object({
          query: z
            .string()
            .describe(
              "A natural language search query describing what to look for in the source documents."
            ),
        }),
        execute: async ({ query }) => searchCorpus(query),
      }),
      get_document: tool<{ filename: string }, string>({
        description:
          "Retrieve the full text of a specific source document by filename. Use list_documents first if you are unsure of the exact filename.",
        inputSchema: z.object({
          filename: z
            .string()
            .describe(
              "The exact filename of the source document (e.g. PMID_41077357.txt)."
            ),
        }),
        execute: async ({ filename }) => getDocument(filename),
      }),
      list_documents: tool<Record<string, never>, string>({
        description:
          "List all available source documents in the corpus. Use this to discover what documents are available before calling get_document.",
        inputSchema: z.object({}),
        execute: async () => listDocuments(),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
