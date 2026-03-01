"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  CreditCard,
  Settings,
  Gift,
  TrendingUp,
  HelpCircle,
  User,
  Star,
} from "lucide-react";

const MENU_ITEMS: { href: string; label: string; icon: typeof CreditCard }[] = [
  { href: "/cards", label: "Cards", icon: CreditCard },
  { href: "/questions", label: "Daily Questions", icon: Star },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/growth", label: "Growth Journey", icon: TrendingUp },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/profile", label: "Profile", icon: User },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [open]);

  return (
    <>
      {/* Top header bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          background: "#002855",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Hamburger button */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            style={{
              padding: 8,
              borderRadius: 8,
              background: "transparent",
              color: "white",
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-expanded={open}
            aria-label="Open menu"
          >
            <Menu style={{ width: 24, height: 24 }} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#FFFFFF", fontSize: 16, fontWeight: 700, letterSpacing: "0.05em" }}>PNC</span>
            <img src="/images/rise-logo.svg" alt="PNC RISE" style={{ height: 44, width: "auto", filter: "drop-shadow(0 0 8px rgba(247,148,29,0.5))" }} />
          </div>
        </div>

        {/* Points display */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(247,148,29,0.15)",
            padding: "6px 14px",
            borderRadius: 20,
          }}
        >
          <Star style={{ width: 16, height: 16, color: "#F7941D", fill: "#F7941D" }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: "#F7941D" }}>
            1,240 pts
          </span>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(4px)",
            zIndex: 105,
          }}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Dropdown menu */}
      <div
        ref={menuRef}
        style={{
          position: "fixed",
          top: 64,
          left: 0,
          zIndex: 110,
          width: 280,
          borderRadius: "0 0 16px 0",
          background: "#002855",
          padding: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          transition: "all 250ms ease-out",
          transformOrigin: "top left",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-8px)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#FFFFFF", fontSize: 14, fontWeight: 700 }}>PNC</span>
            <img src="/images/rise-logo.svg" alt="RISE" style={{ height: 32, width: "auto" }} />
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{
              padding: 6,
              borderRadius: 8,
              color: "#A8C4E0",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            aria-label="Close menu"
          >
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        {/* User card */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#002855", border: "2px solid #F7941D", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
            JC
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 15 }}>Jordan Casey</div>
            <div style={{ color: "#F7941D", fontSize: 13, fontWeight: 600 }}>1,240 pts</div>
          </div>
        </div>

        <nav aria-label="Main navigation">
          {MENU_ITEMS.map(({ href, label, icon: Icon }, i) => {
            const isActive =
              pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <div key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderRadius: 10,
                    background: isActive
                      ? "rgba(247,148,29,0.2)"
                      : "transparent",
                    borderLeft: isActive
                      ? "3px solid #F7941D"
                      : "3px solid transparent",
                    transition: "background 0.2s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background =
                        "rgba(247,148,29,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Icon
                    style={{
                      width: 20,
                      height: 20,
                      color: isActive ? "#F7941D" : "#A8C4E0",
                      marginRight: 14,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: isActive ? "#F7941D" : "white",
                    }}
                  >
                    {label}
                  </span>
                </Link>
                {i < MENU_ITEMS.length - 1 && (
                  <div
                    style={{
                      height: 1,
                      background: "rgba(255,255,255,0.08)",
                      margin: "2px 0",
                    }}
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
