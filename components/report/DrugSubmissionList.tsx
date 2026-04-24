"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface TrialSegment {
  name: string;
  phase: string;
  start: string;
  end: string;
}

export interface DrugEntry {
  drug_name: string;
  manufacturer: string;
  event_type: string;
  NDA_date: string;
  summary: string;
  trial_start?: string;
  trial_end?: string;
  nda_range_start?: string;
  nda_range_end?: string;
  trials?: TrialSegment[];
}

const SECTION_ORDER = [
  "post-NDA submission",
  "submission announced",
  "trial end announced",
  "trial ongoing",
];

const SECTION_LABELS: Record<string, string> = {
  "post-NDA submission": "FDA Approved / Post-NDA Submission",
  "submission announced": "NDA Submission Announced",
  "trial end announced": "Trial Completion Announced",
  "trial ongoing": "Phase 3 Trial Ongoing",
};

function formatNDADate(raw: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [year, month, day] = raw.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
  const cleaned = raw.replace(/\s*\(estimated\)\s*/gi, "").trim();
  return `Expected ${cleaned}`;
}

function groupByEventType(drugs: DrugEntry[]): [string, DrugEntry[]][] {
  const map = new Map<string, DrugEntry[]>();
  for (const drug of drugs) {
    if (!map.has(drug.event_type)) map.set(drug.event_type, []);
    map.get(drug.event_type)!.push(drug);
  }
  const ordered: [string, DrugEntry[]][] = [];
  for (const key of SECTION_ORDER) {
    if (map.has(key)) ordered.push([key, map.get(key)!]);
  }
  for (const [key, val] of map.entries()) {
    if (!SECTION_ORDER.includes(key)) ordered.push([key, val]);
  }
  return ordered;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function DrugCard({
  drug,
  isOpen,
  onToggle,
}: {
  drug: DrugEntry;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mb-3">
      <div className="rounded-lg border border-border overflow-hidden transition-shadow hover:shadow-sm">
        <button
          onClick={onToggle}
          className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 bg-bg2 hover:bg-border/40 transition-colors"
        >
          <span className="text-sm font-semibold text-dark">{drug.drug_name}</span>
          <span className="text-muted">
            <ChevronIcon open={isOpen} />
          </span>
        </button>

        {isOpen && (
          <div className="px-4 py-4 border-t border-border bg-white space-y-3">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <span>
                <span className="text-muted font-medium">Manufacturer: </span>
                <span className="text-body">{drug.manufacturer}</span>
              </span>
              <span>
                <span className="text-muted font-medium">NDA Submission Date: </span>
                <span className="text-body">{formatNDADate(drug.NDA_date)}</span>
              </span>
            </div>
            <div className="text-sm text-body leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => (
                    <p className="text-sm text-body leading-relaxed mb-2 last:mb-0">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-dark">{children}</strong>
                  ),
                }}
              >
                {drug.summary}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DrugSubmissionList({ drugs }: { drugs: DrugEntry[] }) {
  const [openDrugs, setOpenDrugs] = useState<Set<string>>(new Set());
  const grouped = groupByEventType(drugs);

  function toggle(drugName: string) {
    setOpenDrugs((prev) => {
      const next = new Set(prev);
      if (next.has(drugName)) next.delete(drugName);
      else next.add(drugName);
      return next;
    });
  }

  return (
    <div>
      {grouped.map(([eventType, entries]) => (
        <div key={eventType} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-semibold text-accent uppercase tracking-wide">
              {SECTION_LABELS[eventType] ?? eventType}
            </h2>
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted shrink-0">
              {entries.length} {entries.length === 1 ? "drug" : "drugs"}
            </span>
          </div>

          {entries.map((drug) => (
            <DrugCard
              key={drug.drug_name}
              drug={drug}
              isOpen={openDrugs.has(drug.drug_name)}
              onToggle={() => toggle(drug.drug_name)}
            />
          ))}
        </div>
      ))}

      <div className="mt-8 pt-6 border-t border-border">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-chat-panel"))}
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent bg-accent/10 hover:bg-accent/20 px-4 py-2.5 rounded-lg transition-colors"
        >
          <ChatIcon />
          Chat for more details
        </button>
        <p className="mt-2 text-xs text-muted">
          Ask the AI about any drug, trial timeline, or the regulatory implications for your pipeline.
        </p>
      </div>
    </div>
  );
}
