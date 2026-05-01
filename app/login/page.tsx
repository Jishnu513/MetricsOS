"use client";

import { signIn } from "next-auth/react";
import { Shield } from "lucide-react";

export default function Login() {
  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg-muted)", alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ maxWidth: "400px", width: "100%", padding: "40px 32px", textAlign: "center" }}>
        <div style={{ 
          width: "56px", height: "56px", 
          background: "var(--accent-light)", 
          color: "var(--accent)", 
          borderRadius: "12px", 
          display: "flex", alignItems: "center", justifyContent: "center", 
          margin: "0 auto 24px" 
        }}>
          <Shield size={28} />
        </div>
        
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px", letterSpacing: "-0.02em" }}>
          MetricsOS Secure Login
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "32px" }}>
          Authenticate to access your enterprise analytics dashboard.
        </p>

        <button 
          onClick={() => signIn("google", { callbackUrl: "/" })}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            width: "100%", padding: "12px", borderRadius: "8px",
            background: "white", color: "#374151", border: "1px solid #d1d5db",
            fontSize: "14px", fontWeight: 600, cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            transition: "all 0.15s"
          }}
          className="hover:bg-gray-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ margin: "20px 0", display: "flex", alignItems: "center", color: "var(--text-muted)", fontSize: "13px" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          <span style={{ padding: "0 10px" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </div>

        <button 
          onClick={() => signIn("credentials", { username: "admin", password: "admin", callbackUrl: "/" })}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            width: "100%", padding: "12px", borderRadius: "8px",
            background: "var(--bg-subtle)", color: "var(--text-primary)", border: "1px solid var(--border)",
            fontSize: "14px", fontWeight: 600, cursor: "pointer",
            transition: "all 0.15s"
          }}
          className="hover:bg-gray-100"
        >
          <Shield size={16} />
          Demo Login (Admin)
        </button>
      </div>
    </div>
  );
}
