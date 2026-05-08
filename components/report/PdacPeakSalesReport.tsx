"use client";

import { useState } from "react";
import reportData from "@/data/reports/pdac-peak-sales-estimate/data.json";
import sourcesData from "@/data/reports/pdac-peak-sales-estimate/sources.json";
import SourcesList from "@/components/report/SourcesList";

type Params = typeof reportData.defaults;

function fmt$(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

function fmtPct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

function Cite({ n }: { n: number }) {
  return (
    <sup className="text-[10px] text-accent font-medium ml-0.5">
      <a href={`#source-${n}`} className="hover:underline">
        [{n}]
      </a>
    </sup>
  );
}

const accordionRows = [
  {
    name: "Annual PDAC Incidence",
    value: "61,000 patients/year",
    source: "SEER 2026 [6] · ACS 2025 [7] · Park et al 2021 [8]",
    rationale:
      "Derived from SEER-reported annual pancreatic cancer incidence of approximately 67,530 [6], corroborated by ACS 2025 [7], multiplied by the 90% PDAC histological proportion per Park et al 2021 [8], rounded to 61,000. PDAC is the dominant subtype of pancreatic cancer.",
    footnote: null as string | null,
  },
  {
    name: "Metastatic Rate",
    value: "53%",
    source: "Park et al 2021 [8]",
    rationale:
      "Approximately 50–55% of PDAC patients are diagnosed in the metastatic stage, which is the patient subpopulation of focus in the daraxonrasib trials [8]. If daraxonrasib were to expand into locally advanced PDAC by the time of peak sales, the eligible population would increase considerably, as locally advanced disease accounts for an additional 30–35% of PDAC diagnoses [8].",
    footnote: null,
  },
  {
    name: "KRAS Mutation Rate",
    value: "90%",
    source: "Lennerz & Stenzinger 2015 [9]",
    rationale:
      "KRAS mutations are present in approximately 90% of PDAC tumors [9], making this the defining genomic feature of the indication. Only KRAS-mutant patients would be eligible for daraxonrasib.",
    footnote: null,
  },
  {
    name: "PDAC Patients Progressing to 2L",
    value: "46% (toggle OFF by default)",
    source: "King et al 2022 [10]",
    rationale:
      "Real-world treatment pattern data indicates that approximately 46% of metastatic PDAC patients who receive first-line therapy go on to receive second-line therapy [10]. This parameter is toggled OFF by default, consistent with the base case assumption that daraxonrasib achieves approval in both 1L and 2L settings at the time of peak sales. When toggled ON, the eligible patient pool is multiplied by this rate to model a scenario in which regulatory approval is limited to the second-line setting.",
    footnote: null,
  },
  {
    name: "Peak Market Share",
    value: "55% (range: 40–70%)",
    source: "McKinsey 2014 [11]",
    rationale:
      "The 55% midpoint reflects daraxonrasib's first-in-class positioning in a high unmet need indication with no currently approved KRAS-targeted therapies. Lack of efficacious treatment options and promising data from daraxonrasib trials could lead to market share closer to bullish estimates of 70% at the time of peak sales. The slider in the calculator above allows this to be adjusted within the modeled range.",
    footnote:
      "The 40% lower bound reflects McKinsey first-mover estimates for innovative oncology therapies [11]. The 70% upper bound reflects additional share potential from physician specialty concentration, route of administration, and multi-indication expansion.",
  },
  {
    name: "Annual Drug Price",
    value: "$200,000",
    source: "Miljković et al 2023 [12] · Roskoski 2024 [13]",
    rationale:
      "Benchmarked to approved oncology therapies [12]. $200,000 represents a directional estimate consistent with pricing for novel oncology targeted therapies with first-in-class status in high unmet need indications.",
    footnote:
      "Roskoski 2024 produces a corroborating figure of $214,800 annually, calculated from average neoplastic disease treatment costs of $17,900/month [13], supporting the $200K assumption.",
  },
  {
    name: "US Share of Global Revenue",
    value: "60%",
    source: "Ramagopalan et al 2025 [14] · Goldman & Lakdawalla 2018 [15]",
    rationale:
      "Averaged from two independent sources: Ramagopalan et al 2025 (57%, Keytruda revenue split, selected for oncology relevance) [14] and Goldman & Lakdawalla 2018 (63%, derived from total pharmaceutical sales) [15]. The 60% average is used as the base case.",
    footnote: null,
  },
];

const inputBase =
  "w-full border border-border rounded px-3 py-1.5 text-sm text-dark bg-white focus:outline-none focus:ring-1 focus:ring-accent";

export default function PdacPeakSalesReport() {
  const [params, setParams] = useState<Params>(reportData.defaults);
  const [open, setOpen] = useState<Set<number>>(new Set());
  const [secondLineEnabled, setSecondLineEnabled] = useState(false);
  const [secondLineRateRaw, setSecondLineRateRaw] = useState(
    String(Math.round(reportData.defaults.secondLineRate * 100))
  );
  const [annualIncidenceRaw, setAnnualIncidenceRaw] = useState(
    String(reportData.defaults.annualIncidence)
  );
  const [metastaticRateRaw, setMetastaticRateRaw] = useState(
    String(Math.round(reportData.defaults.metastaticRate * 100))
  );
  const [krasMutationRateRaw, setKrasMutationRateRaw] = useState(
    String(Math.round(reportData.defaults.krasMutationRate * 100))
  );
  const [annualDrugPriceRaw, setAnnualDrugPriceRaw] = useState(
    String(reportData.defaults.annualDrugPrice)
  );
  const [usRevenueShareRaw, setUsRevenueShareRaw] = useState(
    String(Math.round(reportData.defaults.usRevenueShare * 100))
  );

  function set(key: keyof Params, value: number) {
    setParams((p) => ({ ...p, [key]: value }));
  }

  function reset() {
    setParams(reportData.defaults);
    setSecondLineEnabled(false);
    setSecondLineRateRaw(String(Math.round(reportData.defaults.secondLineRate * 100)));
    setAnnualIncidenceRaw(String(reportData.defaults.annualIncidence));
    setMetastaticRateRaw(String(Math.round(reportData.defaults.metastaticRate * 100)));
    setKrasMutationRateRaw(String(Math.round(reportData.defaults.krasMutationRate * 100)));
    setAnnualDrugPriceRaw(String(reportData.defaults.annualDrugPrice));
    setUsRevenueShareRaw(String(Math.round(reportData.defaults.usRevenueShare * 100)));
  }

  const eligiblePatients = Math.round(
    params.annualIncidence *
      params.metastaticRate *
      params.krasMutationRate *
      (secondLineEnabled ? params.secondLineRate : 1)
  );
  const peakUsSales =
    eligiblePatients * params.peakMarketShare * params.annualDrugPrice;
  const peakGlobalSales = peakUsSales / params.usRevenueShare;

  return (
    <div className="space-y-12">
      {/* ── Section 1: Executive Summary ── */}
      <section>
        <h2 className="text-xl font-semibold text-dark pb-2 border-b border-border mb-5">
          Executive Summary
        </h2>
        <div className="bg-bg2 border border-border rounded-lg p-6 text-body leading-[1.7] space-y-3">
          <p>
            This is an independent peak sales estimate for{" "}
            <strong className="text-dark">daraxonrasib (RMC-6236)</strong> in pancreatic
            ductal adenocarcinoma (PDAC), constructed from publicly available epidemiology,
            pricing, and market share data. The central estimate is{" "}
            <strong className="text-dark">$5.3B peak annual global sales</strong>, which
            sits at the lower end of the analyst consensus range of $5–7.6B.
          </p>
          <p>
            The estimate includes a few higher-uncertainty inputs (i.e., market share,
            drug price, US share of global revenue), most notably a{" "}
            <strong className="text-dark">55% peak market share assumption</strong>{" "}
            which carries a wide range of plausible values given the multi-dimensional launch 
            success dynamics that can lead to considerably different market share outcomes.
          </p>
          <p>
            All input parameters are adjustable in the interactive calculator in
            Section 3. Output figures update in real time as parameters are changed.
            Model parameters can be reset to the default values at any time.
          </p>
        </div>
      </section>

      {/* ── Section 2: Analyst Benchmark Table ── */}
      <section>
        <h2 className="text-xl font-semibold text-dark pb-2 border-b border-border mb-5">
          Analyst Benchmark Estimates
        </h2>
        <div className="overflow-x-auto rounded-lg border border-border mb-4">
          <table className="w-full text-sm">
            <thead className="bg-accent text-white">
              <tr>
                {["Source", "Estimate", "Scope"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.analystEstimates.map((row, i) => (
                <tr
                  key={i}
                  className={`border-t border-border ${i % 2 === 1 ? "bg-bg2" : ""}`}
                >
                  <td className="px-4 py-2.5 text-body font-medium">
                    {row.source}<Cite n={i + 1} />
                  </td>
                  <td className="px-4 py-2.5 text-dark font-semibold">{row.figure}</td>
                  <td className="px-4 py-2.5 text-body">{row.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BenchmarkCallout */}
        <div className="flex gap-3 bg-lime/10 border border-lime/40 rounded-lg px-4 py-3 mb-3">
          <div className="w-1 rounded-full bg-lime shrink-0" />
          <div>
            <p className="text-sm font-semibold text-dark mb-0.5">
              Consensus tendency: ~$7B global peak annual sales
            </p>
            <p className="text-sm text-body">
              Evercore ISI ($7.4B)<Cite n={1} /> and Leerink Partners ($7.6B)<Cite n={2} />,
              both covering all or 1–2L metastatic PDAC, cluster around a central tendency
              of approximately $7B. The RBC Capital Markets estimate ($5B+)<Cite n={4} /> is
              US-only and would be materially higher on a global basis.
            </p>
          </div>
        </div>
        <p className="text-xs text-muted">
          All figures represent peak annual sales estimates, not lifetime revenue or total
          addressable market.
        </p>
      </section>

      {/* ── Section 3: Interactive Calculator ── */}
      <section>
        <div className="flex items-end justify-between pb-2 border-b border-border mb-5">
          <h2 className="text-xl font-semibold text-dark">
            Interactive Peak Sales Calculator
          </h2>
          <button
            onClick={reset}
            className="text-sm font-medium px-5 py-2 rounded bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            Reset to Defaults
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Inputs + Calculation Chain */}
          <div className="space-y-4">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide">
              Input Parameters
            </p>

            <div className="bg-bg2 border border-border rounded-lg p-4">
              <label className="block text-sm font-medium text-dark mb-1">
                Annual PDAC Incidence
              </label>
              <p className="text-xs text-muted mb-2 leading-[1.5]">
                Annual incidence calculated as: 67,530 pancreatic cancer cases<Cite n={6} /><Cite n={7} /> × 90% PDAC
                histological proportion<Cite n={8} /> ≈ 61,000
              </p>
              <input
                type="text"
                inputMode="numeric"
                value={annualIncidenceRaw}
                onChange={(e) => {
                  setAnnualIncidenceRaw(e.target.value);
                  const n = Number(e.target.value);
                  if (e.target.value !== "" && !isNaN(n) && n >= 0) {
                    set("annualIncidence", n);
                  }
                }}
                onBlur={() => setAnnualIncidenceRaw(String(params.annualIncidence))}
                className={inputBase}
              />
              <p className="text-xs text-muted mt-1.5">
                Source: SEER 2026<Cite n={6} /> · ACS 2025<Cite n={7} /> · Park et al 2021<Cite n={8} />
              </p>
            </div>

            <div className="bg-bg2 border border-border rounded-lg p-4">
              <label className="block text-sm font-medium text-dark mb-1.5">
                Metastatic Patients (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={metastaticRateRaw}
                  onChange={(e) => {
                    setMetastaticRateRaw(e.target.value);
                    const n = Number(e.target.value);
                    if (e.target.value !== "" && !isNaN(n) && n >= 0 && n <= 100) {
                      set("metastaticRate", n / 100);
                    }
                  }}
                  onBlur={() => setMetastaticRateRaw(String(Math.round(params.metastaticRate * 100)))}
                  className={inputBase}
                />
                <span className="text-sm text-muted shrink-0">%</span>
              </div>
              <p className="text-xs text-muted mt-1.5">
                Source: Park et al 2021<Cite n={8} />
              </p>
            </div>

            <div className="bg-bg2 border border-border rounded-lg p-4">
              <label className="block text-sm font-medium text-dark mb-1.5">
                KRAS Mutation Rate in PDAC (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={krasMutationRateRaw}
                  onChange={(e) => {
                    setKrasMutationRateRaw(e.target.value);
                    const n = Number(e.target.value);
                    if (e.target.value !== "" && !isNaN(n) && n >= 0 && n <= 100) {
                      set("krasMutationRate", n / 100);
                    }
                  }}
                  onBlur={() => setKrasMutationRateRaw(String(Math.round(params.krasMutationRate * 100)))}
                  className={inputBase}
                />
                <span className="text-sm text-muted shrink-0">%</span>
              </div>
              <p className="text-xs text-muted mt-1.5">
                Source: Lennerz &amp; Stenzinger 2015<Cite n={9} />
              </p>
            </div>

            <div className="bg-bg2 border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-dark">
                  PDAC Patients Progressing to 2L (%)
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted">{secondLineEnabled ? "ON" : "OFF"}</span>
                  <button
                    role="switch"
                    aria-checked={secondLineEnabled}
                    onClick={() => setSecondLineEnabled((v) => !v)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 ${
                      secondLineEnabled ? "bg-accent" : "bg-muted/40"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                        secondLineEnabled ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted mb-2 leading-[1.5]">
                Daraxonrasib is likely to be approved in both 1L and 2L at the time of peak
                sales (keep this set to <strong className="text-dark">OFF</strong>), but the
                portion of patients eligible for 2L can be factored in to test a scenario
                where only 2L approval is achieved (turn this{" "}
                <strong className="text-dark">ON</strong>).
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={secondLineRateRaw}
                  onChange={(e) => {
                    setSecondLineRateRaw(e.target.value);
                    const n = Number(e.target.value);
                    if (e.target.value !== "" && !isNaN(n) && n >= 0 && n <= 100) {
                      set("secondLineRate", n / 100);
                    }
                  }}
                  onBlur={() =>
                    setSecondLineRateRaw(
                      String(Math.round(params.secondLineRate * 100))
                    )
                  }
                  disabled={!secondLineEnabled}
                  className={`${inputBase} ${!secondLineEnabled ? "opacity-40 cursor-not-allowed" : ""}`}
                />
                <span className="text-sm text-muted shrink-0">%</span>
              </div>
              <p className="text-xs text-muted mt-1.5">Source: King et al 2022<Cite n={10} /></p>
            </div>

            <div className="bg-bg2 border border-border rounded-lg p-4">
              <label className="block text-sm font-medium text-dark mb-2">
                Peak Market Share:{" "}
                <span className="text-accent font-semibold">
                  {fmtPct(params.peakMarketShare)}
                </span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(params.peakMarketShare * 100)}
                onChange={(e) =>
                  set("peakMarketShare", Number(e.target.value) / 100)
                }
                className="w-full"
                style={{ accentColor: "#026370" }}
              />
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>0%</span>
                <span>40% — conservative</span>
                <span>70% — bullish</span>
                <span>100%</span>
              </div>
              <p className="text-xs text-muted mt-1.5">
                Source: McKinsey 2014<Cite n={11} />
              </p>
            </div>

            <div className="bg-bg2 border border-border rounded-lg p-4">
              <label className="block text-sm font-medium text-dark mb-1.5">
                Annual Drug Price (USD)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted shrink-0">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={annualDrugPriceRaw}
                  onChange={(e) => {
                    setAnnualDrugPriceRaw(e.target.value);
                    const n = Number(e.target.value);
                    if (e.target.value !== "" && !isNaN(n) && n >= 0) {
                      set("annualDrugPrice", n);
                    }
                  }}
                  onBlur={() => setAnnualDrugPriceRaw(String(params.annualDrugPrice))}
                  className={inputBase}
                />
              </div>
              <p className="text-xs text-muted mt-1.5">
                Source: Miljković et al 2023<Cite n={12} /> · Roskoski 2024<Cite n={13} />
              </p>
            </div>

            <div className="bg-bg2 border border-border rounded-lg p-4">
              <label className="block text-sm font-medium text-dark mb-1.5">
                US Share of Global Revenue (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={usRevenueShareRaw}
                  onChange={(e) => {
                    setUsRevenueShareRaw(e.target.value);
                    const n = Number(e.target.value);
                    if (e.target.value !== "" && !isNaN(n) && n >= 0 && n <= 100) {
                      set("usRevenueShare", n / 100);
                    }
                  }}
                  onBlur={() => setUsRevenueShareRaw(String(Math.round(params.usRevenueShare * 100)))}
                  className={inputBase}
                />
                <span className="text-sm text-muted shrink-0">%</span>
              </div>
              <p className="text-xs text-muted mt-1.5">
                Source: Ramagopalan 2025<Cite n={14} /> · Goldman &amp; Lakdawalla 2018<Cite n={15} />
              </p>
            </div>

            {/* Calculation chain — left column */}
            <div className="border border-border rounded-lg p-4 space-y-1.5 text-xs text-muted">
              <p className="font-medium text-body mb-2">Calculation chain</p>
              <p>
                <span className="font-semibold text-dark mr-1.5">1.</span>
                Eligible patients = Incidence × Metastatic rate × KRAS rate
                {secondLineEnabled && (
                  <span className="text-accent font-medium"> × 2L rate</span>
                )}
              </p>
              <p>
                <span className="font-semibold text-dark mr-1.5">2.</span>
                US Revenue = Eligible patients × Market share × Annual price
              </p>
              <p>
                <span className="font-semibold text-dark mr-1.5">3.</span>
                Global Revenue = US Revenue ÷ US Revenue Share
              </p>
            </div>
          </div>

          {/* Right: Live Outputs */}
          <div className="space-y-4">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide">
              Live Outputs
            </p>

            <div className="bg-bg2 border border-border rounded-lg p-5">
              <p className="text-xs text-muted uppercase tracking-wide mb-1">
                Annual Eligible Patient Population
              </p>
              <p className="text-3xl font-bold text-dark tabular-nums">
                {eligiblePatients.toLocaleString()}
              </p>
              <p className="text-xs text-muted mt-2">
                Incidence × Metastatic rate × KRAS rate
                {secondLineEnabled && (
                  <span className="text-accent font-medium"> × 2L rate</span>
                )}
              </p>
            </div>

            <div className="bg-bg2 border border-border rounded-lg p-5">
              <p className="text-xs text-muted uppercase tracking-wide mb-1">
                Peak Annual US Sales
              </p>
              <p className="text-3xl font-bold text-accent tabular-nums">
                {fmt$(peakUsSales)}
              </p>
              <p className="text-xs text-muted mt-2">
                Eligible patients × Market share × Annual price
              </p>
            </div>

            <div className="bg-dark rounded-lg p-5">
              <p className="text-xs text-white/60 uppercase tracking-wide mb-1">
                Peak Annual Global Sales
              </p>
              <p className="text-4xl font-bold text-lime tabular-nums">
                {fmt$(peakGlobalSales)}
              </p>
              <p className="text-xs text-white/50 mt-2">US sales ÷ US revenue share</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Scenario Table ── */}
      <section>
        <h2 className="text-xl font-semibold text-dark pb-2 border-b border-border mb-5">
          Scenario Analysis
        </h2>
        <p className="text-sm text-body mb-4">
          The market share assumption carries some of the highest uncertainty across datapoints in this
          model and is highly impactful on the peak revenue estimate; the
          table below ranges from conservative to bullish scenarios to illustrate the range
          of output this parameter drives, with all other inputs held at their default
          values. With high unmet need and a currently sparse treatment landscape in metastatic PDAC,
          more bullish estimates of daraxonrasib's market share are plausible, especially when
          taking into account the strong efficacy data emerging from clinical trial readouts. A bullish
          70% market share estimate brings the peak revenue figure more in line with the mean value from 
          analyst estimates.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border mb-3">
          <table className="w-full text-sm">
            <thead className="bg-accent text-white">
              <tr>
                {[
                  "Scenario",
                  "Market Share Assumption",
                  "Peak Annual Global Sales",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.scenarios.map((row, i) => (
                <tr
                  key={i}
                  className={`border-t border-border ${i % 2 === 1 ? "bg-bg2" : ""}`}
                >
                  <td className="px-4 py-2.5 font-medium text-body">{row.scenario}</td>
                  <td className="px-4 py-2.5 text-body">{fmtPct(row.marketShare)}</td>
                  <td className="px-4 py-2.5 font-semibold text-dark">
                    {fmt$(row.peakGlobalSales)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted">
          Market share is a high sensitivity assumption in the model — a 15-point
          shift in either direction produces a ~$2.3B swing in peak global sales.
        </p>
      </section>

      {/* ── Section 5: Assumptions Accordion ── */}
      <section>
        <h2 className="text-xl font-semibold text-dark pb-2 border-b border-border mb-5">
          Assumptions
        </h2>
        <div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
          {accordionRows.map((row, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(prev => { const next = new Set(prev); next.has(i) ? next.delete(i) : next.add(i); return next; })}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-bg2 transition-colors gap-4"
              >
                <div className="flex items-baseline gap-3 min-w-0">
                  <span className="text-sm font-medium text-dark shrink-0">
                    {row.name}
                  </span>
                  <span className="text-sm font-semibold text-accent shrink-0">
                    {row.value}
                  </span>
                  <span className="text-xs text-muted truncate">{row.source}</span>
                </div>
                <span className="text-muted text-base shrink-0">
                  {open.has(i) ? "−" : "+"}
                </span>
              </button>
              {open.has(i) && (
                <div className="px-4 pb-4 pt-3 bg-bg2 text-sm text-body leading-[1.7] border-t border-border">
                  <p>{row.rationale}</p>
                  {row.footnote && (
                    <p className="mt-2 text-xs text-muted italic">{row.footnote}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 6: Limitations Callout ── */}
      <section>
        <h2 className="text-xl font-semibold text-dark pb-2 border-b border-border mb-5">
          Limitations
        </h2>
        <div className="border-l-4 border-accent rounded-r-lg bg-bg2 px-6 py-5">
          <ul className="space-y-3 text-sm text-body leading-[1.7]">
            <li>
              <strong className="text-dark">Directional estimate only.</strong> This is a
              an estimate using publicly available data and is not a formal
              valuation or investment analysis.
            </li>
            <li>
              <strong className="text-dark">
                Market share capture carries some of the widest uncertainty range.
              </strong>{" "}
              The market share assumption is a key driver of variance in the output.
              The scenario table in Section 4 illustrates this sensitivity.
            </li>
            <li>
              <strong className="text-dark">
                Analyst consensus is the primary external reference.
              </strong>{" "}
              The sell-side consensus of $5–7.6B reflects proprietary models and should be
              treated as the primary benchmark. Our estimate of $5.3B sits at the lower end
              of this range, consistent with the 55% market share midpoint assumption and
              a metastatic-only patient population.
            </li>
          </ul>
        </div>
      </section>

      <SourcesList sources={sourcesData} />
    </div>
  );
}
