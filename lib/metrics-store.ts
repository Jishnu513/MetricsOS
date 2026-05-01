import type {
  ChartDataPoint,
  MetricData,
  RegionData,
  SystemAlert,
  TrafficSource,
  Transaction,
} from "@/lib/data";
import { getServiceSupabase, hasSupabaseServiceConfig } from "@/lib/supabase";

export interface DashboardPayload {
  timestamp: string;
  metrics?: MetricData[];
  chartData?: ChartDataPoint[];
  transactions?: Transaction[];
  trafficSources?: TrafficSource[];
  alerts?: SystemAlert[];
  regions?: RegionData[];
}

export async function loadDashboardDataFromDb(
  type: string
): Promise<DashboardPayload | null> {
  if (!hasSupabaseServiceConfig) {
    return null;
  }

  const supabase = getServiceSupabase();
  const payload: DashboardPayload = {
    timestamp: new Date().toISOString(),
  };

  try {
    if (type === "all" || type === "metrics") {
      const { data, error } = await supabase
        .from("metrics")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) return null;
      payload.metrics =
        (data as Array<{
          id: string;
          label: string;
          value: number;
          unit: string;
          change: number;
          change_type: "up" | "down" | "neutral";
          icon: string;
          color: string;
          bg_color: string;
        }>)?.map((row) => ({
          id: row.id,
          label: row.label,
          value: row.value,
          unit: row.unit,
          change: row.change,
          changeType: row.change_type,
          icon: row.icon,
          color: row.color,
          bgColor: row.bg_color,
        })) || [];
    }

    if (type === "all" || type === "chart") {
      const { data, error } = await supabase
        .from("chart_points")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) return null;
      payload.chartData = (data as ChartDataPoint[]) || [];
    }

    if (type === "all" || type === "transactions") {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) return null;

      payload.transactions =
        (data as Array<Transaction & { created_at?: string }>)?.map((row) => ({
          id: row.id,
          user: row.user,
          avatar: row.avatar,
          action: row.action,
          amount: row.amount,
          status: row.status,
          category: row.category,
          time: row.time,
        })) || [];
    }

    if (type === "all" || type === "traffic") {
      const { data, error } = await supabase
        .from("traffic_sources")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) return null;
      payload.trafficSources = (data as TrafficSource[]) || [];
    }

    if (type === "all" || type === "alerts") {
      const { data, error } = await supabase
        .from("system_alerts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) return null;

      payload.alerts =
        (data as Array<SystemAlert & { created_at?: string }>)?.map((row) => ({
          id: row.id,
          severity: row.severity,
          message: row.message,
          time: row.time,
        })) || [];
    }

    if (type === "all" || type === "regions") {
      const { data, error } = await supabase
        .from("regions")
        .select("*")
        .order("users", { ascending: false });
      if (error) return null;
      payload.regions = (data as RegionData[]) || [];
    }

    return payload;
  } catch {
    return null;
  }
}
