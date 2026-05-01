export default function Loading() {
  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg-muted)", overflow: "hidden" }}>
      {/* Sidebar Skeleton */}
      <aside style={{ width: "240px", height: "100vh", background: "var(--bg-subtle)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
        <div style={{ height: "64px", display: "flex", alignItems: "center", gap: "12px", padding: "0 16px", borderBottom: "1px solid var(--border)" }}>
          <div className="shimmer" style={{ width: "28px", height: "28px", borderRadius: "6px" }} />
          <div className="shimmer h-4 w-24" />
        </div>
        <nav style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="shimmer h-10 w-full" style={{ borderRadius: "7px" }} />
          ))}
        </nav>
      </aside>

      {/* Main Content Skeleton */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <header style={{ height: "60px", background: "var(--bg)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 24px", justifyContent: "space-between" }}>
          <div className="shimmer h-8 w-64 rounded-md" />
          <div style={{ display: "flex", gap: "16px" }}>
            <div className="shimmer h-9 w-24 rounded-md" />
            <div className="shimmer h-9 w-9 rounded-full" />
            <div className="shimmer h-9 w-9 rounded-full" />
          </div>
        </header>
        <main style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", flex: 1, overflow: "hidden" }}>
          <div className="shimmer h-6 w-64 mb-2" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card shimmer h-32" />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "16px", flex: 1 }}>
            <div className="card shimmer" style={{ gridColumn: "span 8" }} />
            <div className="card shimmer" style={{ gridColumn: "span 4" }} />
          </div>
        </main>
      </div>
    </div>
  );
}
