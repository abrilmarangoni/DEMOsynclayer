"use client";

interface TopbarProps {
  breadcrumb: string[];
  actions?: React.ReactNode;
}

export default function Topbar({ breadcrumb, actions }: TopbarProps) {
  return (
    <header
      style={{
        height: 52,
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {breadcrumb.map((item, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {i > 0 && (
              <span style={{ color: "var(--text-ghost)", fontSize: 11 }}>/</span>
            )}
            <span
              style={{
                fontSize: 13,
                fontWeight: i === 0 ? 500 : 400,
                color: i === 0 ? "var(--text-2)" : "var(--text-3)",
              }}
            >
              {item}
            </span>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {actions}
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "#1A1A1A",
            border: "1px solid var(--border)",
          }}
        />
      </div>
    </header>
  );
}
