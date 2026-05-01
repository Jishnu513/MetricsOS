"use client";

import { Transaction } from "@/lib/data";
import { CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react";

interface TransactionTableProps {
  transactions: Transaction[];
  loading?: boolean;
}

function StatusBadge({ status }: { status: Transaction["status"] }) {
  const cfg = {
    completed: {
      icon: <CheckCircle2 size={11} />,
      label: "Completed",
      style: {
        background: "var(--success-light)",
        color: "var(--success)",
        border: "1px solid var(--success-border)",
      },
    },
    pending: {
      icon: <Clock size={11} />,
      label: "Pending",
      style: {
        background: "var(--warning-light)",
        color: "var(--warning)",
        border: "1px solid var(--warning-border)",
      },
    },
    failed: {
      icon: <XCircle size={11} />,
      label: "Failed",
      style: {
        background: "var(--danger-light)",
        color: "var(--danger)",
        border: "1px solid var(--danger-border)",
      },
    },
  };
  const c = cfg[status];
  return (
    <span className="badge" style={c.style}>
      {c.icon}
      {c.label}
    </span>
  );
}

// Consistent avatar colors keyed on initials
const AVATAR_COLORS = ["#2563eb", "#7c3aed", "#0891b2", "#16a34a", "#d97706", "#dc2626", "#db2777", "#059669"];

export default function TransactionTable({ transactions, loading }: TransactionTableProps) {
  if (loading) {
    return (
      <div className="card">
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <div className="shimmer h-4 w-40 mb-1" />
          <div className="shimmer h-3 w-28" />
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
            <div className="shimmer" style={{ width: 32, height: 32, borderRadius: "50%" }} />
            <div style={{ flex: 1 }}>
              <div className="shimmer h-3 w-28 mb-2" />
              <div className="shimmer h-2.5 w-16" />
            </div>
            <div className="shimmer h-3 w-16" />
            <div className="shimmer h-5 w-20 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div>
          <p style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-primary)" }}>
            Recent Transactions
          </p>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
            {transactions.length} entries
          </p>
        </div>
        <button className="btn btn-secondary" id="view-all-transactions-btn" style={{ fontSize: "13px" }}>
          View all <ArrowRight size={13} />
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Description</th>
              <th>Category</th>
              <th style={{ textAlign: "right" }}>Amount</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => (
              <tr key={tx.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: AVATAR_COLORS[idx % AVATAR_COLORS.length],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "white",
                        flexShrink: 0,
                      }}
                    >
                      {tx.avatar}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "13.5px", color: "var(--text-primary)" }}>{tx.user}</p>
                      <p style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{tx.id}</p>
                    </div>
                  </div>
                </td>
                <td style={{ color: "var(--text-secondary)", maxWidth: "200px" }}>{tx.action}</td>
                <td>
                  <span
                    className="badge"
                    style={{
                      background: "var(--bg-subtle)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {tx.category}
                  </span>
                </td>
                <td style={{ textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                  ${tx.amount.toLocaleString()}
                </td>
                <td>
                  <StatusBadge status={tx.status} />
                </td>
                <td style={{ color: "var(--text-muted)", fontSize: "12.5px" }}>{tx.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
