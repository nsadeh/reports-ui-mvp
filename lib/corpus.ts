import fs from "fs";
import path from "path";

const CORPUS_DIR = path.join(process.cwd(), "data", "corpus");

function getCorpusFiles(): string[] {
  return fs.readdirSync(CORPUS_DIR).filter((f) => f.endsWith(".txt")).sort();
}

export function listDocuments(): string {
  return getCorpusFiles().join("\n");
}

export function searchCorpus(query: string, maxChunks = 6): string {
  const files = getCorpusFiles();
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);

  const results: { score: number; text: string; source: string }[] = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(CORPUS_DIR, file), "utf-8");
    const paragraphs = content
      .split(/\n\n+/)
      .filter((p) => p.trim().length > 80);

    for (const paragraph of paragraphs) {
      const lower = paragraph.toLowerCase();
      const score = queryWords.filter((w) => lower.includes(w)).length;
      if (score > 0) {
        results.push({ score, text: paragraph.trim(), source: file });
      }
    }
  }

  results.sort((a, b) => b.score - a.score);
  const top = results.slice(0, maxChunks);

  if (top.length === 0) return "No relevant content found for that query.";

  return top
    .map((r) => `[Source: ${r.source}]\n${r.text}`)
    .join("\n\n---\n\n");
}

export function getDocument(filename: string): string {
  const safe = path.basename(filename);
  const filePath = path.join(CORPUS_DIR, safe);
  if (!fs.existsSync(filePath)) {
    return `Document not found: ${filename}. Available documents:\n${getCorpusFiles().join("\n")}`;
  }
  return fs.readFileSync(filePath, "utf-8");
}
