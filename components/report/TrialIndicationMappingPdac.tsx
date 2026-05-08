"use client";

import { useState, Fragment } from "react";
import trialData from "@/data/reports/trial-indication-mapping-pdac/data.json";

type Trial = (typeof trialData.trials)[0];

const STAGES = ["Metastatic", "Locally Advanced", "Resected"] as const;
const LOTS = ["Adjuvant", "1L", "2L", "3L"] as const;

const BUBBLE_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  "RASolute 303":   { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-300" },
  "RASolute 302":   { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-300" },
  "OPTIMIZE-1":     { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-300" },
  "PRISM-1":        { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-300" },
  "APOLLO":         { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-300" },
  "MountainTAP-30": { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-300" },
};

function bubbleStyle(trialName: string) {
  return BUBBLE_STYLE[trialName] ?? { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-300" };
}

export default function TrialIndicationMappingPdac() {
  const [tooltip, setTooltip] = useState<{ trial: Trial; x: number; y: number } | null>(null);

  const trials = trialData.trials;

  function trialsAt(stage: string, lot: string) {
    return trials.filter((t) => t.disease_stage === stage && t.lot === lot);
  }

  function handleMouseEnter(e: React.MouseEvent<HTMLButtonElement>, trial: Trial) {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ trial, x: rect.left, y: rect.bottom + 8 });
  }

  return (
    <div className="space-y-12">

      {/* ── Section 1: Introduction ── */}
      <section>
        <h2 className="text-lg font-semibold text-dark mb-3">Overview</h2>
        <p className="text-body leading-relaxed">
          This is an abbreviated sample report for a mapping of key PDAC clinical trials to their
          precise indications within the treatment landscape. While a small sample of six PDAC
          trials are covered (RASolute 303, RASolute 302, OPTIMIZE-1, PRISM-1, APOLLO, and
          MountainTAP-30), a complete report would map indications across the much broader set of
          active PDAC clinical trials. The goal is demonstrating accurate classification of the
          precise target indication for each program, including disease stage, line of therapy,
          treatment regimen, and biomarker subgroup to determine where each therapy may fall in the
          treatment landscape.
        </p>
      </section>

      {/* ── Section 2: Visualizations ── */}
      <section className="space-y-10">
        <h2 className="text-lg font-semibold text-dark">Trial Indication Mapping</h2>

        {/* ── Static Trial Table ── */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-accent text-white">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide w-64">Trial</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide">Target Indication</th>
              </tr>
            </thead>
            <tbody>
              {trials.map((trial, i) => {
                const s = bubbleStyle(trial.trial_name);
                return (
                  <tr key={trial.trial_id} className={`border-t border-border ${i % 2 === 1 ? "bg-bg2" : ""}`}>
                    <td className="px-4 py-3 align-top">
                      <div className={`font-semibold ${s.text}`}>{trial.trial_name}</div>
                      <div className="text-xs text-muted mt-0.5">
                        {trial.drug_name} · {trial.sponsor} · {trial.phase}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-body align-middle">{trial.indication_sentence}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Indication Matrix ── */}
        <div>
          <h3 className="text-base font-semibold text-dark mb-4">Indication Matrix</h3>
          <p className="text-sm text-muted mb-5">
            Hover over any trial to see full target indication details.
          </p>

          <div className="overflow-x-auto">
            <div
              className="grid border-collapse min-w-[580px]"
              style={{ gridTemplateColumns: "168px repeat(4, 1fr)" }}
            >
              {/* Column headers */}
              <div className="border border-border bg-bg2 p-3" />
              {LOTS.map((lot) => (
                <div
                  key={lot}
                  className="border border-border bg-bg2 p-3 text-xs font-semibold text-dark text-center tracking-wide"
                >
                  {lot}
                </div>
              ))}

              {/* Data rows */}
              {STAGES.map((stage) => (
                <Fragment key={stage}>
                  <div className="border border-border bg-bg2 p-3 text-xs font-medium text-body flex items-start pt-4">
                    {stage}
                  </div>
                  {LOTS.map((lot) => {
                    const cell = trialsAt(stage, lot);
                    return (
                      <div
                        key={`${stage}-${lot}`}
                        className="border border-border p-2 min-h-[116px] flex flex-wrap gap-1.5 items-start content-start"
                      >
                        {cell.map((trial) => {
                          const s = bubbleStyle(trial.trial_name);
                          return (
                            <button
                              key={trial.trial_id}
                              className={`px-2.5 py-1.5 rounded border text-xs font-medium cursor-pointer transition-opacity hover:opacity-75 text-left leading-snug ${s.bg} ${s.text} ${s.border}`}
                              onMouseEnter={(e) => handleMouseEnter(e, trial)}
                              onMouseLeave={() => setTooltip(null)}
                            >
                              <div>{trial.trial_name}</div>
                              <div className="opacity-60 font-normal">({trial.drug_name})</div>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="fixed z-50 bg-white border border-border rounded-lg shadow-xl p-3.5 text-xs space-y-1.5 w-72 pointer-events-none"
              style={{ left: Math.min(tooltip.x, (typeof window !== "undefined" ? window.innerWidth : 1200) - 300), top: tooltip.y }}
            >
              <div className="font-semibold text-dark text-sm pb-1 border-b border-border">
                {tooltip.trial.trial_name}
              </div>
              <Row label="Drug"            value={tooltip.trial.drug_name} />
              <Row label="Sponsor"         value={tooltip.trial.sponsor} />
              <Row label="Trial ID"        value={tooltip.trial.trial_id} mono />
              <Row label="Phase"           value={tooltip.trial.phase} />
              <Row label="Disease Stage"   value={tooltip.trial.disease_stage} />
              <Row label="Line of Therapy" value={tooltip.trial.lot} />
              <Row label="Mono / Combo"    value={tooltip.trial.mono_combo} />
              <Row label="Subgroup"        value={tooltip.trial.subgroup} />
            </div>
          )}
        </div>
      </section>

      {/* ── Section 3: Methodology ── */}
      <section className="border-t border-border pt-10">
        <h2 className="text-lg font-semibold text-dark mb-6">Methodology</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-dark mb-1">Classification Framework</h3>
            <p className="text-sm text-body leading-relaxed">
              Trial indications were classified through review of trial description,
              inclusion / exclusion criteria, and contextual knowledge on disease and treatment
              staging using the most recent NCCN PDAC treatment guidelines. Disease stage and line of therapy
              assignments were derived from the requirements stated in the trial description and eligibility criteria.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-dark mb-1">Human Reasoning Layer</h3>
            <p className="text-sm text-body leading-relaxed">
              As an expert-in-the-loop quality assurance layer, indication mapping was reviewed by
              the Inflection Labs team for accuracy. The Olaparib APOLLO trial is a clear example
              of the risks of incorrect mapping: the trial's metadata places it under pancreatic
              cancer broadly, but review of the inclusion criteria confirms it targets a surgically
              resectable population in the adjuvant post-resection setting. Accurate assessment of
              each trial in the treatment landscape requires a combination of (1) providing LLM
              agents with necessary contextual knowledge (e.g., NCCN guidelines) and guiding reasoning
              questions (2) building a system with additional layers for output review to achieve high
              accuracy and precision and (3) human-in-the-loop review to verify logic behind
              competitive intelligence data extraction and synthesis.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex gap-1.5">
      <span className="text-muted shrink-0">{label}:</span>
      <span className={`text-body ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
