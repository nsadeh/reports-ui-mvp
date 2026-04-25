import type { Analyst } from "@/lib/types";

export default function AnalystSignature({
  analyst,
  date,
}: {
  analyst: Analyst;
  date: string;
}) {
  return (
    <div className="mt-12 mb-8 border-t border-border pt-8">
      <div className="max-w-md">
        <p className="text-sm font-semibold text-dark mb-6">Reviewed and approved by,</p>

        <div className="border-t border-dark/20 pt-3 space-y-0.5">
          <p className="text-sm font-semibold text-dark">{analyst.name}</p>
          {analyst.credentials && <p className="text-xs text-body">{analyst.credentials}</p>}
          <p className="text-xs text-body">{analyst.title}</p>
          <p className="text-xs text-muted mt-1">Electronically signed {date}</p>
        </div>

        <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-bg2 border border-border rounded-md w-fit">
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
            Verified by Inflection Labs · Report ID: IL-2026-0047
          </span>
        </div>
      </div>
    </div>
  );
}
