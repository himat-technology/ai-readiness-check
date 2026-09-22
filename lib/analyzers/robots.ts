import robotsParser from "robots-parser";
import type { AuditCheck, CrawlerStatus, Recommendation } from "@/types";
import { absoluteUrl } from "@/lib/utils";
import { makeCheck, makeRecommendation } from "@/lib/scoring/engine";
import { fetchResource } from "./fetch";

export const AI_CRAWLERS = [
  { name: "GPTBot", userAgent: "GPTBot" },
  { name: "ChatGPT-User", userAgent: "ChatGPT-User" },
  { name: "Google-Extended", userAgent: "Google-Extended" },
  { name: "ClaudeBot", userAgent: "ClaudeBot" },
  { name: "PerplexityBot", userAgent: "PerplexityBot" },
  { name: "Bingbot", userAgent: "Bingbot" },
  { name: "Googlebot", userAgent: "Googlebot" },
  { name: "anthropic-ai", userAgent: "anthropic-ai" },
  { name: "CCBot", userAgent: "CCBot" },
] as const;

export interface RobotsAnalysis {
  checks: AuditCheck[];
  recommendations: Recommendation[];
  crawlers: CrawlerStatus[];
  sitemaps: string[];
  robotsUrl: string;
  exists: boolean;
  content: string;
}

export async function analyzeRobots(baseUrl: string): Promise<RobotsAnalysis> {
  const robotsUrl = absoluteUrl(baseUrl, "/robots.txt");
  const result = await fetchResource(robotsUrl, {
    accept: "text/plain,*/*",
  });

  const checks: AuditCheck[] = [];
  const recommendations: Recommendation[] = [];
  const crawlers: CrawlerStatus[] = [];
  let sitemaps: string[] = [];

  if (!result.ok || result.status === 404) {
    checks.push(
      makeCheck({
        category: "Crawlability",
        name: "robots.txt found",
        description: "robots.txt should be available at the site root.",
        status: "fail",
        details: result.error || `HTTP ${result.status}`,
      })
    );
    recommendations.push(
      makeRecommendation({
        category: "Crawlability",
        title: "Create a robots.txt file",
        description:
          "AI crawlers and search engines look for robots.txt to understand crawl permissions.",
        priority: "high",
        impact: "high",
        suggestedFix:
          "Add a robots.txt at your domain root with Sitemap directives and explicit Allow rules for AI crawlers you want to permit.",
      })
    );

    for (const bot of AI_CRAWLERS) {
      crawlers.push({
        name: bot.name,
        userAgent: bot.userAgent,
        status: "unknown",
        details: "No robots.txt available to evaluate.",
      });
    }

    return {
      checks,
      recommendations,
      crawlers,
      sitemaps: [],
      robotsUrl,
      exists: false,
      content: "",
    };
  }

  checks.push(
    makeCheck({
      category: "Crawlability",
      name: "robots.txt found",
      description: "robots.txt is present and accessible.",
      status: "pass",
      details: `HTTP ${result.status}`,
      value: robotsUrl,
    })
  );

  checks.push(
    makeCheck({
      category: "Crawlability",
      name: "robots.txt accessible",
      description: "robots.txt responds successfully.",
      status: result.status === 200 ? "pass" : "warning",
      details: `HTTP ${result.status}`,
    })
  );

  const robots = robotsParser(robotsUrl, result.data);
  sitemaps = robots.getSitemaps();

  const hasDisallowAll =
    /^\s*User-agent:\s*\*\s*$/im.test(result.data) &&
    /^\s*Disallow:\s*\/\s*$/im.test(result.data);

  checks.push(
    makeCheck({
      category: "Crawlability",
      name: "crawl directives",
      description: "Site is not fully blocked for all user agents.",
      status: hasDisallowAll ? "fail" : "pass",
      details: hasDisallowAll
        ? "Disallow: / detected for User-agent: *"
        : "No site-wide Disallow: / for all agents.",
    })
  );

  if (hasDisallowAll) {
    recommendations.push(
      makeRecommendation({
        category: "Crawlability",
        title: "Remove global crawl block",
        description:
          "Your robots.txt blocks all crawlers with Disallow: /, which prevents AI discovery.",
        priority: "high",
        impact: "high",
        suggestedFix:
          "Replace Disallow: / with selective path rules, or Allow AI crawlers you want indexing your content.",
      })
    );
  }

  const blockedResources =
    result.data.match(/Disallow:\s*(\/\S*)/gi)?.length ?? 0;
  checks.push(
    makeCheck({
      category: "Crawlability",
      name: "blocked resources",
      description: "Count of Disallow directives in robots.txt.",
      status: blockedResources > 50 ? "warning" : "pass",
      details: `${blockedResources} Disallow directive(s) found`,
      value: blockedResources,
    })
  );

  for (const bot of AI_CRAWLERS) {
    const allowed = robots.isAllowed(baseUrl, bot.userAgent);
    let status: CrawlerStatus["status"] = "unknown";
    let details = "Could not determine permission.";

    if (allowed === true) {
      status = "allowed";
      details = `Allowed to crawl ${baseUrl}`;
    } else if (allowed === false) {
      status = "blocked";
      details = `Blocked from crawling ${baseUrl}`;
    }

    crawlers.push({
      name: bot.name,
      userAgent: bot.userAgent,
      status,
      details,
    });
  }

  const blockedAi = crawlers.filter(
    (c) =>
      c.status === "blocked" &&
      ["GPTBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Google-Extended"].includes(
        c.name
      )
  );

  checks.push(
    makeCheck({
      category: "Crawlability",
      name: "AI crawler permissions",
      description: "Major AI crawlers are permitted to access the site.",
      status:
        blockedAi.length === 0
          ? "pass"
          : blockedAi.length >= 3
            ? "fail"
            : "warning",
      details:
        blockedAi.length === 0
          ? "Primary AI crawlers appear allowed."
          : `Blocked: ${blockedAi.map((c) => c.name).join(", ")}`,
    })
  );

  if (blockedAi.length > 0) {
    recommendations.push(
      makeRecommendation({
        category: "Crawlability",
        title: "Allow key AI crawlers",
        description: `${blockedAi.map((c) => c.name).join(", ")} are blocked in robots.txt, reducing AI citation opportunities.`,
        priority: "high",
        impact: "high",
        suggestedFix:
          "Add explicit Allow rules for GPTBot, ClaudeBot, PerplexityBot, and Google-Extended if you want AI systems to learn from and cite your content.",
      })
    );
  }

  if (sitemaps.length === 0) {
    recommendations.push(
      makeRecommendation({
        category: "Sitemap Health",
        title: "Reference sitemap in robots.txt",
        description:
          "No Sitemap directive found in robots.txt. AI and search crawlers use this to discover URLs efficiently.",
        priority: "medium",
        impact: "medium",
        suggestedFix:
          "Add a line like: Sitemap: https://yoursite.com/sitemap.xml",
      })
    );
  }

  return {
    checks,
    recommendations,
    crawlers,
    sitemaps,
    robotsUrl,
    exists: true,
    content: result.data,
  };
}
