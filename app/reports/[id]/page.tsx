import { getReportMeta, getReportContent, getReportDirName, getReportEvents, getReportDrugs, getReportSources } from "@/lib/reports";
import { notFound } from "next/navigation";
import ReportPageClient from "@/components/report/ReportPageClient";
import type { RegulatoryEvent } from "@/components/report/RegulatoryTimeline";
import type { DrugEntry } from "@/components/report/DrugSubmissionList";
import type { SourceEntry } from "@/lib/types";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meta = getReportMeta(id);
  if (!meta) return notFound();

  const dirName = getReportDirName(id);
  const content = dirName ? getReportContent(dirName) : "";
  const events = dirName ? (getReportEvents(dirName) as RegulatoryEvent[] | null) : null;
  const drugs = dirName ? (getReportDrugs(dirName) as DrugEntry[] | null) : null;
  const sources = dirName ? (getReportSources(dirName) as SourceEntry[] | null) : null;

  return <ReportPageClient meta={meta} content={content} events={events} drugs={drugs} sources={sources} />;
}
