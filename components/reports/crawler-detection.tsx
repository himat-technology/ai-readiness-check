"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CrawlerStatus } from "@/types";

const STATUS_CLASS = {
  allowed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  blocked: "bg-rose-50 text-rose-700 border-rose-200",
  unknown: "bg-slate-100 text-slate-700 border-slate-200",
};

interface CrawlerDetectionProps {
  crawlers: CrawlerStatus[];
}

export function CrawlerDetection({ crawlers }: CrawlerDetectionProps) {
  return (
    <section aria-labelledby="crawlers-heading" className="space-y-4">
      <h2 id="crawlers-heading" className="font-display text-3xl font-semibold text-slate-900">
        AI Crawler Detection
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>robots.txt permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 font-medium">Crawler</th>
                  <th className="pb-3 font-medium">User-Agent</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {crawlers.map((crawler) => (
                  <tr key={crawler.userAgent} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 font-medium text-slate-900">{crawler.name}</td>
                    <td className="py-3 font-mono text-xs text-slate-500">
                      {crawler.userAgent}
                    </td>
                    <td className="py-3">
                      <Badge className={STATUS_CLASS[crawler.status]}>
                        {crawler.status === "allowed"
                          ? "Allowed"
                          : crawler.status === "blocked"
                            ? "Blocked"
                            : "Unknown"}
                      </Badge>
                    </td>
                    <td className="py-3 text-slate-600">{crawler.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
