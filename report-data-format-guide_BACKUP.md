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

**`<DataTable>`** — for structured tables (like the drug landscape table). You pass it a `columns` array and a `data` array:

```mdx
<DataTable
  columns={["Drug (Brand)", "Drug (Generic)", "Manufacturer", "Status", "Access Tier"]}
  data={[
    ["Humira", "adalimumab", "AbbVie", "Originator", "Non-Preferred"],
    ["Hadlima", "adalimumab-bwwd", "Samsung Bioepis", "Biosimilar", "Preferred"],
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

**If you're not sure about the components, just write plain markdown.** We can add the components later. The important thing is that the content structure follows this outline:

1. **Executive Summary** (~400 words)
2. **Target Overview** (~300 words)
3. **Drug Landscape Table** (use `<DataTable>`)
4. **Indication Deep-Dives** — at least RA, Plaque Psoriasis, and IBD, each 400–600 words
5. **Competitive Intelligence Highlights** (~300 words, 3–5 recent events)
6. **Methodology and Sources** (~200 words, including analyst signature)

Use `## Section Title` for major sections and `### Subsection` within indication deep-dives (e.g., `### Payer Access Patterns`).

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
Read my brief at [path to your file]. Convert it into an MDX file for our report viewer. The report should use these custom components:

- <DataTable columns={[...]} data={[...]} /> for any tabular data
- <BenchmarkCallout title="..." value="..." confidence="high|medium|low" description="..." /> for key thresholds and data highlights
- <CitationMarker id="src_..." /> inline wherever a source is referenced

The report must follow this section structure:
1. Executive Summary (## heading)
2. Target Overview (## heading)
3. Drug Landscape Table (## heading, use DataTable component)
4. Indication deep-dives (## heading per indication, ### for subsections)
5. Competitive Intelligence Highlights (## heading)
6. Methodology and Sources (## heading)

Use source IDs that follow the pattern src_[org]_[type]_[year] (e.g., src_aetna_formulary_2026). I'll create the matching sources.json separately.

Write the output to data/reports/tnf-alpha-landscape-2026-03-10/content.mdx.
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
