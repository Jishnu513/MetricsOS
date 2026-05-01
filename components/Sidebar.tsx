"use client";

import { LayoutDashboard, BarChart3, Users, Lightbulb, Settings, Menu, X, Bell } from "lucide-react";
import { useState, useEffect } from "react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "users", label: "Users", icon: Users },
  { id: "ai", label: "Analysis", icon: Lightbulb },
  { id: "alerts", label: "Alert Log", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close drawer when tab changes on mobile
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (isMobile) setMobileOpen(false);
  };

  const sidebarContent = (
    <>
      {/* Logo / Header */}
      <div style={{
        height: "64px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "0 16px",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          width: "28px", height: "28px",
          borderRadius: "6px",
          background: "#0f1117",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        }}>
          <div style={{ width: "12px", height: "12px", border: "2px solid white", borderRadius: "2px" }} />
        </div>
        {(!collapsed || isMobile) && (
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
              MetricsOS
            </p>
          </div>
        )}
        {isMobile ? (
          <button
            onClick={() => setMobileOpen(false)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}
            title="Close menu"
          >
            <X size={18} />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginLeft: collapsed ? "0" : "auto",
            }}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleTabChange(id)}
            id={`nav-${id}`}
            className={`sidebar-link ${activeTab === id ? "active" : ""}`}
            style={{ justifyContent: collapsed && !isMobile ? "center" : "flex-start" }}
            title={collapsed && !isMobile ? label : undefined}
          >
            <Icon size={18} />
            {(!collapsed || isMobile) && <span>{label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      {(!collapsed || isMobile) && (
        <div style={{ padding: "16px", borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            background: "var(--bg-subtle)", padding: "10px",
            borderRadius: "8px", border: "1px solid var(--border)",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)", flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-primary)" }}>System Normal</p>
              <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>All services operational</p>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile hamburger trigger */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            position: "fixed", top: "14px", left: "16px", zIndex: 50,
            background: "var(--bg)", border: "1px solid var(--border)",
            borderRadius: "8px", padding: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--text-secondary)",
            boxShadow: "var(--shadow-md)",
          }}
          title="Open menu"
          id="mobile-sidebar-toggle"
        >
          <Menu size={18} />
        </button>
      )}

      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            zIndex: 45, backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
        <aside style={{
          width: collapsed ? "68px" : "240px",
          height: "100vh",
          background: "var(--bg-subtle)",
          borderRight: "1px solid var(--border)",
          transition: "width 0.2s ease, background 0.2s",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          position: "sticky",
          top: 0,
        }}>
          {sidebarContent}
        </aside>
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <aside style={{
          position: "fixed", left: mobileOpen ? 0 : "-260px",
          top: 0, height: "100vh", width: "260px",
          background: "var(--bg-subtle)",
          borderRight: "1px solid var(--border)",
          transition: "left 0.25s ease",
          display: "flex", flexDirection: "column",
          zIndex: 46,
        }}>
          {sidebarContent}
        </aside>
      )}
    </>
  );
}
