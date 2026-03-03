"use client";
import { useState } from "react";
import Logo from "./Logo";

const navItems = ["Overview", "Scans", "Tokens", "Insights"];
const bottomItems = ["Team", "Billing", "Settings"];

interface SidebarProps {
  active: string;
  onNavigate: (item: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ active, onNavigate, onLogout }: SidebarProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <aside
      style={{
        width: 220,
        height: "100vh",
        background: "var(--surface-2)",
        borderRight: "1px solid var(--border-subtle)",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <div style={{ marginBottom: 36, display: "flex", justifyContent: "center" }}>
        <Logo size="sm" />
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => onNavigate(item)}
            onMouseEnter={() => setHovered(item)}
            onMouseLeave={() => setHovered(null)}
            style={{
              height: 32,
              padding: "0 10px",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              fontSize: 12,
              color: active === item ? "var(--text-2)" : hovered === item ? "var(--text-3)" : "var(--text-4)",
              background: active === item ? "var(--surface)" : hovered === item ? "var(--surface-raised)" : "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              gap: 8,
              transition: "background-color 140ms ease, color 140ms ease",
            }}
          >
            {active === item && (
              <span
                style={{
                  width: 3,
                  height: 14,
                  borderRadius: 1,
                  background: "var(--accent)",
                }}
              />
            )}
            {item}
          </button>
        ))}
      </nav>

      <div
        style={{
          height: 1,
          background: "var(--border)",
          margin: "8px 0",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {bottomItems.map((item) => (
          <button
            key={item}
            onClick={() => onNavigate(item)}
            onMouseEnter={() => setHovered(item)}
            onMouseLeave={() => setHovered(null)}
            style={{
              height: 32,
              padding: "0 10px",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              fontSize: 12,
              color: active === item ? "var(--text-2)" : hovered === item ? "var(--text-3)" : "var(--text-4)",
              background: active === item ? "var(--surface)" : hovered === item ? "var(--surface-raised)" : "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              gap: 8,
              transition: "background-color 140ms ease, color 140ms ease",
            }}
          >
            {active === item && (
              <span
                style={{
                  width: 3,
                  height: 14,
                  borderRadius: 1,
                  background: "var(--accent)",
                }}
              />
            )}
            {item}
          </button>
        ))}

        <div
          style={{
            height: 1,
            background: "var(--border)",
            margin: "8px 0 4px",
          }}
        />

        <button
          onClick={onLogout}
          onMouseEnter={() => setHovered("logout")}
          onMouseLeave={() => setHovered(null)}
          style={{
            height: 32,
            padding: "0 10px",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center",
            fontSize: 12,
            color: hovered === "logout" ? "var(--text-3)" : "var(--text-4)",
            background: hovered === "logout" ? "var(--surface-raised)" : "transparent",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            gap: 8,
            marginTop: 4,
            transition: "background-color 140ms ease, color 140ms ease",
          }}
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
