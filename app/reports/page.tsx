import Link from "next/link";
import { getAllReportMetas } from "@/lib/reports";

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
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-sage/30 text-body rounded capitalize">
                    {report.scope_type.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded capitalize ${
                      report.report_type === "scheduled"
                        ? "bg-accent/10 text-accent"
                        : "bg-lime/30 text-dark"
                    }`}
                  >
                    {report.report_type}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">
                  {report.delivery_date}
                </td>
                <td className="px-4 py-3 text-body">{report.analyst.name}</td>
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-lime text-dark rounded capitalize">
                    {report.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
