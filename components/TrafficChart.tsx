"use client";

import { TrafficSource } from "@/lib/data";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: TrafficSource }>;
}) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <div
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "9px 13px",
          boxShadow: "var(--shadow-md)",
          fontSize: "13px",
        }}
      >
        <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>{d.source}</p>
        <p style={{ color: "var(--text-muted)", marginTop: "2px" }}>
          {d.sessions.toLocaleString()} sessions &nbsp;·&nbsp;
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{d.percentage}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function TrafficChart({ data, loading }: { data: TrafficSource[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="card p-5">
        <div className="shimmer h-4 w-32 mb-2" />
        <div className="shimmer h-3 w-24 mb-6" />
        <div className="shimmer h-44 w-44 rounded-full mx-auto mb-6" />
        {[...Array(5)].map((_, i) => <div key={i} className="shimmer h-3 w-full mb-3" />)}
      </div>
    );
  }

  const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

  return (
    <div className="card p-5">
      <p style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-primary)" }}>Traffic Sources</p>
      <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px", marginBottom: "16px" }}>
        Session distribution
      </p>

      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={52} outerRadius={78}
            paddingAngle={2}
            dataKey="sessions"
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} stroke="white" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {data.map((item, idx) => (
          <div key={item.source} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: 8, height: 8, borderRadius: "50%",
                background: COLORS[idx % COLORS.length],
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: "13px", color: "var(--text-secondary)", flex: 1 }}>{item.source}</span>
            <div className="progress-track" style={{ width: "64px" }}>
              <div
                className="progress-fill"
                style={{ width: `${item.percentage}%`, background: COLORS[idx % COLORS.length] }}
              />
            </div>
            <span
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--text-primary)",
                width: "30px",
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
