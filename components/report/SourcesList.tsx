import type { SourceEntry } from "@/lib/types";

function ExternalLinkIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block ml-1 shrink-0 opacity-60"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
  return dateStr;
}

export default function SourcesList({ sources }: { sources: SourceEntry[] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-10 pt-8 border-t border-border">
      <h2 className="text-sm font-semibold text-accent uppercase tracking-wide mb-4">
        Sources
      </h2>
      <ol className="space-y-3">
        {sources.map((src, i) => (
          <li key={src.id} className="flex gap-3 text-sm">
            <span className="shrink-0 font-mono text-muted text-xs mt-0.5 w-5 text-right">
              [{i + 1}]
            </span>
            <span className="text-body leading-relaxed">
              <span className="font-medium text-dark">&ldquo;{src.title}&rdquo;</span>
              {" · "}
              <span className="italic">{src.organization}</span>
              {src.date && (
                <>
                  {" · "}
                  <span className="text-muted">{formatDate(src.date)}</span>
                </>
              )}
              {src.url && (
                <>
                  {" "}
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-dark transition-colors underline underline-offset-2"
                  >
                    View source
                    <ExternalLinkIcon />
                  </a>
                </>
              )}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
