import type { CheerioAPI } from "cheerio";
import type { AuditCheck, Recommendation } from "@/types";
import { formatBytes } from "@/lib/utils";
import { makeCheck, makeRecommendation } from "@/lib/scoring/engine";

export interface PerformanceAnalysis {
  checks: AuditCheck[];
  recommendations: Recommendation[];
}

export function analyzePerformance(
  $: CheerioAPI,
  pageBytes: number,
  loadTimeMs: number
): PerformanceAnalysis {
  const checks: AuditCheck[] = [];
  const recommendations: Recommendation[] = [];

  const scripts = $("script[src], script:not([src])").length;
  const externalScripts = $("script[src]").length;
  const images = $("img");
  const lazyImages = images.filter((_, el) => {
    const loading = $(el).attr("loading");
    const src = $(el).attr("src") || "";
    return loading === "lazy" || src.startsWith("data:");
  }).length;
  const modernImages = images.filter((_, el) => {
    const src = ($(el).attr("src") || "").toLowerCase();
    return (
      src.includes(".webp") ||
      src.includes(".avif") ||
      $(el).attr("srcset") !== undefined
    );
  }).length;

  // Page size
  checks.push(
    makeCheck({
      category: "Performance",
      name: "page size",
      description: "HTML document size as a performance signal.",
      status:
        pageBytes <= 200_000
          ? "pass"
          : pageBytes <= 500_000
            ? "warning"
            : "fail",
      value: pageBytes,
      details: formatBytes(pageBytes),
    })
  );
  if (pageBytes > 200_000) {
    recommendations.push(
      makeRecommendation({
        category: "Performance",
        title: "Reduce HTML payload size",
        description: `Document size is ${formatBytes(pageBytes)}, which may slow crawlers.`,
        priority: "medium",
        impact: "medium",
        suggestedFix:
          "Minify HTML, defer non-critical scripts, and avoid large inline payloads.",
      })
    );
  }

  // Image optimization
  if (images.length > 0) {
    const ratio = modernImages / images.length;
    checks.push(
      makeCheck({
        category: "Performance",
        name: "image optimization",
        description: "Modern formats and responsive images improve crawl efficiency.",
        status: ratio >= 0.4 || lazyImages > 0 ? "pass" : "warning",
        details: `${modernImages} modern/responsive · ${lazyImages} lazy-loaded of ${images.length}`,
      })
    );
    if (ratio < 0.4 && lazyImages === 0) {
      recommendations.push(
        makeRecommendation({
          category: "Performance",
          title: "Optimize images",
          description:
            "Unoptimized images increase page weight and hurt crawler budgets.",
          priority: "medium",
          impact: "medium",
          suggestedFix:
            "Serve WebP/AVIF, add srcset, and use loading=\"lazy\" for below-the-fold images.",
        })
      );
    }
  } else {
    checks.push(
      makeCheck({
        category: "Performance",
        name: "image optimization",
        description: "No images to evaluate.",
        status: "info",
      })
    );
  }

  // Script count
  checks.push(
    makeCheck({
      category: "Performance",
      name: "script count",
      description: "Excessive scripts can delay rendering and indexing.",
      status: scripts <= 15 ? "pass" : scripts <= 30 ? "warning" : "fail",
      value: scripts,
      details: `${scripts} script tag(s), ${externalScripts} external`,
    })
  );
  if (scripts > 15) {
    recommendations.push(
      makeRecommendation({
        category: "Performance",
        title: "Reduce JavaScript footprint",
        description: `${scripts} scripts detected on the page.`,
        priority: "medium",
        impact: "medium",
        suggestedFix:
          "Audit third-party scripts, code-split, and defer non-critical JavaScript.",
      })
    );
  }

  // Loading indicators
  checks.push(
    makeCheck({
      category: "Performance",
      name: "loading indicators",
      description: "Server response time for the HTML document.",
      status:
        loadTimeMs <= 2000
          ? "pass"
          : loadTimeMs <= 5000
            ? "warning"
            : "fail",
      value: loadTimeMs,
      details: `${loadTimeMs} ms to fetch HTML`,
    })
  );
  if (loadTimeMs > 2000) {
    recommendations.push(
      makeRecommendation({
        category: "Performance",
        title: "Improve server response time",
        description: `HTML fetched in ${loadTimeMs} ms.`,
        priority: loadTimeMs > 5000 ? "high" : "medium",
        impact: "high",
        suggestedFix:
          "Enable CDN caching, optimize origin TTFB, and compress responses (gzip/brotli).",
      })
    );
  }

  return { checks, recommendations };
}
