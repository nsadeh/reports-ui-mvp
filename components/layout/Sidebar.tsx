"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const targetAreas = [
  { name: "TNF-alpha", active: true, status: "new_report" as const },
  { name: "PD-L1", active: false, status: "coming_soon" as const },
  { name: "CD20", active: false, status: "coming_soon" as const },
];

const teamMembers = [
  { name: "Sarah Thornton", initials: "ST", role: "Senior Analyst", status: "online" as const, lastActive: "9m ago" },
  { name: "Mike Reeves", initials: "MR", role: "Associate", status: "recently_active" as const, lastActive: "42m ago" },
  { name: "James Park", initials: "JP", role: "Principal", status: "offline" as const, lastActive: "Yesterday" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [targetsOpen, setTargetsOpen] = useState(true);

  const isDashboard = pathname === "/";
  const isReports =
    pathname === "/reports" || pathname.startsWith("/reports/");
  const isCommission = pathname === "/commission";

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 bg-bg2 border-r border-border flex flex-col transition-all duration-200 ${
        collapsed ? "w-16" : "w-[232px]"
      }`}
    >
      {/* Logo + collapse toggle */}
      <div className="flex items-center justify-between px-4 py-5">
        {!collapsed && (
          <img
            src="/logo-full.png"
            alt="Inflection Labs"
            width={148}
            height={33}
          />
        )}
        {collapsed && (
          <img
            src="/logo-icon.png"
            alt="Inflection Labs"
            width={28}
            height={28}
            className="mx-auto"
          />
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="text-muted hover:text-dark transition-colors p-1 rounded hover:bg-white/60"
            title="Collapse sidebar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="11 17 6 12 11 7" />
              <polyline points="18 17 13 12 18 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-1 mb-2 text-muted hover:text-dark transition-colors p-1.5 rounded hover:bg-white/60"
          title="Expand sidebar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="13 17 18 12 13 7" />
            <polyline points="6 17 11 12 6 7" />
          </svg>
        </button>
      )}

      {/* Primary Nav */}
      <nav className="px-2 mt-1">
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 text-sm transition-colors ${
            isDashboard
              ? "bg-white text-dark font-medium shadow-sm"
              : "text-body hover:text-dark hover:bg-white/60"
          }`}
          title="Dashboard"
        >
          <span className={isDashboard ? "text-accent" : "text-muted"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </span>
          {!collapsed && "Dashboard"}
        </Link>

        <Link
          href="/reports"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 text-sm transition-colors ${
            isReports
              ? "bg-white text-dark font-medium shadow-sm"
              : "text-body hover:text-dark hover:bg-white/60"
          }`}
          title="Reports"
        >
          <span className={isReports ? "text-accent" : "text-muted"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </span>
          {!collapsed && "Reports"}
        </Link>

        <Link
          href="/commission"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 text-sm transition-colors ${
            isCommission
              ? "bg-white text-dark font-medium shadow-sm"
              : "text-body hover:text-dark hover:bg-white/60"
          }`}
          title="Commission Report"
        >
          <span className={isCommission ? "text-accent" : "text-muted"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </span>
          {!collapsed && "Commission Report"}
        </Link>
      </nav>

      {/* Monitored Targets */}
      {!collapsed && (
        <div className="px-2 mt-5">
          <button
            onClick={() => setTargetsOpen(!targetsOpen)}
            className="flex items-center justify-between w-full px-3 py-1.5 text-[10px] font-semibold text-muted uppercase tracking-wider hover:text-body transition-colors"
          >
            <span>Monitored Targets</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-150 ${targetsOpen ? "rotate-90" : ""}`}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {targetsOpen && (
            <div className="mt-1 space-y-0.5">
              {targetAreas.map((target) => (
                <Link
                  key={target.name}
                  href={target.active ? "/reports" : "#"}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded text-[13px] transition-colors ${
                    target.active
                      ? "text-body hover:text-dark hover:bg-white/60"
                      : "text-muted/40 cursor-default"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      target.status === "new_report"
                        ? "bg-lime"
                        : target.status === "coming_soon"
                          ? "bg-muted/30"
                          : "bg-sage"
                    }`}
                  />
                  <span className="flex-1">{target.name}</span>
                  {!target.active && (
                    <span className="text-[9px] text-muted/30">Q2 &apos;26</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Team Presence */}
      {!collapsed && (
        <div className="px-2 mb-3">
          <p className="px-3 py-1.5 text-[10px] font-semibold text-muted uppercase tracking-wider">
            Team
          </p>
          <div className="space-y-0.5">
            {teamMembers.map((member) => (
              <div
                key={member.initials}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded text-[12px]"
              >
                <span className="relative shrink-0">
                  <span className="w-6 h-6 rounded-full bg-sage text-dark text-[9px] font-semibold inline-flex items-center justify-center">
                    {member.initials}
                  </span>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-bg2 ${
                      member.status === "online"
                        ? "bg-lime"
                        : member.status === "recently_active"
                          ? "bg-amber-400"
                          : "bg-muted/30"
                    }`}
                  />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-body truncate leading-tight">
                    {member.name.split(" ")[0]}
                  </p>
                  <p className="text-[9px] text-muted leading-tight">
                    {member.role}
                  </p>
                </div>
                <span className="text-[9px] text-muted/60 shrink-0">
                  {member.status === "online" ? "now" : member.lastActive}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      {!collapsed && (
        <div className="px-5 py-3 border-t border-border">
          <p className="text-[11px] font-medium text-body">Curie Partners</p>
          <p className="text-[10px] text-muted">Zach Morrison · Analyst</p>
        </div>
      )}
    </aside>
  );
}
