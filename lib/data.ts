// Centralized mock data and types for the MetricsOS Dashboard

export interface MetricData {
  id: string;
  label: string;
  value: number;
  unit: string;
  change: number;
  changeType: "up" | "down" | "neutral";
  icon: string;
  color: string;
  bgColor: string;
}

export interface ChartDataPoint {
  name: string;
  revenue: number;
  users: number;
  sessions: number;
  conversions: number;
}

export interface Transaction {
  id: string;
  user: string;
  avatar: string;
  action: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  time: string;
  category: string;
}

export interface TrafficSource {
  source: string;
  sessions: number;
  percentage: number;
  color: string;
}

export interface SystemAlert {
  id: string;
  severity: "critical" | "warning" | "info";
  message: string;
  time: string;
  component?: string;
}

export interface RegionData {
  country: string;
  users: number;
  percentage: number;
}

export function generateChartData(): ChartDataPoint[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const base = { revenue: 42000, users: 3200, sessions: 9800, conversions: 280 };
  
  return months.map((name, i) => {
    const growth = 1 + i * 0.06 + (Math.random() - 0.3) * 0.15;
    return {
      name,
      revenue: Math.round(base.revenue * growth),
      users: Math.round(base.users * growth),
      sessions: Math.round(base.sessions * growth),
      conversions: Math.round(base.conversions * growth),
    };
  });
}

export function generateMetrics(): MetricData[] {
  return [
    {
      id: "revenue",
      label: "TOTAL REVENUE",
      value: 847293,
      unit: "$",
      change: 12.5,
      changeType: "up",
      icon: "💰",
      color: "var(--chart-1)",
      bgColor: "rgba(37, 99, 235, 0.1)",
    },
    {
      id: "users",
      label: "ACTIVE USERS",
      value: 48291,
      unit: "",
      change: 8.3,
      changeType: "up",
      icon: "👥",
      color: "var(--chart-2)",
      bgColor: "rgba(124, 58, 237, 0.1)",
    },
    {
      id: "sessions",
      label: "AVG SESSION",
      value: 4.7,
      unit: "min",
      change: -2.1,
      changeType: "down",
      icon: "⏱️",
      color: "var(--chart-3)",
      bgColor: "rgba(8, 145, 178, 0.1)",
    },
    {
      id: "conversions",
      label: "CONVERSION",
      value: 3.84,
      unit: "%",
      change: 0.6,
      changeType: "up",
      icon: "🎯",
      color: "var(--chart-4)",
      bgColor: "rgba(22, 163, 74, 0.1)",
    },
    {
      id: "latency",
      label: "API LATENCY",
      value: 124,
      unit: "ms",
      change: -12.4,
      changeType: "up", // Decrease in latency is good
      icon: "⚡",
      color: "var(--chart-5)",
      bgColor: "rgba(217, 119, 6, 0.1)",
    },
  ];
}

export function generateTransactions(): Transaction[] {
  const users = [
    { name: "Global Logistics Ltd", avatar: "G" },
    { name: "Acme Software", avatar: "A" },
    { name: "Nexus Healthcare", avatar: "N" },
    { name: "Stark Industries", avatar: "S" },
    { name: "Wayne Enterprises", avatar: "W" },
    { name: "Umbrella Corp", avatar: "U" },
    { name: "Massive Dynamic", avatar: "M" },
    { name: "Cyberdyne Systems", avatar: "C" },
  ];

  const actions = [
    { action: "Enterprise Contract Lifecycle", category: "B2B Sales", amount: 14500 },
    { action: "Cloud Storage Expansion", category: "Infrastructure", amount: 2499 },
    { action: "API Quota Upgrade Tier 3", category: "SaaS", amount: 499 },
    { action: "Annual SLA Renewal", category: "Services", amount: 2999 },
    { action: "Dedicated Support Retainer", category: "Services", amount: 1500 },
    { action: "Data Pipeline Integration", category: "Engineering", amount: 8400 },
    { action: "Compliance Audit Service", category: "Security", amount: 5200 },
    { action: "Custom Reporting Dashboard", category: "Professional", amount: 1200 },
  ];

  const statuses: Array<"completed" | "pending" | "failed"> = ["completed", "completed", "completed", "pending", "failed", "completed"];

  return users.map((user, i) => ({
    id: `INV-${String(i + 48201).padStart(5, "0")}`,
    user: user.name,
    avatar: user.avatar,
    action: actions[i % actions.length].action,
    amount: actions[i % actions.length].amount,
    status: statuses[i % statuses.length],
    time: `${i + 1}h ago`,
    category: actions[i % actions.length].category,
  }));
}

export function generateTrafficSources(): TrafficSource[] {
  return [
    { source: "Direct API Integration", sessions: 42180, percentage: 48, color: "var(--chart-1)" },
    { source: "Partner Portals", sessions: 22840, percentage: 26, color: "var(--chart-2)" },
    { source: "Organic Search", sessions: 13180, percentage: 15, color: "var(--chart-3)" },
    { source: "Referral Networks", sessions: 6150, percentage: 7, color: "var(--chart-4)" },
    { source: "Paid Campaigns", sessions: 3514, percentage: 4, color: "var(--chart-5)" },
  ];
}

export function generateSystemAlerts(): SystemAlert[] {
  return [
    { id: "al-1", severity: "critical", message: "Database connection spike in US-East-1", time: "12m ago", component: "db-primary" },
    { id: "al-2", severity: "warning", message: "API rate limit approaching for account INV-48204", time: "44m ago", component: "api-gateway" },
    { id: "al-3", severity: "warning", message: "Memory utilisation at 87% on node compute-03", time: "1h ago", component: "compute-03" },
    { id: "al-4", severity: "info", message: "Nightly backup completed successfully", time: "3h ago", component: "backup-service" },
    { id: "al-5", severity: "info", message: "New node deployed to compute cluster", time: "5h ago", component: "orchestrator" },
    { id: "al-6", severity: "critical", message: "SSL certificate for api.metricsos.internal expires in 7 days", time: "6h ago", component: "cert-manager" },
  ];
}

export function generateRegions(): RegionData[] {
  return [
    { country: "United States", users: 24500, percentage: 45 },
    { country: "United Kingdom", users: 11200, percentage: 21 },
    { country: "Germany", users: 8400, percentage: 15 },
    { country: "Australia", users: 5100, percentage: 9 },
    { country: "Japan", users: 4800, percentage: 10 },
  ];
}
