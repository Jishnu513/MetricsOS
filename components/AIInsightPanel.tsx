"use client";

import { useState } from "react";
import { MetricData } from "@/lib/data";
import { Sparkles, RefreshCw, Copy, CheckCheck, Lightbulb } from "lucide-react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";

interface AIInsightPanelProps {
  metrics: MetricData[];
}

export default function AIInsightPanel({ metrics }: AIInsightPanelProps) {
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [usingAI, setUsingAI] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const generateInsight = async () => {
    if (!metrics.length) return;
    setLoading(true);
    setInsight("");
    setHasGenerated(false);

    try {
      const res = await fetch("/api/ai-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            metrics: metrics.map((m) => ({
              label: m.label,
              value: m.value,
              unit: m.unit,
              change: m.change,
              changeType: m.changeType,
            })),
          },
          prompt: customPrompt || undefined,
          stream: true,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const contentType = res.headers.get("content-type") || "";

      // ── Streaming path ─────────────────────────────────────────────────────
      if (contentType.includes("text/event-stream")) {
        setLoading(false);
        setIsStreaming(true);
        setUsingAI(true);
        setHasGenerated(true);

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const chunk = line.slice(6);
              if (chunk === "[DONE]") break;
              try {
                const parsed = JSON.parse(chunk);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) setInsight((prev) => prev + delta);
              } catch {
                // skip invalid JSON chunks
              }
            }
          }
        }

        setIsStreaming(false);
        toast.success("Streaming analysis complete");
      } else {
        // ── Non-streaming fallback ─────────────────────────────────────────
        const data = await res.json();
        setInsight(data.insight);
        setUsingAI(data.usingAI || false);
        setHasGenerated(true);
        toast.success("Analysis complete");
      }
    } catch {
      toast.error("Failed to generate insight");
    } finally {
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const copyInsight = async () => {
    await navigator.clipboard.writeText(insight);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px", borderBottom: "1px solid var(--border)",
        background: "var(--bg-subtle)",
        borderTopLeftRadius: "10px", borderTopRightRadius: "10px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Lightbulb size={18} style={{ color: "var(--accent)" }} />
          <div>
            <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-primary)" }}>
              Automated Analysis
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
              {hasGenerated && (
                <>
                  <div style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: isStreaming ? "var(--accent)" : usingAI ? "var(--success)" : "var(--warning)",
                    animation: isStreaming ? "livePulse 1s ease infinite" : "none",
                  }} />
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500 }}>
                    {isStreaming ? "Streaming…" : usingAI ? "Powered by OpenAI" : "Standard Model"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        {hasGenerated && !isStreaming && (
          <button
            onClick={copyInsight}
            className="btn btn-secondary"
            id="copy-insight-btn"
            style={{ padding: "6px 10px" }}
            title="Copy Report"
          >
            {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
          </button>
        )}
      </div>

      <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Prompt Input */}
        <div style={{ marginBottom: "16px" }}>
          <input
            className="input"
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Add context or ask a specific question (optional)..."
            id="ai-prompt-input"
            disabled={loading || isStreaming}
            onKeyDown={(e) => e.key === "Enter" && !loading && !isStreaming && generateInsight()}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={generateInsight}
          disabled={loading || isStreaming}
          className="btn btn-primary"
          id="generate-insight-btn"
          style={{ width: "100%", justifyContent: "center", padding: "10px 0", marginBottom: "20px" }}
        >
          {loading ? (
            <><RefreshCw size={15} style={{ animation: "spin 1s linear infinite" }} /> Initializing analysis…</>
          ) : isStreaming ? (
            <><Sparkles size={15} style={{ animation: "livePulse 1s ease infinite" }} /> Streaming response…</>
          ) : (
            <><Sparkles size={15} /> {hasGenerated ? "Regenerate Analysis" : "Run Analysis"}</>
          )}
        </button>

        {/* Output area */}
        <div style={{
          flex: 1,
          background: insight ? "var(--bg-subtle)" : "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: insight ? "16px" : "0",
          overflowY: "auto",
          minHeight: "200px",
          transition: "background 0.2s",
        }}>
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px" }}>
              <div className="shimmer h-4 w-3/4 mb-2" />
              <div className="shimmer h-3 w-full" />
              <div className="shimmer h-3 w-5/6" />
              <div className="shimmer h-3 w-4/6 mb-4" />
              <div className="shimmer h-3 w-full" />
              <div className="shimmer h-3 w-full" />
            </div>
          )}

          {!loading && insight && (
            <div style={{ color: "var(--text-primary)", fontSize: "13.5px", lineHeight: "1.6" }}>
              <ReactMarkdown
                components={{
                  strong: ({ children }) => <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>{children}</strong>,
                  p: ({ children }) => <p style={{ marginBottom: "12px" }}>{children}</p>,
                  li: ({ children }) => <li style={{ marginBottom: "6px", paddingLeft: "4px" }}>{children}</li>,
                  ul: ({ children }) => <ul style={{ paddingLeft: "16px", marginBottom: "12px", listStyleType: "disc" }}>{children}</ul>,
                  h2: ({ children }) => <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px", marginTop: "16px" }}>{children}</h2>,
                  h3: ({ children }) => <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px", marginTop: "12px" }}>{children}</h3>,
                }}
              >
                {insight}
              </ReactMarkdown>
              {isStreaming && (
                <span style={{
                  display: "inline-block", width: "8px", height: "14px",
                  background: "var(--accent)", marginLeft: "2px",
                  animation: "livePulse 0.7s ease infinite",
                  verticalAlign: "text-bottom", borderRadius: "1px",
                }} />
              )}
            </div>
          )}

          {!loading && !insight && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "20px", textAlign: "center" }}>
              <Lightbulb size={32} style={{ color: "var(--text-disabled)", marginBottom: "12px" }} />
              <p style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: "14px" }}>
                Ready for Analysis
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px", maxWidth: "250px" }}>
                Click run to process current dashboard metrics and generate a business summary.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
