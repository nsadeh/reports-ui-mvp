import { getReportMeta, getReportContent, getReportDirName, getReportEvents, getReportDrugs } from "@/lib/reports";
import { notFound } from "next/navigation";
import ReportPageClient from "@/components/report/ReportPageClient";
import type { RegulatoryEvent } from "@/components/report/RegulatoryTimeline";
import type { DrugEntry } from "@/components/report/DrugSubmissionList";

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

  return <ReportPageClient meta={meta} content={content} events={events} drugs={drugs} />;
}
