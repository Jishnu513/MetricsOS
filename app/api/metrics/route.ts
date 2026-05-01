import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
  generateMetrics,
  generateChartData,
  generateTransactions,
  generateTrafficSources,
  generateSystemAlerts,
  generateRegions
} from "@/lib/data";
import { authOptions } from "@/lib/auth";
import { loadDashboardDataFromDb } from "@/lib/metrics-store";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all";

  const dbPayload = await loadDashboardDataFromDb(type);
  if (dbPayload) {
    return NextResponse.json(dbPayload, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Data-Source": "supabase",
      },
    });
  }

  // Simulate slight real-time variance
  const jitter = () => (Math.random() - 0.5) * 0.02;

  let finalMetrics = generateMetrics().map((m) => ({
    ...m,
    change: parseFloat((m.change + jitter() * 10).toFixed(1)),
  }));
  let finalTransactions = generateTransactions();
  let finalChartData = generateChartData();
  let finalAlerts = generateSystemAlerts();
  let finalTrafficSources = generateTrafficSources();
  let finalRegions = generateRegions();

  // ATTEMPT TO USE REAL SUPABASE DATABASE
  // If the user hasn't set up the keys or tables, this will gracefully fall back to mock data.
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "your-supabase-project-url") {
      const { data: dbMetrics, error: metricsErr } = await supabase.from('metrics').select('*');
      const { data: dbTx, error: txErr } = await supabase.from('transactions').select('*').order('time', { ascending: false }).limit(10);
      
      if (!metricsErr && dbMetrics && dbMetrics.length > 0) {
        finalMetrics = dbMetrics as any;
      }
      if (!txErr && dbTx && dbTx.length > 0) {
        finalTransactions = dbTx as any;
      }
    }
  } catch (error) {
    console.warn("Supabase query failed, falling back to mock data generator. Ensure keys and tables are created.");
  }

  const payload = {
    timestamp: new Date().toISOString(),
    metrics: type === "all" || type === "metrics" ? finalMetrics : undefined,
    chartData: type === "all" || type === "chart" ? finalChartData : undefined,
    transactions: type === "all" || type === "transactions" ? finalTransactions : undefined,
    trafficSources: type === "all" || type === "traffic" ? finalTrafficSources : undefined,
    alerts: type === "all" || type === "alerts" ? finalAlerts : undefined,
    regions: type === "all" || type === "regions" ? finalRegions : undefined,
  };

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Data-Source": "mock",
    },
  });
}
