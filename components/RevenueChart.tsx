"use client";

import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Brush
} from "recharts";
import { ChartDataPoint } from "@/lib/data";
import { useState } from "react";

interface RevenueChartProps {
  data: ChartDataPoint[];
  loading?: boolean;
}

interface RevenueTooltipEntry {
  color?: string;
  name?: string;
  value?: number;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: RevenueTooltipEntry[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "10px 14px",
          boxShadow: "var(--shadow-md)",
          fontSize: "13px",
        }}
      >
        <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>{label}</p>
        {payload.map((entry, i: number) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: entry.color, flexShrink: 0 }} />
            <span style={{ textTransform: "capitalize" }}>{entry.name}:</span>
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
              {entry.name === "revenue"
                ? `$${((entry.value || 0) / 1000).toFixed(1)}K`
                : (entry.value || 0).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

type ViewMode = "revenue" | "users" | "combined";

export default function RevenueChart({ data, loading }: RevenueChartProps) {
  const [view, setView] = useState<ViewMode>("revenue");

  if (loading) {
    return (
      <div className="card p-5">
        <div className="shimmer h-4 w-36 mb-2" />
        <div className="shimmer h-3 w-24 mb-6" />
        <div className="shimmer h-56 w-full" />
      </div>
    );
  }

  return (
    <div className="card p-5">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-primary)" }}>
            Performance Overview
          </p>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
            12-month trend analysis
          </p>
        </div>

        {/* Toggle */}
        <div
          style={{
            display: "flex",
            background: "var(--bg-subtle)",
            borderRadius: "7px",
            padding: "3px",
            border: "1px solid var(--border)",
            gap: "2px",
          }}
        >
          {(["revenue", "users", "combined"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "5px 12px",
                borderRadius: "5px",
                border: "none",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
                background: view === v ? "var(--bg)" : "transparent",
                color: view === v ? "var(--accent)" : "var(--text-muted)",
                boxShadow: view === v ? "var(--shadow-sm)" : "none",
                transition: "all 0.15s",
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        {view === "combined" ? (
          <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-subtle)" }} />
            <Bar dataKey="revenue" fill="var(--chart-1)" radius={[3, 3, 0, 0]} maxBarSize={20} />
            <Bar dataKey="users" fill="var(--chart-2)" radius={[3, 3, 0, 0]} maxBarSize={20} />
            <Brush dataKey="name" height={24} stroke="var(--border-strong)" fill="var(--bg-subtle)" tickFormatter={() => ""} travellerWidth={8} />
          </BarChart>
        ) : (
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 4 }}>
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={view === "revenue" ? "#2563eb" : "#7c3aed"} stopOpacity={0.12} />
                <stop offset="100%" stopColor={view === "revenue" ? "#2563eb" : "#7c3aed"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={false} tickLine={false}
              tickFormatter={(v) => view === "revenue" ? `$${(v / 1000).toFixed(0)}K` : v.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border)", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey={view === "revenue" ? "revenue" : "users"}
              stroke={view === "revenue" ? "#2563eb" : "#7c3aed"}
              strokeWidth={2}
              fill="url(#grad1)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "white" }}
            />
            <Brush dataKey="name" height={24} stroke="var(--border-strong)" fill="var(--bg-subtle)" tickFormatter={() => ""} travellerWidth={8} />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
