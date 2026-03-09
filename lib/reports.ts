import fs from "fs";
import path from "path";
import type { ReportMeta, DashboardData } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

export function getDashboardData(): DashboardData {
  const raw = fs.readFileSync(path.join(DATA_DIR, "dashboard.json"), "utf-8");
  return JSON.parse(raw);
}

export function getAllReportMetas(): ReportMeta[] {
  const reportsDir = path.join(DATA_DIR, "reports");
  const dirs = fs.readdirSync(reportsDir);
  return dirs
    .map((dir) => {
      const metaPath = path.join(reportsDir, dir, "meta.json");
      if (!fs.existsSync(metaPath)) return null;
      const raw = fs.readFileSync(metaPath, "utf-8");
      return JSON.parse(raw) as ReportMeta;
    })
    .filter(Boolean) as ReportMeta[];
}

export function getReportMeta(id: string): ReportMeta | null {
  const reportsDir = path.join(DATA_DIR, "reports");
  const dirs = fs.readdirSync(reportsDir);
  for (const dir of dirs) {
    const metaPath = path.join(reportsDir, dir, "meta.json");
    if (!fs.existsSync(metaPath)) continue;
    const raw = fs.readFileSync(metaPath, "utf-8");
    const meta = JSON.parse(raw) as ReportMeta;
    if (meta.id === id || dir === id) return meta;
  }
  return null;
}

export function getReportContent(dirName: string): string {
  const contentPath = path.join(
    DATA_DIR,
    "reports",
    dirName,
    "content.mdx"
  );
  if (!fs.existsSync(contentPath)) return "";
  return fs.readFileSync(contentPath, "utf-8");
}

export function getReportDirName(id: string): string | null {
  const reportsDir = path.join(DATA_DIR, "reports");
  const dirs = fs.readdirSync(reportsDir);
  for (const dir of dirs) {
    if (dir === id) return dir;
    const metaPath = path.join(reportsDir, dir, "meta.json");
    if (!fs.existsSync(metaPath)) continue;
    const raw = fs.readFileSync(metaPath, "utf-8");
    const meta = JSON.parse(raw) as ReportMeta;
    if (meta.id === id) return dir;
  }
  return null;
}
