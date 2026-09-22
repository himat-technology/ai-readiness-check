"use client";

import { ScoreGauge } from "@/components/charts/score-gauge";
import { CategoryChart } from "@/components/charts/category-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getScoreBg, getScoreLabel } from "@/lib/utils";
import type { AnalyzeApiResponse } from "@/types";

const CATEGORY_META: Record<string, { label: string; weight: string }> = {
  crawlability: { label: "Crawlability", weight: "20%" },
  sitemapHealth: { label: "Sitemap Health", weight: "15%" },
  technicalSeo: { label: "Technical SEO", weight: "20%" },
  contentQuality: { label: "Content Quality", weight: "15%" },
  aiDiscoverability: { label: "AI Discoverability", weight: "15%" },
  performance: { label: "Performance Signals", weight: "15%" },
};

interface ScoreDashboardProps {
  data: AnalyzeApiResponse;
}

export function ScoreDashboard({ data }: ScoreDashboardProps) {
  return (
    <section aria-labelledby="score-heading" className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 id="score-heading" className="font-display text-3xl font-semibold">
          <span className="brand-gradient-text">AI Readiness Score</span>
        </h2>
        <p className="max-w-2xl text-slate-600">
          Overall score for{" "}
          <span className="font-medium text-slate-800">
            {data.report?.finalUrl || data.report?.url}
          </span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="flex flex-col items-center justify-center p-6">
          <ScoreGauge score={data.score} level={data.level} />
          <p className="mt-2 text-center text-sm text-slate-500">
            Status: <strong className="text-slate-800">{getScoreLabel(data.level)}</strong>
          </p>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category breakdown</CardTitle>
            <CardDescription>
              Weighted scores across crawlability, SEO, content, and AI signals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {Object.entries(data.categories).map(([key, score]) => {
              const meta = CATEGORY_META[key] || { label: key, weight: "" };
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-800">
                      {meta.label}{" "}
                      <span className="text-slate-400">({meta.weight})</span>
                    </span>
                    <span className="tabular-nums font-semibold text-slate-900">
                      {score}
                    </span>
                  </div>
                  <Progress
                    value={score}
                    indicatorClassName={getScoreBg(score)}
                    aria-label={`${meta.label} score ${score}`}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visual comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryChart categories={data.categories} />
        </CardContent>
      </Card>
    </section>
  );
}
