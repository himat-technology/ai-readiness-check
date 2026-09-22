"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Recommendation } from "@/types";

const PRIORITY_CLASS = {
  high: "bg-rose-50 text-rose-700 border-rose-200",
  medium: "bg-amber-50 text-amber-800 border-amber-200",
  low: "bg-slate-100 text-slate-700 border-slate-200",
};

const IMPACT_CLASS = {
  high: "bg-teal-50 text-teal-800 border-teal-200",
  medium: "bg-sky-50 text-sky-800 border-sky-200",
  low: "bg-slate-100 text-slate-600 border-slate-200",
};

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  return (
    <section aria-labelledby="recs-heading" className="space-y-4">
      <h2 id="recs-heading" className="font-display text-3xl font-semibold text-slate-900">
        AI Optimization Recommendations
      </h2>
      <div className="grid gap-4">
        {recommendations.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-slate-600">
              No major issues found. Keep monitoring crawl access and structured data as you publish.
            </CardContent>
          </Card>
        ) : (
          recommendations.map((rec) => (
            <Card key={rec.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-base">{rec.title}</CardTitle>
                  <Badge className={PRIORITY_CLASS[rec.priority]}>
                    Priority: {rec.priority}
                  </Badge>
                  <Badge className={IMPACT_CLASS[rec.impact]}>
                    Impact: {rec.impact}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-slate-600">{rec.description}</p>
                <p className="rounded-lg bg-teal-50/80 px-3 py-2 text-teal-900">
                  <span className="font-semibold">Suggested fix: </span>
                  {rec.suggestedFix}
                </p>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {rec.category}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </section>
  );
}
