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
  event_significance: "major" | "minor";
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
  const isMajor = event.event_significance === "major";

  return (
    <div className="relative pl-9 mb-3">
      {/* Timeline dot */}
      <div
        className={`absolute left-[7px] top-[17px] w-[10px] h-[10px] rounded-full border-2 z-10 ${
          isMajor
            ? "bg-dark border-dark"
            : "bg-white border-sage"
        }`}
      />

      {/* Card */}
      <div
        className={`rounded-lg border overflow-hidden transition-shadow hover:shadow-sm ${
          isMajor ? "border-dark/25" : "border-border"
        }`}
      >
        {/* Clickable header */}
        <button
          onClick={onToggle}
          className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 transition-colors ${
            isMajor
              ? "bg-dark text-white hover:bg-dark/90"
              : "bg-bg2 text-body hover:bg-border/40"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className={`text-[11px] font-mono shrink-0 ${
                isMajor ? "text-white/60" : "text-muted"
              }`}
            >
              {event.event_date}
            </span>
            {event.event_type && (
              <span
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ${
                  isMajor
                    ? "bg-white/15 text-white/80"
                    : "bg-accent/10 text-accent"
                }`}
              >
                {event.event_type}
              </span>
            )}
            <span
              className={`text-sm font-medium truncate ${
                isMajor ? "text-white" : "text-dark"
              }`}
            >
              {event.event_title}
            </span>
          </div>
          <span className={isMajor ? "text-white/70" : "text-muted"}>
            <ChevronIcon open={isOpen} />
          </span>
        </button>

        {/* Expanded body */}
        {isOpen && (
          <div
            className={`px-4 py-3 border-t text-sm text-body leading-relaxed ${
              isMajor ? "border-dark/15 bg-dark/5" : "border-border bg-white"
            }`}
          >
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
            Major milestone
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white border-2 border-sage inline-block shrink-0" />
            Minor / procedural
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
