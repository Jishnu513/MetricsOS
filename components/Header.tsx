"use client";

import { Bell, Search, RefreshCw, Download, Calendar, LogOut, Moon, Sun, X, ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: "critical" | "warning" | "info";
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "P99 Latency Spike", body: "API p99 latency exceeded 450ms threshold for 3 consecutive minutes.", time: "2 min ago", read: false, type: "critical" },
  { id: "n2", title: "Conversion Drop", body: "Checkout conversion rate fell below 3.5% — down 0.3pp vs. 7-day avg.", time: "18 min ago", read: false, type: "warning" },
  { id: "n3", title: "DB Replica Lag", body: "Read replica falling 1.2s behind primary. Monitor for continued drift.", time: "1 hr ago", read: false, type: "warning" },
  { id: "n4", title: "Daily Digest Ready", body: "Your automated analytics digest for May 1 is now available.", time: "3 hr ago", read: true, type: "info" },
];

export type DateRange = "7d" | "30d" | "90d";

interface HeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
  onSearch?: (query: string) => void;
  onExport?: () => void;
  onDateRangeChange?: (range: DateRange) => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

export default function Header({ onRefresh, refreshing, onSearch, onExport, onDateRangeChange, darkMode, onToggleDark }: HeaderProps) {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [dateOpen, setDateOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setDateOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  const dismiss = (id: string) => setNotifications((n) => n.filter((x) => x.id !== id));

  const dateLabels: Record<DateRange, string> = { "7d": "Last 7 Days", "30d": "Last 30 Days", "90d": "Last 90 Days" };

  const selectRange = (r: DateRange) => {
    setDateRange(r);
    setDateOpen(false);
    onDateRangeChange?.(r);
  };

  const severityColor = (t: Notification["type"]) =>
    t === "critical" ? "var(--danger)" : t === "warning" ? "var(--warning)" : "var(--accent)";

  return (
    <header
      style={{
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 40,
        transition: "background 0.2s, border-color 0.2s",
      }}
    >
      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: "var(--bg-subtle)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "6px 10px",
            width: "260px",
            transition: "all 0.15s",
          }}
        >
          <Search size={14} style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search metrics, users, reports..."
            onChange={(e) => onSearch?.(e.target.value)}
            style={{
              background: "none", border: "none", outline: "none",
              fontSize: "13.5px", color: "var(--text-primary)", width: "100%",
              fontFamily: "inherit",
            }}
          />
        </div>
      </div>

      {/* Right side actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

        {/* Date Range Picker */}
        <div ref={dateRef} style={{ position: "relative" }}>
          <button
            onClick={() => setDateOpen((o) => !o)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              border: "1px solid var(--border)", borderRadius: "6px",
              padding: "6px 10px", background: "var(--bg-subtle)",
              cursor: "pointer", fontSize: "12.5px", fontWeight: 500,
              color: "var(--text-secondary)", transition: "all 0.15s",
            }}
            title="Change date range"
          >
            <Calendar size={13} />
            <span>{dateLabels[dateRange]}</span>
            <ChevronDown size={12} style={{ marginLeft: "2px", opacity: 0.6 }} />
          </button>
          {dateOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              background: "var(--bg)", border: "1px solid var(--border)",
              borderRadius: "8px", boxShadow: "var(--shadow-lg)",
              minWidth: "140px", overflow: "hidden", zIndex: 100,
            }}>
              {(["7d", "30d", "90d"] as DateRange[]).map((r) => (
                <button
                  key={r}
                  onClick={() => selectRange(r)}
                  style={{
                    display: "block", width: "100%", padding: "9px 14px",
                    textAlign: "left", fontSize: "13px", fontWeight: dateRange === r ? 600 : 400,
                    color: dateRange === r ? "var(--accent)" : "var(--text-secondary)",
                    background: dateRange === r ? "var(--accent-light)" : "none",
                    border: "none", cursor: "pointer", transition: "background 0.12s",
                  }}
                >
                  {dateLabels[r]}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: "1px", height: "24px", background: "var(--border)", margin: "0 4px" }} />

        {/* Export */}
        <button
          onClick={onExport}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: "6px",
            padding: "6px 10px", fontSize: "12.5px", fontWeight: 600,
            cursor: "pointer", color: "var(--text-secondary)", transition: "all 0.15s",
          }}
          title="Export CSV"
        >
          <Download size={14} />
          <span>Export</span>
        </button>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          style={{
            width: "34px", height: "34px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "1px solid var(--border)", borderRadius: "6px",
            cursor: "pointer", color: "var(--text-secondary)", transition: "all 0.15s",
          }}
          title="Refresh Data"
        >
          <RefreshCw size={15} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDark}
          style={{
            width: "34px", height: "34px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "1px solid var(--border)", borderRadius: "6px",
            cursor: "pointer", color: "var(--text-secondary)", transition: "all 0.15s",
          }}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          id="dark-mode-toggle"
        >
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            style={{
              width: "34px", height: "34px",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "none", border: "1px solid var(--border)", borderRadius: "6px",
              cursor: "pointer", color: "var(--text-secondary)", position: "relative",
              transition: "all 0.15s",
            }}
            title="Notifications"
            id="notifications-btn"
          >
            <Bell size={15} />
            {unread > 0 && (
              <div style={{
                position: "absolute", top: "6px", right: "6px",
                width: "7px", height: "7px", background: "var(--danger)",
                borderRadius: "50%", border: "2px solid var(--bg)",
              }} />
            )}
          </button>

          {notifOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              width: "340px", background: "var(--bg)", border: "1px solid var(--border)",
              borderRadius: "10px", boxShadow: "var(--shadow-lg)", zIndex: 100,
              overflow: "hidden",
            }}>
              {/* Notif Header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px", borderBottom: "1px solid var(--border)",
                background: "var(--bg-subtle)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>Notifications</span>
                  {unread > 0 && (
                    <span style={{
                      background: "var(--danger)", color: "white", borderRadius: "10px",
                      padding: "1px 7px", fontSize: "11px", fontWeight: 700,
                    }}>{unread}</span>
                  )}
                </div>
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notif List */}
              <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                    No notifications
                  </div>
                ) : (
                  notifications.map((n, i) => (
                    <div
                      key={n.id}
                      style={{
                        display: "flex", gap: "12px", padding: "12px 16px",
                        borderBottom: i < notifications.length - 1 ? "1px solid var(--border)" : "none",
                        background: n.read ? "var(--bg)" : "var(--accent-light)",
                        transition: "background 0.15s",
                      }}
                    >
                      <div style={{
                        width: "8px", height: "8px", borderRadius: "50",
                        background: severityColor(n.type), flexShrink: 0, marginTop: "5px",
                      }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>{n.title}</p>
                        <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.4 }}>{n.body}</p>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>{n.time}</p>
                      </div>
                      <button
                        onClick={() => dismiss(n.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "2px", alignSelf: "flex-start" }}
                        title="Dismiss"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Log Out */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            width: "34px", height: "34px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "1px solid var(--border)", borderRadius: "6px",
            cursor: "pointer", color: "var(--text-secondary)", transition: "all 0.15s",
            marginLeft: "2px",
          }}
          title="Log Out"
          id="logout-btn"
        >
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
}
