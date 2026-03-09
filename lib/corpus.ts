import fs from "fs";
import path from "path";

const CORPUS_DIR = path.join(process.cwd(), "data", "corpus");

let _cached: string | null = null;

export function getCorpusText(): string {
  if (_cached) return _cached;

  const files = fs
    .readdirSync(CORPUS_DIR)
    .filter((f) => f.endsWith(".txt"))
    .sort();

  _cached = files
    .map((file) => {
      const content = fs.readFileSync(path.join(CORPUS_DIR, file), "utf-8");
      return `--- ${file} ---\n${content}`;
    })
    .join("\n\n");

  return _cached;
}
