import type { Analyst } from "@/lib/types";

export default function AnalystSignature({
  analyst,
  date,
}: {
  analyst: Analyst;
  date: string;
}) {
  // Generate a deterministic but natural-looking SVG signature from the name
  const firstName = analyst.name.split(" ")[0];
  const lastName = analyst.name.split(" ").slice(1).join(" ");

  return (
    <div className="mt-12 mb-8 border-t border-border pt-8">
      <div className="max-w-md">
        {/* Signature rendering */}
        <div className="mb-4">
          <svg
            viewBox="0 0 320 80"
            className="w-64 h-20"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Signature-style cursive path — stylized for "Nim Telson" */}
            <path
              d={generateSignaturePath(firstName, lastName)}
              fill="none"
              stroke="#1A2B2E"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-80"
            />
            {/* Subtle pen pressure variation with a second thinner pass */}
            <path
              d={generateSignatureAccent(firstName)}
              fill="none"
              stroke="#1A2B2E"
              strokeWidth="1.0"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-40"
            />
          </svg>
        </div>

        {/* Signature line */}
        <div className="border-t border-dark/20 pt-3 space-y-0.5">
          <p className="text-sm font-semibold text-dark">{analyst.name}</p>
          <p className="text-xs text-body">{analyst.credentials}</p>
          <p className="text-xs text-body">{analyst.title}</p>
          <p className="text-xs text-muted mt-1">
            Electronically signed {date}
          </p>
        </div>

        {/* Verification badge */}
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
            Verified by Inflection Labs — Report ID: IL-2026-0047
          </span>
        </div>
      </div>
    </div>
  );
}

// Generate a cursive-like SVG path for the first name
function generateSignaturePath(first: string, last: string): string {
  // Seed from name characters for determinism
  const s1 = first.charCodeAt(0) % 10;
  const s2 = last.charCodeAt(0) % 10;

  // First name — large swooping letters
  const parts = [
    // Capital N with flourish
    `M ${10 + s1},55`,
    `C ${15 + s1},20 ${20 + s1},15 ${25 + s1},50`,
    `C ${30 + s1},65 ${35 + s1},18 ${45 + s1},22`,
    `C ${50 + s1},25 ${48 + s1},52 ${55 + s1},50`,
    // "im" continuation
    `C ${62},48 ${60},25 ${68},28`,
    `C ${75},30 ${72},50 ${80},48`,
    `C ${88},45 ${85},26 ${95},30`,
    `Q ${100},32 ${105},48`,
    // Connecting stroke to last name
    `Q ${115},58 ${125},42`,
    // Capital T with crossbar
    `M ${120},22 L ${145},20`,
    `M ${132},20 C ${134},25 ${133},38 ${138},50`,
    // "elson" flow
    `C ${142},56 ${148},30 ${155},35`,
    `C ${160},38 ${158},52 ${165},48`,
    `Q ${170},45 ${172},35`,
    `C ${175},28 ${178},48 ${185},45`,
    `C ${190},42 ${188},30 ${195},35`,
    `C ${200},38 ${198},50 ${208},45`,
    `C ${215},40 ${212},32 ${220},38`,
    `Q ${225},42 ${230},48`,
    // Terminal flourish
    `C ${240 + s2},52 ${250 + s2},35 ${270 + s2},40`,
  ];

  return parts.join(" ");
}

// Accent strokes — subtle pressure variations on the capitals
function generateSignatureAccent(first: string): string {
  const s = first.charCodeAt(0) % 5;
  return [
    // N downstroke emphasis
    `M ${12 + s},52 C ${14 + s},35 ${18 + s},20 ${24 + s},48`,
    // T crossbar emphasis
    `M ${122},21 L ${143},19`,
  ].join(" ");
}
