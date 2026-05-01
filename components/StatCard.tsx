"use client";

import { MetricData } from "@/lib/data";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  metric: MetricData;
  loading?: boolean;
}

export default function StatCard({ metric, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="stat-card">
        <div className="shimmer h-3 w-20 mb-4" />
        <div className="shimmer h-7 w-28 mb-3" />
        <div className="shimmer h-3 w-24" />
      </div>
    );
  }

  const isUp = metric.changeType === "up";
  const isDown = metric.changeType === "down";

  const formatValue = (value: number, unit: string) => {
    if (unit === "$") {
      if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
      if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
      return `$${value}`;
    }
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K${unit ? " " + unit : ""}`;
    return `${value}${unit ? " " + unit : ""}`;
  };

  // Color accent strip per metric
  const accentColors: Record<string, string> = {
    revenue: "var(--chart-1)",
    users: "var(--chart-2)",
    sessions: "var(--chart-3)",
    conversions: "var(--chart-4)",
  };
  const accentColor = accentColors[metric.id] || "var(--accent)";

  return (
    <div className="stat-card" style={{ paddingTop: "22px" }}>
      {/* color strip top */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "3px",
          background: accentColor,
          borderRadius: "10px 10px 0 0",
        }}
      />

      <p
        style={{
          fontSize: "12px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--text-muted)",
          marginBottom: "10px",
        }}
      >
        {metric.label}
      </p>

      <p
        style={{
          fontSize: "28px",
          fontWeight: 700,
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          marginBottom: "12px",
        }}
      >
        {formatValue(metric.value, metric.unit)}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        {isUp && <TrendingUp size={13} style={{ color: "var(--success)" }} />}
        {isDown && <TrendingDown size={13} style={{ color: "var(--danger)" }} />}
        {!isUp && !isDown && <Minus size={13} style={{ color: "var(--text-muted)" }} />}

        <span
          style={{
            fontSize: "12.5px",
            fontWeight: 600,
            color: isUp ? "var(--success)" : isDown ? "var(--danger)" : "var(--text-muted)",
          }}
        >
          {isUp ? "+" : ""}{metric.change}%
        </span>
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>vs last month</span>
      </div>
    </div>
  );
}
