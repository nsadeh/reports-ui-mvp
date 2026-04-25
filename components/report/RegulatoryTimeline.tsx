"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface RegulatoryEvent {
  event_number: number;
  event_date: string;
  event_type: string | null;
  event_title: string;
  event_summary: string;
  event_significance: "major_with_minutes" | "major" | "minor";
}

const GLOSSARY: [string, string][] = [
  ["ALSFRS-R", "ALS Functional Rating Scale–Revised"],
  ["ATLIS", "Accurate Test of Limb Isometric Strength"],
  ["BTD", "Breakthrough Therapy Designation"],
  ["BTDR", "Breakthrough Therapy Designation Request"],
  ["CFR", "Code of Federal Regulations"],
  ["CMC", "Chemistry, Manufacturing, and Controls"],
  ["CNS", "Central Nervous System"],
  ["DDI", "Drug-Drug Interaction"],
  ["ICH", "International Council for Harmonisation"],
  ["IND", "Investigational New Drug Application"],
  ["NDA", "New Drug Application"],
  ["NCE", "New Chemical Entity"],
  ["OAT1", "Organic Anion Transporter 1"],
  ["PIND", "Pre-Investigational New Drug"],
  ["PK", "Pharmacokinetics"],
  ["PPND", "Pre- and Postnatal Development"],
  ["PREA", "Pediatric Research Equity Act"],
  ["SAE", "Serious Adverse Event"],
  ["SAP", "Statistical Analysis Plan"],
  ["TUDCA", "Tauroursodeoxycholic acid"],
];

function escapeForRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/-/g, "[-–]");
}

function getRelevantGlossary(title: string, summary: string): [string, string][] {
  const text = title + " " + summary;
  return GLOSSARY.filter(([acronym]) => {
    if (text.includes(`(${acronym})`)) return false;
    if (text.includes(`${acronym} (`)) return false;
    return new RegExp(`(?<![A-Za-z])${escapeForRegex(acronym)}(?![A-Za-z])`, "").test(text);
  });
}

function extractYear(dateStr: string): string {
  const parts = dateStr.split(",");
  return parts[parts.length - 1]?.trim() ?? dateStr;
}

function groupByYear(events: RegulatoryEvent[]): [string, RegulatoryEvent[]][] {
  const map = new Map<string, RegulatoryEvent[]>();
  for (const ev of events) {
    const year = extractYear(ev.event_date);
    if (!map.has(year)) map.set(year, []);
    map.get(year)!.push(ev);
  }
  return Array.from(map.entries());
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

function EventCard({
  event,
  isOpen,
  onToggle,
}: {
  event: RegulatoryEvent;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const tier = event.event_significance === "major_with_minutes" ? "minutes"
    : event.event_significance === "major" ? "major"
    : "minor";

  const dotClass =
    tier === "minutes" ? "bg-dark border-dark" :
    tier === "major"   ? "bg-accent border-accent" :
                         "bg-white border-sage";

  const cardBorderClass =
    tier === "minutes" ? "border-dark/25" :
    tier === "major"   ? "border-accent/25" :
                         "border-border";

  const headerClass =
    tier === "minutes" ? "bg-dark text-white hover:bg-dark/90" :
    tier === "major"   ? "bg-accent/[0.1] hover:bg-accent/[0.15]" :
                         "bg-bg2 text-body hover:bg-border/40";

  const dateClass   = tier === "minutes" ? "text-white/60" : "text-muted";
  const badgeClass  = tier === "minutes" ? "bg-white/15 text-white/80" : "bg-accent/10 text-accent";
  const titleClass  = tier === "minutes" ? "text-white" : "text-dark";
  const chevronClass = tier === "minutes" ? "text-white/70" : "text-muted";

  const bodyClass =
    tier === "minutes" ? "border-dark/15 bg-dark/5" :
    tier === "major"   ? "border-accent/20 bg-accent/[0.04]" :
                         "border-border bg-white";

  return (
    <div className="relative pl-9 mb-3">
      {/* Timeline dot */}
      <div className={`absolute left-[7px] top-[17px] w-[10px] h-[10px] rounded-full border-2 z-10 ${dotClass}`} />

      {/* Card */}
      <div className={`rounded-lg border overflow-hidden transition-shadow hover:shadow-sm ${cardBorderClass}`}>
        {/* Clickable header */}
        <button
          onClick={onToggle}
          className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 transition-colors ${headerClass}`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`text-[11px] font-mono shrink-0 ${dateClass}`}>
              {event.event_date}
            </span>
            {event.event_type && (
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ${badgeClass}`}>
                {event.event_type}
              </span>
            )}
            <span className={`text-sm font-medium truncate ${titleClass}`}>
              {event.event_title}
            </span>
          </div>
          <span className={chevronClass}>
            <ChevronIcon open={isOpen} />
          </span>
        </button>

        {/* Expanded body */}
        {isOpen && (
          <div className={`px-4 py-3 border-t text-sm text-body leading-relaxed ${bodyClass}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="text-sm text-body leading-relaxed mb-3 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-dark">{children}</strong>,
                ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1.5 text-sm text-body">{children}</ul>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              }}
            >
              {event.event_summary}
            </ReactMarkdown>
            {(() => {
              const entries = getRelevantGlossary(event.event_title, event.event_summary);
              if (entries.length === 0) return null;
              return (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-xs italic text-muted">
                    {entries.map(([acronym, expansion], i) => (
                      <span key={acronym}>
                        {i > 0 && ",  "}
                        <span className="not-italic font-medium">{acronym}</span> — {expansion}
                      </span>
                    ))}
                  </p>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RegulatoryTimeline({
  events,
}: {
  events: RegulatoryEvent[];
}) {
  const [openEvents, setOpenEvents] = useState<Set<number>>(new Set());
  const grouped = groupByYear(events);

  function toggle(num: number) {
    setOpenEvents((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  }

  return (
    <div>
      {/* Legend */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center gap-4 text-xs text-muted bg-bg2 border border-border rounded-md px-3 py-2">
          <span className="font-medium text-body mr-1">Key</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-dark inline-block shrink-0" />
            Major event — meeting minutes
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block shrink-0" />
            Major event
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white border-2 border-sage inline-block shrink-0" />
            Minor event
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical rail */}
        <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border" />

        {grouped.map(([year, yearEvents]) => (
          <div key={year} className="mb-1">
            {/* Year divider */}
            <div className="relative flex items-center pl-9 mb-3">
              <span className="text-xs font-semibold text-muted bg-bg border border-border px-2 py-0.5 rounded z-10">
                {year}
              </span>
            </div>

            {yearEvents.map((ev) => (
              <EventCard
                key={ev.event_number}
                event={ev}
                isOpen={openEvents.has(ev.event_number)}
                onToggle={() => toggle(ev.event_number)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Single chat CTA below full timeline */}
      <div className="mt-8 pt-6 border-t border-border">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-chat-panel"))}
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent bg-accent/10 hover:bg-accent/20 px-4 py-2.5 rounded-lg transition-colors"
        >
          <ChatIcon />
          Chat for more details
        </button>
        <p className="mt-2 text-xs text-muted">
          Ask the AI about any event, regulatory decision, or the strategic implications of this timeline.
        </p>
      </div>
    </div>
  );
}
