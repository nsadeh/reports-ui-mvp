"use client";

import { useState, useRef } from "react";
import { ReportMarkdown } from "@/components/report/Markdown";
import ChatPanel from "@/components/chat/ChatPanel";
import AnalystSignature from "@/components/report/AnalystSignature";
import SelectionToolbar from "@/components/report/SelectionToolbar";
import RegulatoryTimeline from "@/components/report/RegulatoryTimeline";
import type { RegulatoryEvent } from "@/components/report/RegulatoryTimeline";
import DrugSubmissionList from "@/components/report/DrugSubmissionList";
import type { DrugEntry } from "@/components/report/DrugSubmissionList";
import GanttChart from "@/components/report/GanttChart";
import SourcesList from "@/components/report/SourcesList";
import PdacPeakSalesReport from "@/components/report/PdacPeakSalesReport";
import TrialIndicationMappingPdac from "@/components/report/TrialIndicationMappingPdac";
import type { ReportMeta, SourceEntry } from "@/lib/types";

const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
  scheduled:      { label: "Pipeline",   cls: "bg-blue-100 text-blue-700" },
  Pipeline:       { label: "Pipeline",   cls: "bg-blue-100 text-blue-700" },
  "market-model":       { label: "Rev Model",  cls: "bg-rose-100 text-rose-700" },
  "indication-mapping": { label: "Ind. Map",   cls: "bg-teal-100 text-teal-700" },
  Event:          { label: "Event",      cls: "bg-amber-100 text-amber-700" },
  Monitoring:     { label: "Monitoring", cls: "bg-lime/30 text-dark" },
  Regulatory:     { label: "Regulatory", cls: "bg-violet-100 text-violet-700" },
  custom:         { label: "Custom",     cls: "bg-gray-100 text-gray-600" },
};

export default function ReportPageClient({
  meta,
  content,
  events,
  drugs,
  sources,
}: {
  meta: ReportMeta;
  content: string;
  events?: RegulatoryEvent[] | null;
  drugs?: DrugEntry[] | null;
  sources?: SourceEntry[] | null;
}) {
  const [quotedText, setQuotedText] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-screen">
      {/* Report Body */}
      <div ref={reportRef} className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl">
          {/* Verified badge */}
          <div className="mb-6 flex items-center gap-2 px-4 py-2.5 bg-bg2 border border-border rounded-md w-fit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent shrink-0">
              <path
                d="M9 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <span className="text-[11px] text-muted">
              Verified by Inflection Labs · {meta.analyst.name}{meta.analyst.credentials ? `, ${meta.analyst.credentials}` : ""} · Delivered {meta.delivery_date}
            </span>
          </div>

          {/* Metadata Bar */}
          <div className="mb-8 pb-4 border-b border-border">
            <h1 className="text-2xl font-semibold text-dark mb-1">
              {meta.title}
            </h1>
            {meta.subtitle && (
              <p className="text-sm text-muted mb-2">{meta.subtitle}</p>
            )}
            <div className="flex items-center gap-3 flex-wrap text-sm">
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-sage/30 text-body rounded">
                {meta.scope_value}
              </span>
              {(() => {
                const { label, cls } = TYPE_BADGE[meta.report_type] ?? { label: meta.report_type, cls: "bg-gray-100 text-gray-600" };
                return (
                  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded whitespace-nowrap ${cls}`}>
                    {label}
                  </span>
                );
              })()}
              <span className="text-muted">
                Delivered {meta.delivery_date}
              </span>
              <span className="text-muted">|</span>
              <span className="text-body">
                {meta.analyst.name}{meta.analyst.credentials ? `, ${meta.analyst.credentials}` : ""}
              </span>
            </div>
          </div>

          {/* Report Content */}
          {meta.report_type === "Regulatory" && events ? (
            <>
              {content && <ReportMarkdown content={content} />}
              <RegulatoryTimeline events={events} />
              <SourcesList sources={sources ?? []} />
              <AnalystSignature analyst={meta.analyst} date={meta.delivery_date} />
            </>
          ) : meta.report_type === "Pipeline" && drugs ? (
            <>
              {content && <ReportMarkdown content={content} />}
              <GanttChart drugs={drugs} />
              <DrugSubmissionList drugs={drugs} />
              <SourcesList sources={sources ?? []} />
              <AnalystSignature analyst={meta.analyst} date={meta.delivery_date} />
            </>
          ) : meta.report_type === "Monitoring" && drugs ? (
            (() => {
              const CARD_SENTINEL = "<!-- CARDS -->";
              const splitIdx = content.indexOf(CARD_SENTINEL);
              const preContent = splitIdx >= 0 ? content.slice(0, splitIdx).trim() : content;
              const postContent = splitIdx >= 0 ? content.slice(splitIdx + CARD_SENTINEL.length).trim() : "";
              return (
                <>
                  {preContent && <ReportMarkdown content={preContent} />}
                  <DrugSubmissionList drugs={drugs} />
                  {postContent && <ReportMarkdown content={postContent} />}
                  <AnalystSignature analyst={meta.analyst} date={meta.delivery_date} />
                </>
              );
            })()
          ) : meta.report_type === "market-model" ? (
            <>
              <PdacPeakSalesReport />
              <AnalystSignature analyst={meta.analyst} date={meta.delivery_date} />
            </>
          ) : meta.id === "rpt_trial_indication_mapping_pdac" ? (
            <>
              <TrialIndicationMappingPdac />
              <SourcesList sources={sources ?? []} />
              <AnalystSignature analyst={meta.analyst} date={meta.delivery_date} />
            </>
          ) : content ? (
            <>
              <ReportMarkdown content={content} />
              <SourcesList sources={sources ?? []} />
              <AnalystSignature analyst={meta.analyst} date={meta.delivery_date} />
            </>
          ) : (
            <p className="text-muted italic">
              Report content will be loaded here. Add content.mdx to the report
              data directory.
            </p>
          )}
        </div>
      </div>

      <SelectionToolbar
        containerRef={reportRef}
        onQuote={(text) => setQuotedText(text)}
      />

      {/* Q&A Chat Panel */}
      <ChatPanel
        reportId={meta.id}
        quotedText={quotedText}
        onClearQuote={() => setQuotedText(null)}
      />
    </div>
  );
}
