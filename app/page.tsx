import Link from "next/link";
import {
  getDashboardData,
  getAllReportMetas,
  getTeamData,
  getActivityData,
} from "@/lib/reports";
import type { ActivityEvent, TeamMember } from "@/lib/types";

/* ─── Helpers ─── */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function scopeLabel(type: string) {
  return type === "target_area"
    ? "Target Area"
    : type === "disease_area"
      ? "Disease Area"
      : "Indication";
}

/* ─── Event type config ─── */

const eventConfig: Record<
  string,
  { icon: React.ReactNode; borderColor: string; label: string }
> = {
  report_delivered: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    borderColor: "border-l-lime",
    label: "Report",
  },
  policy_change: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    borderColor: "border-l-accent",
    label: "Policy",
  },
  custom_report_completed: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    borderColor: "border-l-lime",
    label: "Custom Report",
  },
  team_question: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    borderColor: "border-l-sage",
    label: "Team",
  },
  team_commission: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    borderColor: "border-l-sage",
    label: "Team",
  },
  drug_approval: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    borderColor: "border-l-accent",
    label: "Regulatory",
  },
  biosimilar_launch: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    borderColor: "border-l-accent",
    label: "Market",
  },
};

/* ─── Avatar component ─── */

function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  const sizeClass = size === "sm" ? "w-6 h-6 text-[10px]" : "w-7 h-7 text-xs";
  return (
    <span
      className={`${sizeClass} rounded-full bg-sage text-dark font-semibold inline-flex items-center justify-center shrink-0`}
      title={name}
    >
      {initials}
    </span>
  );
}

/* ─── Activity Feed Item ─── */

function FeedItem({ event }: { event: ActivityEvent }) {
  const config = eventConfig[event.event_type] || eventConfig.policy_change;
  const inner = (
    <div
      className={`flex items-start gap-3 px-4 py-3 border-l-3 ${config.borderColor} hover:bg-bg2/80 transition-colors`}
    >
      <span className="text-muted mt-0.5 shrink-0">{config.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text leading-snug">{event.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-muted">{timeAgo(event.timestamp)}</span>
          <span className="text-[11px] text-muted/50">·</span>
          <span className="text-[11px] text-muted font-medium uppercase tracking-wide">
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );

  if (event.link) {
    return (
      <Link href={`/reports/${event.link}`} className="block">
        {inner}
      </Link>
    );
  }
  return inner;
}

/* ─── Main Dashboard ─── */

export default function Dashboard() {
  const dashboard = getDashboardData();
  const reports = getAllReportMetas();
  const team = getTeamData();
  const activity = getActivityData();

  // The hero report: most recent delivered report
  const heroReport = reports
    .filter((r) => r.status === "delivered")
    .sort(
      (a, b) =>
        new Date(b.delivery_date).getTime() -
        new Date(a.delivery_date).getTime()
    )[0];

  // Team members who read the hero report (exclude current user)
  const readByMembers = heroReport?.read_by?.filter((name) => name !== "Zach Morrison") ?? [];

  // Find matching team data for read-by avatars
  const readByTeam = team.filter((t) => readByMembers.includes(t.name));

  return (
    <div className="px-8 py-6 max-w-[960px]">
      {/* Compact header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-baseline gap-3">
          <span className="text-sm font-medium text-dark">Zach</span>
          <span className="text-xs text-muted">March 9, 2026</span>
        </div>
      </div>

      {/* ─── Section A: Briefing Hero ─── */}
      {heroReport && (
        <section className="mb-8">
          <div className="bg-dark rounded-lg overflow-hidden">
            <div className="flex">
              {/* Lime accent stripe */}
              <div className="w-1.5 bg-lime shrink-0" />
              <div className="flex-1 p-6">
                {/* Top row: badge + date */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-block px-2 py-0.5 text-[11px] font-semibold bg-lime text-dark rounded uppercase tracking-wide">
                      New briefing
                    </span>
                    <span className="inline-block px-2 py-0.5 text-[11px] font-medium bg-white/10 text-white/70 rounded">
                      {scopeLabel(heroReport.scope_type)}
                    </span>
                  </div>
                  <span className="text-xs text-white/50">
                    Delivered {formatDate(heroReport.delivery_date)}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-xl font-semibold text-white mb-3 leading-tight">
                  {heroReport.title}
                </h1>

                {/* Executive summary preview */}
                {heroReport.executive_summary_preview && (
                  <p className="text-sm text-white/70 leading-relaxed mb-5 max-w-[680px]">
                    {heroReport.executive_summary_preview}
                  </p>
                )}

                {/* Bottom row: analyst + read-by + CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Analyst */}
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-accent text-white text-xs font-semibold inline-flex items-center justify-center">
                        {heroReport.analyst.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")}
                      </span>
                      <div>
                        <p className="text-xs text-white font-medium">
                          {heroReport.analyst.name}
                        </p>
                        <p className="text-[10px] text-white/40">
                          {heroReport.analyst.title}
                        </p>
                      </div>
                    </div>

                    {/* Read by teammates */}
                    {readByTeam.length > 0 && (
                      <div className="flex items-center gap-1.5 ml-2 pl-4 border-l border-white/10">
                        <span className="text-[10px] text-white/40 mr-1">
                          Read by
                        </span>
                        <div className="flex -space-x-1">
                          {readByTeam.map((member) => (
                            <span
                              key={member.initials}
                              className="w-6 h-6 rounded-full bg-sage text-dark text-[10px] font-semibold inline-flex items-center justify-center ring-2 ring-dark"
                              title={member.name}
                            >
                              {member.initials}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/reports/${heroReport.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-lime text-dark text-sm font-semibold rounded-lg hover:bg-lime/90 transition-colors"
                  >
                    Read Briefing
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Section B: Activity Feed ─── */}
      <section className="mb-8">
        <h2 className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-3">
          Recent Activity
        </h2>
        <div className="bg-bg2 border border-border rounded-lg overflow-hidden divide-y divide-border">
          {activity.slice(0, 8).map((event, i) => (
            <FeedItem key={i} event={event} />
          ))}
        </div>
        {activity.length > 8 && (
          <div className="mt-2 text-right">
            <button className="text-xs text-accent hover:underline">
              See all activity
            </button>
          </div>
        )}
      </section>

      {/* ─── Section C: Target Navigator ─── */}
      <section className="mb-8">
        <h2 className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-3">
          Monitored Targets
        </h2>
        <div className="bg-bg2 border border-border rounded-lg overflow-hidden divide-y divide-border">
          {dashboard.monitored_targets.map((target) => (
            <div
              key={target.target}
              className={`flex items-center justify-between px-4 py-3 ${
                target.active
                  ? "hover:bg-white/60 transition-colors"
                  : "opacity-50"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Status dot */}
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    target.status === "new_report"
                      ? "bg-lime"
                      : target.status === "coming_soon"
                        ? "bg-muted/30"
                        : "bg-sage"
                  }`}
                />
                <div>
                  <span className="text-sm font-medium text-dark">
                    {target.target}
                  </span>
                  <span className="text-xs text-muted ml-2">
                    {target.tracked_drugs} drugs · {target.tracked_indications}{" "}
                    indications
                  </span>
                </div>
              </div>
              <div className="text-right">
                {target.status === "new_report" && (
                  <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-lime text-dark rounded">
                    1 new report
                  </span>
                )}
                {target.status === "coming_soon" && (
                  <span className="text-[11px] text-muted">
                    Monitoring begins Q2 2026
                  </span>
                )}
                {target.status === "up_to_date" && (
                  <span className="text-[11px] text-muted">Up to date</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Section D: Upcoming & Quick Actions ─── */}
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-body">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>
            Next delivery:{" "}
            <span className="font-medium text-dark">
              TNF-alpha Landscape, March 17, 2026
            </span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/reports"
            className="text-xs text-accent hover:underline"
          >
            View all reports
          </Link>
          <Link
            href="/commission"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-dark text-white text-xs font-medium rounded-lg hover:bg-accent transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Commission Report
          </Link>
        </div>
      </section>
    </div>
  );
}
