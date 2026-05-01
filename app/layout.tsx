import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MetricsOS | Business Analytics Platform",
  description:
    "Enterprise-grade dashboard for visualizing real-time metrics, user data, and automated business insights. Built for production-ready operations.",
  keywords: ["analytics", "dashboard", "business intelligence", "metrics"],
  authors: [{ name: "MetricsOS Team" }],
  openGraph: {
    title: "MetricsOS Analytics",
    description: "Enterprise data visualization and reporting",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#111827",
                color: "#f0f4ff",
                border: "1px solid #1e2d4a",
                borderRadius: "12px",
              },
              success: {
                iconTheme: { primary: "#10b981", secondary: "#111827" },
              },
              error: {
                iconTheme: { primary: "#f43f5e", secondary: "#111827" },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
