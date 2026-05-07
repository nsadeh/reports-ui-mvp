import { getAllReportMetas } from "@/lib/reports";
import { getViewerScope } from "@/lib/auth";
import Link from "next/link";

const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
  scheduled:      { label: "Pipeline",   cls: "bg-blue-100 text-blue-700" },
  Pipeline:       { label: "Pipeline",   cls: "bg-blue-100 text-blue-700" },
  "market-model": { label: "Rev Model",  cls: "bg-rose-100 text-rose-700" },
  Event:          { label: "Event",      cls: "bg-amber-100 text-amber-700" },
  Monitoring:     { label: "Monitoring", cls: "bg-lime/30 text-dark" },
  Regulatory:     { label: "Regulatory", cls: "bg-violet-100 text-violet-700" },
  custom:         { label: "Custom",     cls: "bg-gray-100 text-gray-600" },
};

function TypeBadge({ type }: { type: string }) {
  const { label, cls } = TYPE_BADGE[type] ?? { label: type, cls: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded whitespace-nowrap ${cls}`}>
      {label}
    </span>
  );
}

const pastReports = [
  {
    title: "Alzheimer's Disease: Clinical Trial & Pipeline Intelligence",
    scope: "Alzheimer's Disease",
    type: "scheduled",
    date: "2026-03-01",
    analyst: "Batu Akkas",
    status: "read",
  },
  {
    title: "Alzheimer's Disease: Clinical Trial & Pipeline Intelligence",
    scope: "Alzheimer's Disease",
    type: "scheduled",
    date: "2026-02-15",
    analyst: "Batu Akkas",
    status: "read",
  },
  {
    title: "Alzheimer's Disease: Clinical Trial & Pipeline Intelligence",
    scope: "Alzheimer's Disease",
    type: "scheduled",
    date: "2026-02-01",
    analyst: "Batu Akkas",
    status: "read",
  },
  {
    title: "Alzheimer's Disease: Clinical Trial & Pipeline Intelligence",
    scope: "Alzheimer's Disease",
    type: "scheduled",
    date: "2026-01-15",
    analyst: "Batu Akkas",
    status: "read",
  },
  {
    title: "Alzheimer's Disease: Clinical Trial & Pipeline Intelligence",
    scope: "Alzheimer's Disease",
    type: "scheduled",
    date: "2026-01-01",
    analyst: "Batu Akkas",
    status: "read",
  },
];

export default async function ReportsPage() {
  const scope = await getViewerScope();
  const isCustomer = scope.kind === "customer";
  const allowedIds = scope.kind === "customer" ? scope.allowedReportIds : null;
  const reports = allowedIds
    ? getAllReportMetas().filter((r) => allowedIds.includes(r.id))
    : getAllReportMetas();
  const showPastReports = !isCustomer;

  return (
    <div className="p-8 max-w-6xl">
      <h2 className="text-2xl font-semibold text-dark mb-6">Reports</h2>

      <div className="bg-bg2 border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-accent text-white">
              <th className="text-left px-4 py-3 font-medium">Title</th>
              <th className="text-left px-4 py-3 font-medium">Scope</th>
              <th className="text-left px-4 py-3 font-medium">Type</th>
              <th className="text-left px-4 py-3 font-medium">Delivered</th>
              <th className="text-left px-4 py-3 font-medium">Analyst</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Real clickable reports */}
            {reports.map((report, i) => (
              <tr
                key={report.id}
                className={`border-t border-border ${
                  i % 2 === 1 ? "bg-bg" : ""
                } hover:bg-sage/10 transition-colors`}
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/reports/${report.id}`}
                    className="text-accent font-medium hover:underline"
                  >
                    {report.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-body">{report.scope_value}</td>
                <td className="px-4 py-3">
                  <TypeBadge type={report.report_type} />
                </td>
                <td className="px-4 py-3 text-muted">{report.delivery_date}</td>
                <td className="px-4 py-3 text-body">{report.analyst.name}</td>
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-lime text-dark rounded">
                    New
                  </span>
                </td>
              </tr>
            ))}

            {/* Past editions (unclickable) */}
            {showPastReports && pastReports.map((report, i) => {
              const rowIndex = reports.length + i;
              return (
                <tr
                  key={`past-${i}`}
                  className={`border-t border-border ${
                    rowIndex % 2 === 1 ? "bg-bg" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-body">{report.title}</td>
                  <td className="px-4 py-3 text-body">{report.scope}</td>
                  <td className="px-4 py-3">
                    <TypeBadge type={report.type} />
                  </td>
                  <td className="px-4 py-3 text-muted">{report.date}</td>
                  <td className="px-4 py-3 text-body">{report.analyst}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-bg text-muted rounded capitalize">
                      {report.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
