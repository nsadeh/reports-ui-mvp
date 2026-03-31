import fs from "fs";
import path from "path";

const BASE_CORPUS_DIR = path.join(process.cwd(), "data", "corpus");

function getCorpusDir(reportDirName: string): string {
  const scoped = path.join(BASE_CORPUS_DIR, reportDirName);
  // Fall back to flat corpus root if no scoped subfolder exists or it's empty
  if (fs.existsSync(scoped) && fs.readdirSync(scoped).some((f) => f.endsWith(".txt"))) {
    return scoped;
  }
  return BASE_CORPUS_DIR;
}

function getCorpusFiles(reportDirName: string): string[] {
  const dir = getCorpusDir(reportDirName);
  return fs.readdirSync(dir).filter((f) => f.endsWith(".txt")).sort();
}

export function listDocuments(reportDirName: string): string {
  return getCorpusFiles(reportDirName).join("\n");
}

export function searchCorpus(query: string, reportDirName: string, maxChunks = 6): string {
  const dir = getCorpusDir(reportDirName);
  const files = getCorpusFiles(reportDirName);
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);

  const results: { score: number; text: string; source: string }[] = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), "utf-8");
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

export function getDocument(filename: string, reportDirName: string): string {
  const safe = path.basename(filename);
  const filePath = path.join(getCorpusDir(reportDirName), safe);
  if (!fs.existsSync(filePath)) {
    return `Document not found: ${filename}. Available documents:\n${getCorpusFiles(reportDirName).join("\n")}`;
  }
  return fs.readFileSync(filePath, "utf-8");
}
