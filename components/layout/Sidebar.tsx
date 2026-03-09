"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/", icon: "◉" },
  { label: "Reports", href: "/reports", icon: "◎" },
  { label: "Commission", href: "/commission", icon: "⊕" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-dark flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6">
        <h1 className="text-xl font-semibold text-white tracking-tight">
          Inflection Labs
        </h1>
        <p className="text-sage text-sm mt-0.5">Market Access Intelligence</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 mt-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md mb-1 text-sm transition-colors ${
                isActive
                  ? "bg-accent text-white border-l-3 border-lime"
                  : "text-sage hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-xs text-muted">Curie Partners</p>
        <p className="text-xs text-sage">Zach — Analyst</p>
      </div>
    </aside>
  );
}
