"use client";
import React from "react";

export function BtnPrimary({
  children,
  onClick,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 42,
        padding: "0 24px",
        background: hovered ? "var(--accent-dim)" : "transparent",
        border: `1px solid ${hovered ? "var(--accent)" : "var(--accent-border)"}`,
        borderRadius: "var(--radius-md)",
        color: hovered ? "#F2B6A7" : "var(--accent)",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "background-color 180ms ease, border-color 180ms ease, color 180ms ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function BtnGhost({
  children,
  onClick,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 36,
        padding: "0 16px",
        background: hovered ? "var(--surface-raised)" : "transparent",
        border: `1px solid ${hovered ? "var(--border-strong)" : "var(--border)"}`,
        borderRadius: "var(--radius-sm)",
        color: hovered ? "var(--text-2)" : "var(--text-3)",
        fontSize: 11,
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "background-color 180ms ease, border-color 180ms ease, color 180ms ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Input({
  placeholder,
  value,
  onChange,
  mono,
  style,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  mono?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      style={{
        width: "100%",
        height: 42,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: "0 14px",
        fontSize: 14,
        color: "var(--text-1)",
        outline: "none",
        fontFamily: mono ? "var(--font-mono)" : "inherit",
        ...style,
      }}
    />
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        fontSize: 11,
        fontWeight: 500,
        color: "var(--text-3)",
        textTransform: "uppercase" as const,
        letterSpacing: "0.6px",
        marginBottom: 8,
        display: "block",
      }}
    >
      {children}
    </label>
  );
}

export function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 24,
            height: 2,
            borderRadius: 1,
            background:
              i < current
                ? "var(--text-4)"
                : i === current
                ? "var(--accent)"
                : "var(--border)",
          }}
        />
      ))}
    </div>
  );
}

export function Overlay({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
