"use client";

import { useState } from "react";
import type { DrugEntry, TrialSegment } from "./DrugSubmissionList";

const CHART_START = new Date("2019-01-01");
const CHART_END = new Date("2030-01-01");
const TOTAL_MS = CHART_END.getTime() - CHART_START.getTime();
const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

function pct(dateStr: string): number {
  const d = new Date(dateStr);
  return Math.max(0, Math.min(100, ((d.getTime() - CHART_START.getTime()) / TOTAL_MS) * 100));
}

function primaryName(fullName: string): string {
  return fullName.split("(")[0].trim();
}

function getTrials(drug: DrugEntry): TrialSegment[] {
  if (drug.trials && drug.trials.length > 0) return drug.trials;
  if (drug.trial_start && drug.trial_end) {
    return [{ name: "", phase: "", start: drug.trial_start, end: drug.trial_end }];
  }
  return [];
}

type HoveredTrial = { drugName: string; trialName: string } | null;

export default function GanttChart({ drugs }: { drugs: DrugEntry[] }) {
  const [hovered, setHovered] = useState<HoveredTrial>(null);

  const chartDrugs = drugs
    .filter(
      (d) =>
        (d.trials?.length || (d.trial_start && d.trial_end)) &&
        d.nda_range_start &&
        d.nda_range_end
    )
    .sort(
      (a, b) =>
        new Date(a.nda_range_start!).getTime() - new Date(b.nda_range_start!).getTime()
    );

  return (
    <div className="mb-10 px-5 pt-5 pb-6 bg-bg2 border border-border rounded-xl">
      <h2 className="text-sm font-semibold text-dark mb-5">Trial &amp; NDA Submission Timeline</h2>

      {/* Year axis */}
      <div className="flex mb-1.5">
        <div className="w-32 shrink-0" />
        <div className="flex-1 relative h-4">
          {YEARS.map((year) => (
            <span
              key={year}
              className="absolute text-[10px] text-muted -translate-x-1/2 select-none"
              style={{ left: `${pct(`${year}-01-01`)}%` }}
            >
              {year}
            </span>
          ))}
        </div>
      </div>

      {/* Rows + gridlines */}
      <div className="flex">
        {/* Drug name labels */}
        <div className="w-32 shrink-0 flex flex-col">
          {chartDrugs.map((drug) => (
            <div key={drug.drug_name} className="h-10 flex items-center">
              <span className="text-xs text-body pr-3 truncate leading-tight">
                {primaryName(drug.drug_name)}
              </span>
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="flex-1 relative">
          {/* Vertical year gridlines */}
          {YEARS.slice(1).map((year) => (
            <div
              key={year}
              className="absolute top-0 bottom-0 w-px bg-border"
              style={{ left: `${pct(`${year}-01-01`)}%` }}
            />
          ))}

          {/* Drug rows */}
          {chartDrugs.map((drug) => {
            const trials = getTrials(drug);
            const ndaLeft = pct(drug.nda_range_start!);
            const ndaWidth = pct(drug.nda_range_end!) - ndaLeft;
            const isExact = drug.nda_range_start === drug.nda_range_end;

            return (
              <div key={drug.drug_name} className="relative h-10 flex items-center">
                {/* Background track */}
                <div className="absolute inset-x-0 h-2 top-1/2 -translate-y-1/2 bg-border/50 rounded-full" />

                {/* Trial bars */}
                {trials.map((trial) => {
                  const trialLeft = pct(trial.start);
                  const trialWidth = pct(trial.end) - trialLeft;
                  const isHovered =
                    hovered?.drugName === drug.drug_name &&
                    hovered?.trialName === trial.name;

                  return (
                    <div
                      key={`${trial.name || "trial"}-${trial.start}`}
                      className={`absolute h-4 top-1/2 -translate-y-1/2 bg-accent/70 rounded-full cursor-default ${isHovered ? "z-30" : ""}`}
                      style={{ left: `${trialLeft}%`, width: `${trialWidth}%` }}
                      onMouseEnter={() =>
                        setHovered({ drugName: drug.drug_name, trialName: trial.name })
                      }
                      onMouseLeave={() => setHovered(null)}
                    >
                      {isHovered && trial.name && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none">
                          <div className="bg-dark text-white text-[11px] px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-lg text-center">
                            <div className="font-semibold">{trial.name}</div>
                            <div className="font-normal text-white/70 mt-0.5">{trial.phase}</div>
                          </div>
                          <div className="w-0 h-0 mx-auto border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-dark" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* NDA: exact tick or estimated range band */}
                {isExact ? (
                  <div
                    className="absolute h-6 w-2 top-1/2 -translate-y-1/2 bg-lime rounded-sm z-10"
                    style={{ left: `${ndaLeft - 0.3}%` }}
                  />
                ) : (
                  <div
                    className="absolute h-4 top-1/2 -translate-y-1/2 bg-lime/75 rounded z-10"
                    style={{
                      left: `${ndaLeft}%`,
                      width: `${Math.max(ndaWidth, 0.8)}%`,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 ml-32 text-xs text-muted">
        <span className="flex items-center gap-2">
          <span className="inline-block w-8 h-3 bg-accent/70 rounded-full shrink-0" />
          Clinical trial period
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-4 bg-lime rounded-sm shrink-0" />
          NDA date / estimated window
        </span>
      </div>
    </div>
  );
}
