# Report Data Format — Quick Guide for Batu

Hey Batu — this explains how report data is structured in the MVP prototype so you can convert your TNF-alpha brief into the right format. Everything lives in a single directory per report, with four files.

---

## Directory Structure

Your report goes in a folder under `data/reports/`. The folder name is a slugified version of the report — for the TNF-alpha report, it's:

```
data/reports/tnf-alpha-landscape-2026-03-10/
├── meta.json           # Report metadata (title, analyst, scope, dates)
├── content.mdx         # The actual report body (markdown + custom components)
├── sources.json        # Citation index — every source document referenced in the report
└── qa-fallback.json    # Pre-seeded Q&A pairs for the chat (backup if API is down)
```

---

## File 1: `meta.json`

This is the report's identity card. The dashboard and report list pages pull from this. Here's the schema:

```json
{
  "id": "rpt_tnf_alpha_2026_03_10",
  "title": "TNF-Alpha Target Area — Market Access Landscape",
  "scope_type": "target_area",
  "scope_value": "TNF-alpha",
  "report_type": "scheduled",
  "delivery_date": "2026-03-10",
  "analyst": {
    "name": "Nim Telson",
    "title": "Senior Market Access Analyst",
    "credentials": "PharmD, MBA"
  },
  "status": "delivered",
  "next_scheduled": "2026-03-17",
  "drugs_covered": ["adalimumab", "etanercept", "infliximab", "certolizumab", "golimumab"],
  "indications_covered": ["Rheumatoid Arthritis", "Plaque Psoriasis", "Crohn's Disease", "Ulcerative Colitis", "Ankylosing Spondylitis"],
  "payers_covered": ["Aetna", "UnitedHealthcare", "Cigna", "Anthem/Elevance", "Humana"],
  "tags": ["biosimilar dynamics", "formulary shift", "step therapy", "interchangeability"]
}
```

The `drugs_covered`, `indications_covered`, and `payers_covered` arrays don't need to be exhaustive — they're used for display on the dashboard cards and for search/filtering. Include the major ones.

---

## File 2: `content.mdx`

This is the report body. It's **MDX**, which means standard markdown plus a few custom React components you can use inline. Write it like a normal markdown document, but you have three special components available:

**`<DataTable>`** — for structured tables (like the therapeutic landscape table). You pass it a `columns` array of objects and a `data` array of objects:

```mdx
<DataTable
  columns={[
    { key: "drug", label: "Drug" },
    { key: "manufacturer", label: "Manufacturer" },
    { key: "event_date", label: "Event Date" }
  ]}
  data={[
    { drug: "XPro1595", manufacturer: "INmune Bio", event_date: "2026-02-12" },
    { drug: "SOR102", manufacturer: "Sorriso Pharma", event_date: "2026-01-14" }
  ]}
/>
```

**`<BenchmarkCallout>`** — for highlighting a key threshold or data point. These render as styled cards with a lime left-border:

```mdx
<BenchmarkCallout
  title="RA Step Therapy Threshold"
  value="Fail-first through preferred biosimilar"
  confidence="high"
  description="4 of 5 major commercial payers now require step therapy through a preferred adalimumab biosimilar before covering originator Humira in RA."
/>
```

**`<CitationMarker>`** — an inline reference to a source. It renders as a small superscript like [1] and shows source details on hover. The `id` must match an entry in `sources.json`:

```mdx
Aetna updated its formulary in January 2026 to prefer Hadlima over Humira across all TNF-alpha indications.<CitationMarker id="src_aetna_formulary_2026" />
```

**If you're not sure about the components, just write plain markdown.** We can add the components later. The important thing is that the content structure follows this exact section order:

---

### 1. `## Executive Summary`

Contains two subsections in this order:

**`### Period Highlights`**
A bullet list pulled directly from the snapshot/key events bullets in the source brief. The brief organizes these bullets into categories based on the type of TNF-alpha targeting molecule involved (e.g. selective sTNF inhibitors, conventional anti-TNF biologics, repurposed agents, etc.). Preserve this categorization exactly — use a **bold label** on its own line for each molecule category as it appears in the brief, and list the relevant event bullets beneath it. Each bullet should be one concise sentence. Do not use `####` headers for these category labels and do not flatten the bullets into a single undifferentiated list. Bold labels are preferred over headers here to avoid deep header nesting that may cause UI rendering issues.

**`### Overview`**
After the Period Highlights bullets, include a prose section that opens with a short paragraph identifying each category of TNF-alpha targeting molecule represented in the report (matching the same categories used in Period Highlights). For each molecule category, write 3–5 sentences covering: how that class of molecule mechanistically modulates TNF-alpha (e.g. neutralizes soluble TNF, blocks both sTNF and tmTNF, inhibits upstream NF-κB signaling, etc.), what therapeutic outcome that mechanism is intended to produce, and the key trade-offs of that approach — its advantages over traditional TNF inhibitors and other molecule classes, and its limitations or risks. This section should give the reader a clear mechanistic map of the TNF-alpha modulation landscape before they enter the deeper report content. Follow this with the original executive summary narrative paragraphs from the brief as they are, after the molecule category overviews.

---

### 2. `## Therapeutic Landscape Table`

A `<DataTable>` component with one row per drug or event covered in the report. Columns must match exactly those present in the source Word document, plus one additional column: **"Event Date"** (the date of the clinical event, regulatory milestone, or publication). Use the `columns` / `data` object format shown above.

---

### 3. `## Indication Deep-Dive`

Two parts, in order:

**Part 1 — Indication Index**
A simple bullet list of indication names only — no descriptions, no drug names, no data. This is purely a navigational list of every indication covered in the sections that follow. Example:

```mdx
- Alzheimer's Disease
- Ulcerative Colitis
- Rheumatoid Arthritis
- Non-infectious Uveitis
```

**Part 2 — Per-Indication Deep Sections**
A `###` header for each indication. Under each, cover: relevant drug(s) and mechanism, trial design and population, and key results. Use `<BenchmarkCallout>` for key quantitative highlights and `<CitationMarker>` for inline citations.

---

### 4. `## Competitive Intelligence Highlights`

Numbered `###` subsections, one per strategic observation. Each should draw a competitive or market implication from the period's events rather than simply restating trial results. Use `<CitationMarker>` where relevant.

---

### 5. `## Methodology and Sources`

A short prose section (~150–200 words) covering: reporting period date range, research approach (primary literature, regulatory filings, company disclosures), scope limitations, and analyst attribution. Use `<CitationMarker>` where relevant.

---

### 6. `## References`

A numbered list of all sources cited in the report. Each entry should follow this format:

```mdx
<span id="ref-1"></span>**[1]** "Title of Source." *Organization / Journal*, Date.
[Link](https://doi.org/...)
```

**Important:** When generating a new `content.mdx`, always read the existing file first and carry over all existing reference entries verbatim — do not modify or regenerate any reference entry that already exists, including its URL. If the new brief introduces sources not already in the References section, append those new entries at the end following the same format. Never rewrite or invent URLs for references that already exist in the file.

---

## File 3: `sources.json`

This is the citation index. Every source you reference in the report needs an entry here. Each entry has a unique `id` (which is what `<CitationMarker id="...">` points to), plus metadata and — importantly — a `content` field with a relevant excerpt from the source document. The chat feature uses these excerpts to answer questions that go deeper than the report narrative.

```json
[
  {
    "id": "src_aetna_formulary_2026",
    "title": "Aetna Pharmacy Clinical Policy: TNF Inhibitors",
    "organization": "Aetna / CVS Health",
    "document_type": "payer_policy",
    "date": "2026-01-15",
    "url": "https://www.aetna.com/cpb/medical/data/example",
    "content": "A few hundred words of relevant text excerpted from this source. This is what the Q&A chat uses for grounding when someone asks a specific question about this source. Include the most relevant passages — coverage criteria, step therapy language, formulary tier details, whatever is cited or could be asked about. You don't need the full document, just the parts that matter for the report's claims."
  },
  {
    "id": "src_humira_pi_2025",
    "title": "HUMIRA (adalimumab) Prescribing Information",
    "organization": "AbbVie",
    "document_type": "package_insert",
    "date": "2025-08-01",
    "url": "https://www.accessdata.fda.gov/example",
    "content": "Relevant excerpts from the prescribing information — approved indications, dosing, key safety information."
  }
]
```

Aim for **at least 10 sources** spanning payer policies (3–4), FDA labels/package inserts (2–3), clinical publications (2–3), and formulary bulletins or industry reports (1–2). The `content` field for each should be a few hundred words — enough that the chat can quote from it meaningfully.

---

## File 4: `qa-fallback.json`

Pre-seeded question-and-answer pairs. These are the backup if the live Claude API isn't available. Each pair has a `keywords` array (used for matching incoming user questions) and a substantive answer:

```json
[
  {
    "question": "Which payers have the most restrictive step therapy for Humira biosimilars in RA?",
    "keywords": ["step therapy", "biosimilar", "humira", "RA", "restrictive"],
    "answer": "Based on our analysis of the top 5 commercial payers, Aetna and UnitedHealthcare have the most restrictive step therapy protocols for adalimumab biosimilars in RA. Both require documented failure of at least one preferred biosimilar (Hadlima for Aetna, Hyrimoz for UHC) before covering originator Humira. [Aetna Policy #0123] [UHC Policy #0456]. Cigna and Anthem take a softer approach, preferring biosimilars through tier placement but not mandating fail-first step therapy."
  }
]
```

Aim for **5–8 pairs** covering the kinds of questions Zach would naturally ask during the demo. Think about: payer-specific questions, drug comparison questions, "what would it take for a new entrant" questions, and at least one question that falls outside the report's scope (so the answer can suggest commissioning a custom report).

---

## Converting Your Brief with Claude Code

If you've already written the brief as a regular document (Word, Google Doc, plain text, whatever), here are prompts you can paste into Claude Code to convert it into the right format. Run these from the project root directory.

### Prompt 1: Generate `meta.json` from your brief

```
Read my brief at [path to your file]. Generate a meta.json file for this report following this exact schema: [paste the meta.json example from above]. The report ID should be rpt_tnf_alpha_2026_03_10, scope_type is "target_area", scope_value is "TNF-alpha". Extract the drugs, indications, and payers mentioned in the brief to populate the covered arrays. Write the output to data/reports/tnf-alpha-landscape-2026-03-10/meta.json.
```

### Prompt 2: Convert the brief body to MDX

```
Read my brief at [path to your file]. Before generating anything, also read the existing file at data/reports/tnf-alpha-landscape-2026-03-10/content.mdx and extract every entry in the ## References section verbatim — you will carry these over unchanged into the new file.

Convert the brief into an MDX file for our report viewer using these custom components:

- <DataTable columns={[...]} data={[...]} /> for any tabular data
- <BenchmarkCallout title="..." value="..." confidence="high|medium|low" description="..." /> for key thresholds and data highlights
- <CitationMarker id="src_..." /> inline wherever a source is referenced

The report must follow this exact section structure:

1. ## Executive Summary
   - ### Period Highlights — a bullet list pulled directly from the snapshot/key events bullets in the brief. The brief organizes these bullets into categories based on the type of TNF-alpha targeting molecule involved (e.g. selective sTNF inhibitors, conventional anti-TNF biologics, repurposed agents, etc.). Preserve this categorization exactly: use a **bold label** on its own line for each molecule category as it appears in the brief, and list the relevant one-sentence event bullets beneath it. Do not use #### headers for these category labels and do not flatten the bullets into a single undifferentiated list.
   - ### Overview — open with a short paragraph identifying each category of TNF-alpha targeting molecule represented in the report (matching the same categories used in Period Highlights). For each molecule category, write 3–5 sentences covering: how that class mechanistically modulates TNF-alpha (e.g. neutralizes soluble TNF, blocks both sTNF and tmTNF, inhibits upstream NF-κB signaling, etc.), what therapeutic outcome that mechanism is intended to produce, and the key trade-offs — its advantages over traditional TNF inhibitors and other molecule classes, and its limitations or risks. Follow this mechanistic map with the original executive summary narrative paragraphs from the brief, as they are. Prose throughout, no bullets.

2. ## Therapeutic Landscape Table — a <DataTable> with one row per drug/event. Columns must match exactly those in the source Word document, plus one additional column: "Event Date" (the date of the clinical event, regulatory milestone, or publication).

3. ## Indication Deep-Dive — two parts in order:
   - First: a plain bullet list of indication names only (no descriptions, no drug names, no data) — a navigational index of every indication covered below.
   - Then: a ### section per indication covering relevant drug(s) and mechanism, trial design and population, and key results. Use <BenchmarkCallout> for key quantitative highlights and <CitationMarker> for inline citations.

4. ## Competitive Intelligence Highlights — unchanged from current spec. Numbered ### subsections drawing strategic and competitive implications from the period's events.

5. ## Methodology and Sources — unchanged from current spec. Short prose covering reporting period, research approach, scope limitations, and analyst attribution.

6. ## References — carry over every existing reference entry from the file you read in step 1, verbatim, with no changes to text or URLs. If the new brief contains sources not already present in that list, append them at the end following the same format: <span id="ref-N"></span>**[N]** "Title." *Organization*, Date. [Link](url)

Use source IDs following the pattern src_[org]_[type]_[year] (e.g., src_aetna_formulary_2026). Write the output to data/reports/tnf-alpha-landscape-2026-03-10/content.mdx.
```

### Prompt 3: Generate `sources.json` from the MDX

```
Read the MDX file at data/reports/tnf-alpha-landscape-2026-03-10/content.mdx. Find every <CitationMarker id="..." /> in the file and collect all the source IDs. For each source ID, generate a sources.json entry with realistic metadata (title, organization, document_type, date, url) and a content field containing a few hundred words of relevant excerpted text that supports whatever claim the citation is attached to in the report. The content should be realistic and specific enough that a Q&A chatbot could use it to answer follow-up questions about that source.

Write the output to data/reports/tnf-alpha-landscape-2026-03-10/sources.json.
```

### Prompt 4: Generate Q&A fallback pairs

```
Read the report at data/reports/tnf-alpha-landscape-2026-03-10/content.mdx and the sources at data/reports/tnf-alpha-landscape-2026-03-10/sources.json. Generate 6-8 realistic Q&A pairs that an investment analyst monitoring TNF-alpha would ask. Each pair needs a question, a keywords array for matching, and a substantive answer (100-200 words) that cites specific sections or sources from the report. Include at least one question whose answer should say "this falls outside the current report's scope" and suggest commissioning a custom report.

Write the output to data/reports/tnf-alpha-landscape-2026-03-10/qa-fallback.json.
```

---

## Tips

The `content` field in `sources.json` is the most important thing to get right after the report body itself. The Q&A chat is only as good as the context it has. If someone asks "what does the Aetna policy actually say about step therapy for biosimilars in RA?" and the source content field just says "Aetna formulary update, January 2026" — the chat can't answer. Give it real (or realistic) policy language to work with.

When in doubt, write more content and we'll trim. It's much easier to cut than to backfill.
