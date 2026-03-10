"use client";

import { useState, useRef } from "react";
import { ReportMarkdown } from "@/components/report/Markdown";
import ChatPanel from "@/components/chat/ChatPanel";
import AnalystSignature from "@/components/report/AnalystSignature";
import SelectionToolbar from "@/components/report/SelectionToolbar";
import type { ReportMeta } from "@/lib/types";

export default function ReportPageClient({
  meta,
  content,
}: {
  meta: ReportMeta;
  content: string;
}) {
  const [quotedText, setQuotedText] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-screen">
      {/* Report Body */}
      <div ref={reportRef} className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl">
          {/* Verified badge */}
          <div className="mb-6 flex items-center gap-2 px-3 py-2 bg-bg2 border border-border rounded-md w-fit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-accent shrink-0">
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
              Verified by Inflection Labs — {meta.analyst.name}{meta.analyst.credentials ? `, ${meta.analyst.credentials}` : ""} — Delivered {meta.delivery_date}
            </span>
          </div>

          {/* Metadata Bar */}
          <div className="mb-8 pb-4 border-b border-border">
            <h1 className="text-2xl font-semibold text-dark mb-2">
              {meta.title}
            </h1>
            <div className="flex items-center gap-3 flex-wrap text-sm">
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-sage/30 text-body rounded">
                {meta.scope_value}
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
                {meta.analyst.name}{meta.analyst.credentials ? `, ${meta.analyst.credentials}` : ""}
              </span>
            </div>
          </div>

          {/* Report Content */}
          {content ? (
            <>
              <ReportMarkdown content={content} />
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
