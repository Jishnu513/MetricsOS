"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      height: "100vh", 
      background: "var(--bg-subtle)",
      padding: "20px"
    }}>
      <div className="card" style={{ maxWidth: "480px", width: "100%", padding: "32px", textAlign: "center" }}>
        <div style={{ 
          width: "64px", height: "64px", 
          background: "var(--danger-light)", 
          color: "var(--danger)", 
          borderRadius: "50%", 
          display: "flex", alignItems: "center", justifyContent: "center", 
          margin: "0 auto 24px" 
        }}>
          <AlertTriangle size={32} />
        </div>
        
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px" }}>
          Something went wrong
        </h2>
        
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "32px", lineHeight: 1.5 }}>
          We encountered an unexpected error while rendering this page. 
          Our systems have logged the incident.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button 
            onClick={() => window.location.href = '/'}
            className="btn btn-secondary"
            style={{ padding: "10px 20px" }}
          >
            Go Home
          </button>
          <button
            onClick={() => reset()}
            className="btn btn-primary"
            style={{ padding: "10px 20px" }}
          >
            <RefreshCcw size={16} /> Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
