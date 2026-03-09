import Link from "next/link";
import { getDashboardData, getAllReportMetas } from "@/lib/reports";

function StatusBadge({ status }: { status: string }) {
  if (status === "new_report") {
    return (
      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-lime text-dark rounded">
        New report
      </span>
    );
  }
  if (status === "coming_soon") {
    return (
      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-border text-muted rounded">
        Coming soon
      </span>
    );
  }
  return (
    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-sage/30 text-body rounded">
      Up to date
    </span>
  );
}

function ScopeBadge({ type }: { type: string }) {
  const label = type.replace("_", " ");
  return (
    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-sage/30 text-body rounded capitalize">
      {label}
    </span>
  );
}

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

export default function Dashboard() {
  const dashboard = getDashboardData();
  const reports = getAllReportMetas();

  return (
    <div className="p-8 max-w-6xl">
      {/* Greeting */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-dark">
          Good morning, Zach
        </h2>
        <p className="text-body mt-1">March 9, 2026</p>
      </div>

      {/* Monitored Targets */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold text-dark mb-4">
          Monitored Targets
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {dashboard.monitored_targets.map((target) => (
            <div
              key={target.target}
              className={`bg-bg2 border border-border rounded-lg p-5 ${
                target.active ? "" : "opacity-50"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-base font-semibold text-dark">
                  {target.target}
                </h4>
                <StatusBadge status={target.status} />
              </div>
              <div className="space-y-1 text-sm text-body">
                <p>{target.tracked_drugs} drugs tracked</p>
                <p>{target.tracked_indications} indications</p>
                {target.last_report_date && (
                  <p className="text-muted text-xs mt-2">
                    Last report: {target.last_report_date}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Reports */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold text-dark mb-4">
          Recent Reports
        </h3>
        <div className="bg-bg2 border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-accent text-white">
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Scope</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Delivered</th>
                <th className="text-left px-4 py-3 font-medium">Analyst</th>
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
                    <ScopeBadge type={report.scope_type} />
                  </td>
                  <td className="px-4 py-3">
                    <TypeBadge type={report.report_type} />
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {report.delivery_date}
                  </td>
                  <td className="px-4 py-3 text-body">
                    {report.analyst.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Upcoming + CTA */}
      <div className="flex items-start justify-between">
        <section>
          <h3 className="text-lg font-semibold text-dark mb-2">
            Upcoming Reports
          </h3>
          <p className="text-sm text-body">
            TNF-alpha Landscape — next delivery:{" "}
            <span className="font-medium text-dark">March 17, 2026</span>
          </p>
        </section>

        <Link
          href="/commission"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-lime text-dark font-semibold text-sm rounded-lg hover:bg-lime/80 transition-colors"
        >
          Commission a Report
        </Link>
      </div>
    </div>
  );
}
