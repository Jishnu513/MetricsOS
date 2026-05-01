"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header, { DateRange } from "@/components/Header";
import StatCard from "@/components/StatCard";
import RevenueChart from "@/components/RevenueChart";
import TransactionTable from "@/components/TransactionTable";
import TrafficChart from "@/components/TrafficChart";
import AIInsightPanel from "@/components/AIInsightPanel";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import { MetricData, ChartDataPoint, Transaction, TrafficSource, SystemAlert, RegionData } from "@/lib/data";
import { Building2, Zap, Shield, AlertTriangle, Globe2 } from "lucide-react";
import toast from "react-hot-toast";

interface DashboardData {
  timestamp: string;
  metrics: MetricData[];
  chartData: ChartDataPoint[];
  transactions: Transaction[];
  trafficSources: TrafficSource[];
  alerts: SystemAlert[];
  regions: RegionData[];
}

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [darkMode, setDarkMode] = useState(false);

  // ── Dark mode persistence ──────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("metricsOS-dark");
    if (saved === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDark = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("metricsOS-dark", "true");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("metricsOS-dark", "false");
      }
      return next;
    });
  }, []);

  // ── Auth redirect ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/metrics");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRefresh = () => fetchData(true);

  // ── Export CSV ─────────────────────────────────────────────────────────────
  const handleExport = () => {
    if (!data) return;
    const csv = [
      ["ID", "User", "Action", "Category", "Amount", "Status", "Time"],
      ...data.transactions.map((t) => [t.id, `"${t.user}"`, `"${t.action}"`, t.category, t.amount, t.status, t.time]),
    ].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${dateRange}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported transactions to CSV");
  };

  // ── Settings persistence ───────────────────────────────────────────────────
  const [settingsEndpoint, setSettingsEndpoint] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("metricsOS-endpoint") || "https://api.metricsos.internal/v1/telemetry";
    }
    return "https://api.metricsos.internal/v1/telemetry";
  });

  const saveSettings = () => {
    localStorage.setItem("metricsOS-endpoint", settingsEndpoint);
    toast.success("Configuration saved to local storage");
  };

  // ── Filter transactions by search ──────────────────────────────────────────
  const filteredTransactions = (data?.transactions || []).filter(
    (tx) =>
      tx.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Filter chart data by date range ───────────────────────────────────────
  const filteredChartData = (() => {
    const all = data?.chartData || [];
    const rangeMap: Record<DateRange, number> = { "7d": 1, "30d": 3, "90d": 9 };
    const count = rangeMap[dateRange];
    return all.slice(-count);
  })();

  if (status === "loading" || status === "unauthenticated") return null;

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg-muted)", overflow: "hidden", transition: "background 0.2s" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <Header
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onSearch={setSearchQuery}
          onExport={handleExport}
          onDateRangeChange={setDateRange}
          darkMode={darkMode}
          onToggleDark={toggleDark}
        />

        <main style={{ flex: 1, overflowY: "auto", padding: "20px", maxWidth: "1600px", margin: "0 auto", width: "100%" }}>

          {/* ===== Overview Tab ===== */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4px" }}>
                <div>
                  <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                    Production Metrics Overview
                  </h1>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div className="badge" style={{ background: "var(--success-light)", color: "var(--success)", border: "1px solid var(--success-border)" }}>
                    <span className="live-dot" style={{ marginRight: "4px" }} />
                    Live Data Sink Active
                  </div>
                </div>
              </div>

              {/* Stat cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
                {loading
                  ? [...Array(5)].map((_, i) => <StatCard key={i} metric={{} as MetricData} loading />)
                  : data?.metrics.slice(0, 5).map((m) => <StatCard key={m.id} metric={m} />)}
              </div>

              {/* Main Charts */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "16px" }}>
                <div style={{ gridColumn: "span 8" }}>
                  <RevenueChart data={filteredChartData} loading={loading} />
                </div>
                <div style={{ gridColumn: "span 4", display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Regional Distribution */}
                  <div className="card" style={{ padding: "20px", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <p style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Globe2 size={16} /> Regional Distribution
                      </p>
                    </div>
                    {loading ? (
                      [...Array(5)].map((_, i) => <div key={i} className="shimmer h-4 w-full mb-3" />)
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {data?.regions.map((r) => (
                          <div key={r.country} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: "13px", color: "var(--text-secondary)", minWidth: "120px" }}>{r.country}</span>
                            <div className="progress-track" style={{ flex: 1, margin: "0 12px" }}>
                              <div className="progress-fill" style={{ width: `${r.percentage}%`, background: "var(--accent)" }} />
                            </div>
                            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>{r.users.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* System Alerts */}
                  <div className="card" style={{ padding: "20px", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <p style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                        <AlertTriangle size={16} /> Latest Anomalies
                      </p>
                      <span
                        onClick={() => setActiveTab("alerts")}
                        style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 500, cursor: "pointer" }}
                      >View Log</span>
                    </div>
                    {loading ? (
                      <div className="shimmer h-24 w-full" />
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                        {data?.alerts.slice(0, 3).map((alert, i) => (
                          <div key={alert.id} style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: i === 2 ? "none" : "1px solid var(--border)" }}>
                            <div style={{
                              width: "8px", height: "8px", borderRadius: "50%", marginTop: "5px", flexShrink: 0,
                              background: alert.severity === "critical" ? "var(--danger)" : alert.severity === "warning" ? "var(--warning)" : "var(--accent)",
                            }} />
                            <div>
                              <p style={{ fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.4, fontWeight: 500 }}>{alert.message}</p>
                              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{alert.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "16px" }}>
                <div style={{ gridColumn: "span 7" }}>
                  <TransactionTable transactions={filteredTransactions} loading={loading} />
                </div>
                <div style={{ gridColumn: "span 5" }}>
                  <ActivityHeatmap days={90} />
                </div>
              </div>
            </div>
          )}

          {/* ===== Analytics Tab ===== */}
          {activeTab === "analytics" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  Analytics Data Explorer
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
                  In-depth reporting and funnel analysis — {dateRange === "7d" ? "last 7 days" : dateRange === "30d" ? "last 30 days" : "last 90 days"}.
                </p>
              </div>
              <RevenueChart data={filteredChartData} loading={loading} />
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 calc(50% - 10px)" }}>
                  <TrafficChart data={data?.trafficSources || []} loading={loading} />
                </div>
                <div style={{ flex: "1 1 calc(50% - 10px)" }}>
                  <div className="card" style={{ padding: "24px", height: "100%" }}>
                    <p style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-primary)", marginBottom: "24px" }}>
                      Conversion Pipeline SLA
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      {[
                        { step: "API Requests Triggered", val: 100, color: "var(--text-muted)" },
                        { step: "Authentication Validated", val: 99.8, color: "var(--chart-2)" },
                        { step: "Compute Cycle Allocated", val: 94.2, color: "var(--chart-3)" },
                        { step: "Database Sink Completed", val: 88.5, color: "var(--chart-4)" },
                      ].map((c) => (
                        <div key={c.step}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13.5px" }}>
                            <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{c.step}</span>
                            <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{c.val}%</span>
                          </div>
                          <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${c.val}%`, background: c.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== Users Tab ===== */}
          {activeTab === "users" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  Tenant Resource Utilization
                </h1>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                {[
                  { label: "Total B2B Tenants", value: "48,291", color: "var(--chart-1)", c: "+8.3%" },
                  { label: "Active API Tokens", value: "112,842", color: "var(--chart-2)", c: "+15.2%" },
                  { label: "Token Revocations", value: "2.1%", color: "var(--danger)", c: "-0.4%" },
                ].map((s) => (
                  <div key={s.label} className="card" style={{ padding: "20px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>{s.label}</span>
                    <p style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", margin: "8px 0" }}>{s.value}</p>
                    <span style={{ fontSize: "12.5px", fontWeight: 600, color: s.color }}>{s.c} 30-day delta</span>
                  </div>
                ))}
              </div>
              <TransactionTable transactions={filteredTransactions} loading={loading} />
            </div>
          )}

          {/* ===== AI Analysis Tab ===== */}
          {activeTab === "ai" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  Automated Data Aggregation Suite
                </h1>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                {[
                  { icon: <Building2 />, title: "Business Strategy", desc: "Automated aggregation of core KPI metrics logic." },
                  { icon: <Zap />, title: "Intelligence Sink", desc: "Identification of statistical anomalies and performance bottlenecks." },
                  { icon: <Shield />, title: "Secure Deployment", desc: "Enterprise-grade data analysis with privacy constraints." },
                ].map((c) => (
                  <div key={c.title} className="card" style={{ padding: "20px", display: "flex", gap: "16px" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "8px", background: "var(--bg-subtle)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", flexShrink: 0 }}>
                      {c.icon}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "14.5px", color: "var(--text-primary)", marginBottom: "4px" }}>{c.title}</p>
                      <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.4 }}>{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ height: "450px" }}>
                <AIInsightPanel metrics={data?.metrics || []} />
              </div>
            </div>
          )}

          {/* ===== Alerts Log Tab ===== */}
          {activeTab === "alerts" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  System Alert Log
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
                  Full history of system anomalies and events.
                </p>
              </div>
              <div className="card" style={{ overflow: "hidden" }}>
                {loading ? (
                  <div style={{ padding: "24px" }}><div className="shimmer h-48 w-full" /></div>
                ) : (
                  <table className="data-table" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>Severity</th>
                        <th>Message</th>
                        <th>Component</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.alerts || []).map((alert) => (
                        <tr key={alert.id}>
                          <td>
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: "6px",
                              padding: "3px 8px", borderRadius: "4px", fontSize: "11.5px", fontWeight: 700,
                              background: alert.severity === "critical" ? "var(--danger-light)" : alert.severity === "warning" ? "var(--warning-light)" : "var(--accent-light)",
                              color: alert.severity === "critical" ? "var(--danger)" : alert.severity === "warning" ? "var(--warning)" : "var(--accent)",
                            }}>
                              {alert.severity.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ maxWidth: "320px" }}>{alert.message}</td>
                          <td style={{ color: "var(--text-muted)", fontSize: "12.5px" }}>{alert.component || "system"}</td>
                          <td style={{ color: "var(--text-muted)", fontSize: "12.5px", whiteSpace: "nowrap" }}>{alert.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ===== Settings Tab ===== */}
          {activeTab === "settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  Configuration Control Plane
                </h1>
              </div>

              <div className="card" style={{ padding: "24px", maxWidth: "800px" }}>
                <p className="section-label" style={{ marginLeft: "-12px", marginBottom: "16px" }}>API Settings</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                      OpenAI API Key
                    </label>
                    <input type="password" placeholder="Set OPENAI_API_KEY in .env.local" disabled className="input" style={{ maxWidth: "480px", opacity: 0.6, cursor: "not-allowed" }} />
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
                      Server-side key only. Configure <code>OPENAI_API_KEY</code> in <code>.env.local</code>.
                    </p>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                      Data Interconnection Endpoint
                    </label>
                    <input
                      type="text"
                      value={settingsEndpoint}
                      onChange={(e) => setSettingsEndpoint(e.target.value)}
                      className="input"
                      style={{ maxWidth: "480px" }}
                      id="settings-endpoint-input"
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button onClick={saveSettings} className="btn btn-primary" style={{ padding: "10px 24px" }} id="save-settings-btn">
                      Save Configuration
                    </button>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Settings are persisted to browser local storage.</p>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: "24px", maxWidth: "800px" }}>
                <p className="section-label" style={{ marginLeft: "-12px", marginBottom: "16px" }}>Display Preferences</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Dark Mode</p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Toggle between light and dark interface theme.</p>
                  </div>
                  <button
                    onClick={toggleDark}
                    style={{
                      width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer",
                      background: darkMode ? "var(--accent)" : "var(--bg-muted)",
                      position: "relative", transition: "background 0.2s", flexShrink: 0,
                    }}
                  >
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "50%", background: "white",
                      position: "absolute", top: "3px",
                      left: darkMode ? "23px" : "3px",
                      transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }} />
                  </button>
                </div>
              </div>

              <div className="card" style={{ padding: "24px", maxWidth: "800px" }}>
                <p className="section-label" style={{ marginLeft: "-12px", marginBottom: "16px" }}>System Architecture</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                  {[
                    ["Framework", "Next.js 15 App Router"],
                    ["Language", "TypeScript Strict Mode"],
                    ["Auth", "NextAuth.js v4 — Google OAuth + Demo Credentials"],
                    ["Database", "Supabase (PostgreSQL) with mock fallback"],
                    ["AI Layer", "OpenAI GPT-3.5 Turbo + Streaming"],
                    ["Styling", "Tailwind CSS v4 + CSS Custom Properties"],
                  ].map(([k, v], i, arr) => (
                    <div key={k} style={{ display: "flex", padding: "12px 0", borderBottom: i === arr.length - 1 ? "none" : "1px solid var(--border)" }}>
                      <span style={{ width: "220px", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>{k}</span>
                      <span style={{ fontSize: "13.5px", color: "var(--text-primary)" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
