"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Cards", shortLabel: "A" },
  { href: "/settings", label: "Settings", shortLabel: "B" },
  { href: "/rewards", label: "Rewards", shortLabel: "C" },
  { href: "/growth", label: "Retirement Growth", shortLabel: "D" },
  { href: "/faq", label: "FAQ", shortLabel: "E" },
  { href: "/profile", label: "Profile", shortLabel: "F" },
] as const;

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#424A56]/20 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
      aria-label="Main navigation"
    >
      <ul className="flex items-center justify-around px-2 py-3 safe-area-pb">
        {NAV_ITEMS.map(({ href, label, shortLabel }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "text-[#ED6E09]"
                    : "text-[#424A56] hover:text-[#ED6E09]/80"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="text-[10px] opacity-70">{shortLabel}</span>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
