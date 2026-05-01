"use client";

import { useMemo } from "react";
import { Activity } from "lucide-react";

interface HeatmapProps {
  days?: number;
}

interface HeatmapDay {
  date: Date;
  load: number;
  level: number;
}

export default function ActivityHeatmap({ days = 90 }: HeatmapProps) {
  const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Generate mock data for the heatmap
  const data = useMemo(() => {
    const result: HeatmapDay[] = [];
    const today = new Date();
    for (let i = days; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      
      // Simulate weekly patterns (weekends lower, mid-week higher)
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const seed = d.getTime() / 86400000;
      let baseLoad = isWeekend ? pseudoRandom(seed) * 30 : 40 + pseudoRandom(seed + 1) * 60;
      
      // Add random spikes
      if (pseudoRandom(seed + 2) > 0.95) baseLoad = 90 + pseudoRandom(seed + 3) * 10;
      
      let level = 0; // 0: empty, 1: light, 2: medium, 3: high, 4: critical
      if (baseLoad > 85) level = 4;
      else if (baseLoad > 60) level = 3;
      else if (baseLoad > 30) level = 2;
      else if (baseLoad > 10) level = 1;

      result.push({ date: d, load: Math.round(baseLoad), level });
    }
    return result;
  }, [days]);

  // Colors mapping for levels
  const colors = [
    "var(--bg-muted)",             // 0
    "rgba(37, 99, 235, 0.2)",      // 1
    "rgba(37, 99, 235, 0.5)",      // 2
    "rgba(37, 99, 235, 0.8)",      // 3
    "rgba(37, 99, 235, 1)",        // 4
  ];

  // Group by weeks to columnize
  const weeks: HeatmapDay[][] = [];
  let currentWeek: HeatmapDay[] = [];
  data.forEach((day, index) => {
    currentWeek.push(day);
    if (day.date.getDay() === 6 || index === data.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <p style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
          <Activity size={16} /> API System Load (90 Days)
        </p>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", overflowX: "auto", paddingBottom: "10px" }}>
        <div style={{ display: "flex", gap: "4px" }}>
          {weeks.map((week, wIdx) => (
            <div key={wIdx} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {/* Pad beginning of first week if standard start day isn't Sunday */}
              {wIdx === 0 && week.length < 7 && [...Array(7 - week.length)].map((_, i) => (
                <div key={`empty-${i}`} style={{ width: "12px", height: "12px", background: "transparent" }} />
              ))}
              
              {week.map((day, dIdx) => (
                <div
                  key={dIdx}
                  title={`${day.date.toDateString()}: ${day.load}% load`}
                  style={{
                    width: "12px",
                    height: "12px",
                    background: colors[day.level],
                    borderRadius: "2px",
                    cursor: "crosshair",
                    transition: "transform 0.1s",
                  }}
                  className="hover:scale-125 z-10 hover:shadow-sm hover:border hover:border-blue-300"
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px", marginTop: "16px", fontSize: "11px", color: "var(--text-muted)" }}>
          <span>Less</span>
          {colors.map((color, i) => (
             <div key={i} style={{ width: "10px", height: "10px", background: color, borderRadius: "2px" }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
