import type {
  CrawlerStatus,
  PlatformReadiness,
  ScoreBreakdown,
  ScoreLevel,
  SchemaAnalysis,
} from "@/types";
import { getScoreLevel } from "@/lib/utils";

function clamp(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function analyzePlatformReadiness(
  categories: ScoreBreakdown,
  crawlers: CrawlerStatus[],
  schemas: SchemaAnalysis
): PlatformReadiness[] {
  const crawlerScore = (names: string[]) => {
    const relevant = crawlers.filter((c) => names.includes(c.name));
    if (relevant.length === 0) return 50;
    const allowed = relevant.filter((c) => c.status === "allowed").length;
    const blocked = relevant.filter((c) => c.status === "blocked").length;
    if (blocked === relevant.length) return 15;
    if (allowed === relevant.length) return 95;
    return 55 + allowed * 10 - blocked * 15;
  };

  const hasFaq = schemas.foundTypes.some((t) => t.includes("FAQ"));
  const hasOrg = schemas.foundTypes.some((t) => t.includes("Organization"));
  const hasArticle = schemas.foundTypes.some((t) => t.includes("Article"));
  const schemaBoost = (hasFaq ? 8 : 0) + (hasOrg ? 5 : 0) + (hasArticle ? 5 : 0);

  const base =
    categories.crawlability.score * 0.25 +
    categories.technicalSeo.score * 0.25 +
    categories.aiDiscoverability.score * 0.25 +
    categories.contentQuality.score * 0.15 +
    categories.performance.score * 0.1;

  const platforms: Array<{
    platform: string;
    bots: string[];
    extra: number;
    tips: string[];
  }> = [
    {
      platform: "ChatGPT",
      bots: ["GPTBot", "ChatGPT-User"],
      extra: hasFaq ? 5 : 0,
      tips: [
        "Allow GPTBot in robots.txt",
        "Provide clear FAQ and factual content",
        "Use Organization and Article schema",
      ],
    },
    {
      platform: "Google AI Overviews",
      bots: ["Googlebot", "Google-Extended"],
      extra: hasFaq ? 6 : 0,
      tips: [
        "Ensure strong technical SEO and E-E-A-T signals",
        "Keep Google-Extended allowed if you want Gemini training/use",
        "Add FAQ and HowTo structured data where relevant",
      ],
    },
    {
      platform: "Perplexity",
      bots: ["PerplexityBot"],
      extra: hasArticle ? 4 : 0,
      tips: [
        "Allow PerplexityBot",
        "Publish citable, well-sourced pages",
        "Maintain a clean sitemap for discovery",
      ],
    },
    {
      platform: "Gemini",
      bots: ["Google-Extended", "Googlebot"],
      extra: hasOrg ? 4 : 0,
      tips: [
        "Keep crawlability high for Googlebot",
        "Use structured data for entity clarity",
        "Improve page speed and mobile usability",
      ],
    },
    {
      platform: "Claude",
      bots: ["ClaudeBot", "anthropic-ai"],
      extra: hasArticle ? 3 : 0,
      tips: [
        "Allow ClaudeBot / anthropic-ai",
        "Prefer clear headings and long-form authoritative content",
        "Expose canonical URLs and organization identity",
      ],
    },
    {
      platform: "Bing Copilot",
      bots: ["Bingbot"],
      extra: 2,
      tips: [
        "Ensure Bingbot is allowed",
        "Submit sitemap via Bing Webmaster Tools",
        "Use Open Graph and schema for richer answers",
      ],
    },
  ];

  return platforms.map((p) => {
    const score = clamp(
      base * 0.7 + crawlerScore(p.bots) * 0.3 + schemaBoost * 0.3 + p.extra
    );
    const status: ScoreLevel = getScoreLevel(score);
    const recommendations = [...p.tips];

    const blocked = crawlers.filter(
      (c) => p.bots.includes(c.name) && c.status === "blocked"
    );
    if (blocked.length > 0) {
      recommendations.unshift(
        `Unblock ${blocked.map((b) => b.name).join(", ")} in robots.txt`
      );
    }

    return {
      platform: p.platform,
      score,
      status,
      recommendations: recommendations.slice(0, 3),
    };
  });
}
