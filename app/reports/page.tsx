import { getAllReportMetas } from "@/lib/reports";
import Link from "next/link";

function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium rounded capitalize ${
        type === "scheduled"
          ? "bg-accent/10 text-accent"
          : "bg-lime/30 text-dark"
      }`}
    >
      {type}
    </span>
  );
}

const pastReports = [
  {
    title: "TNF-Alpha Target Area — Market Access Landscape",
    scope: "TNF-alpha",
    type: "scheduled",
    date: "2026-02-24",
    analyst: "Batu Akkas",
    status: "read",
  },
  {
    title: "TNF-Alpha Target Area — Market Access Landscape",
    scope: "TNF-alpha",
    type: "scheduled",
    date: "2026-02-10",
    analyst: "Batu Akkas",
    status: "read",
  },
  {
    title:
      "Biosimilar Formulary Dynamics in Psoriasis — Top 10 Commercial Plans",
    scope: "TNF-alpha",
    type: "custom",
    date: "2026-02-03",
    analyst: "Batu Akkas",
    status: "read",
  },
  {
    title: "TNF-Alpha Target Area — Market Access Landscape",
    scope: "TNF-alpha",
    type: "scheduled",
    date: "2026-01-27",
    analyst: "Batu Akkas",
    status: "read",
  },
  {
    title: "TNF-Alpha Target Area — Market Access Landscape",
    scope: "TNF-alpha",
    type: "scheduled",
    date: "2026-01-13",
    analyst: "Batu Akkas",
    status: "read",
  },
];

export default function ReportsPage() {
  const reports = getAllReportMetas();

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
            {pastReports.map((report, i) => {
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
