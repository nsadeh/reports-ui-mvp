import { getReportMeta, getReportContent, getReportDirName } from "@/lib/reports";
import { notFound } from "next/navigation";
import ReportPageClient from "@/components/report/ReportPageClient";

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

  return <ReportPageClient meta={meta} content={content} />;
}
