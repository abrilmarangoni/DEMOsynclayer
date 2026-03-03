"use client";

export default function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const fontSize = size === "sm" ? "14px" : "16px";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0px" }}>
      <span
        style={{
          fontFamily: "var(--font-logo)",
          fontSize,
          fontWeight: 600,
          color: "var(--text-1)",
          letterSpacing: "-0.3px",
        }}
      >
        SyncLayer
      </span>
    </div>
  );
}
