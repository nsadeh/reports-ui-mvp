import { getReportMeta, getReportContent, getReportDirName } from "@/lib/reports";
import { notFound } from "next/navigation";

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

  return (
    <div className="flex h-screen">
      {/* Report Body */}
      <div className="flex-1 overflow-y-auto p-8 max-w-4xl">
        {/* Metadata Bar */}
        <div className="mb-8 pb-4 border-b border-border">
          <h1 className="text-2xl font-semibold text-dark mb-2">
            {meta.title}
          </h1>
          <div className="flex items-center gap-3 flex-wrap text-sm">
            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-sage/30 text-body rounded capitalize">
              {meta.scope_type.replace("_", " ")}
            </span>
            <span
              className={`inline-block px-2 py-0.5 text-xs font-medium rounded capitalize ${
                meta.report_type === "scheduled"
                  ? "bg-accent/10 text-accent"
                  : "bg-lime/30 text-dark"
              }`}
            >
              {meta.report_type}
            </span>
            <span className="text-muted">
              Delivered {meta.delivery_date}
            </span>
            <span className="text-muted">|</span>
            <span className="text-body">
              {meta.analyst.name}, {meta.analyst.credentials}
            </span>
          </div>
        </div>

        {/* Report Content (plain markdown rendered as pre-formatted for now) */}
        <article className="prose prose-lg max-w-none text-body leading-relaxed">
          {content ? (
            <div
              className="whitespace-pre-wrap font-sans"
              style={{ lineHeight: "1.7" }}
            >
              {content}
            </div>
          ) : (
            <p className="text-muted italic">
              Report content will be loaded here. Add content.mdx to the report
              data directory.
            </p>
          )}
        </article>
      </div>

      {/* Q&A Chat Panel Placeholder */}
      <div className="w-96 border-l border-border bg-white flex flex-col">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-dark">Ask a Question</h3>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="bg-bg2 border-l-3 border-accent p-3 rounded text-sm text-body">
            Ask me anything about this report. I can drill into specific drugs,
            payers, indications, or explain the methodology behind any finding.
          </div>
        </div>
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your question..."
              className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-bg focus:outline-none focus:border-accent"
              disabled
            />
            <button
              className="px-4 py-2 bg-accent text-white text-sm rounded-md opacity-50 cursor-not-allowed"
              disabled
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
