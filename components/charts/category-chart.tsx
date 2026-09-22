"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CategoryChartProps {
  categories: Record<string, number>;
}

const LABELS: Record<string, string> = {
  crawlability: "Crawlability",
  sitemapHealth: "Sitemap",
  technicalSeo: "Technical SEO",
  contentQuality: "Content",
  aiDiscoverability: "AI Discoverability",
  performance: "Performance",
};

function scoreFill(score: number): string {
  if (score >= 90) return "#059669";
  if (score >= 75) return "#0284c7";
  if (score >= 50) return "#d97706";
  return "#e11d48";
}

export function CategoryChart({ categories }: CategoryChartProps) {
  const data = Object.entries(categories).map(([key, score]) => ({
    name: LABELS[key] || key,
    score,
  }));

  return (
    <div className="h-64 w-full" role="img" aria-label="Category score chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={60}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(15, 118, 110, 0.06)" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
            }}
          />
          <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={42}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={scoreFill(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
