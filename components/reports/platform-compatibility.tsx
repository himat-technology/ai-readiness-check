"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getScoreBg, getScoreLabel } from "@/lib/utils";
import type { PlatformReadiness } from "@/types";

interface PlatformCompatibilityProps {
  platforms: PlatformReadiness[];
}

export function PlatformCompatibility({ platforms }: PlatformCompatibilityProps) {
  return (
    <section aria-labelledby="platforms-heading" className="space-y-4">
      <h2 id="platforms-heading" className="font-display text-3xl font-semibold text-slate-900">
        AI Search Readiness
      </h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {platforms.map((platform) => (
          <Card key={platform.platform}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">{platform.platform}</CardTitle>
                <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                  {getScoreLabel(platform.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold tabular-nums text-slate-900">
                  {platform.score}
                </span>
                <span className="text-sm text-slate-500">compatibility</span>
              </div>
              <Progress value={platform.score} indicatorClassName={getScoreBg(platform.score)} />
              <ul className="space-y-1.5 text-sm text-slate-600">
                {platform.recommendations.map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
