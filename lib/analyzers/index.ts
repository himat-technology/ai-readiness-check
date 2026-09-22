import * as cheerio from "cheerio";
import type { AnalyzeApiResponse, ScoreBreakdown, WebsiteReport } from "@/types";
import { ensureHttps, getScoreLevel, normalizeUrl } from "@/lib/utils";
import {
  CATEGORY_WEIGHTS,
  computeWeightedScore,
  createCategoryScore,
  prioritizeRecommendations,
} from "@/lib/scoring/engine";
import { fetchResource } from "./fetch";
import { analyzeRobots } from "./robots";
import { analyzeSitemap } from "./sitemap";
import { analyzeTechnicalSeo } from "./seo";
import { analyzeContentQuality } from "./content";
import { analyzeStructuredData } from "./schema";
import { analyzePerformance } from "./performance";
import { analyzePlatformReadiness } from "./platforms";

function errorResponse(error: string): AnalyzeApiResponse {
  return {
    success: false,
    score: 0,
    level: "poor",
    categories: {
      crawlability: 0,
      sitemapHealth: 0,
      technicalSeo: 0,
      contentQuality: 0,
      aiDiscoverability: 0,
      performance: 0,
    },
    checks: [],
    recommendations: [],
    crawlers: [],
    schemas: {
      items: [],
      foundTypes: [],
      missingTypes: [],
      jsonLdCount: 0,
      microdataCount: 0,
      rdfaCount: 0,
    },
    platforms: [],
    report: {} as WebsiteReport,
    error,
  };
}

export async function analyzeWebsite(rawUrl: string): Promise<AnalyzeApiResponse> {
  let url: string;
  try {
    url = normalizeUrl(rawUrl);
  } catch {
    return errorResponse("Please provide a valid URL.");
  }

  const httpsCheck = ensureHttps(url);
  const page = await fetchResource(url);

  if (!page.ok || !page.data) {
    return errorResponse(
      page.error ||
        `Unable to fetch website (HTTP ${page.status}). Ensure the URL is publicly accessible.`
    );
  }

  const finalUrl = page.finalUrl || url;
  const $ = cheerio.load(page.data);

  const robots = await analyzeRobots(finalUrl);
  const sitemap = await analyzeSitemap(finalUrl, robots.sitemaps);
  const seo = analyzeTechnicalSeo($, finalUrl);
  const content = analyzeContentQuality($);
  const schema = analyzeStructuredData($);
  const performance = analyzePerformance($, page.bytes, page.elapsedMs);

  const crawlabilityChecks = [...robots.checks];
  crawlabilityChecks.push({
    id: "https-validation",
    category: "Crawlability",
    name: "HTTPS validation",
    description: httpsCheck.ok
      ? "Site is served over HTTPS."
      : "Site should be served over HTTPS.",
    status: httpsCheck.ok ? "pass" : "warning",
    details: httpsCheck.ok ? "HTTPS detected" : httpsCheck.message,
  });

  const categories: ScoreBreakdown = {
    crawlability: createCategoryScore(
      crawlabilityChecks.filter((c) => c.status !== "info"),
      CATEGORY_WEIGHTS.crawlability
    ),
    sitemapHealth: createCategoryScore(
      sitemap.checks.filter((c) => c.status !== "info"),
      CATEGORY_WEIGHTS.sitemapHealth
    ),
    technicalSeo: createCategoryScore(
      seo.checks.filter((c) => c.status !== "info"),
      CATEGORY_WEIGHTS.technicalSeo
    ),
    contentQuality: createCategoryScore(
      content.checks.filter((c) => c.status !== "info"),
      CATEGORY_WEIGHTS.contentQuality
    ),
    aiDiscoverability: createCategoryScore(
      schema.checks.filter((c) => c.status !== "info"),
      CATEGORY_WEIGHTS.aiDiscoverability
    ),
    performance: createCategoryScore(
      performance.checks.filter((c) => c.status !== "info"),
      CATEGORY_WEIGHTS.performance
    ),
  };

  const score = computeWeightedScore(categories);
  const level = getScoreLevel(score);

  const checks = [
    ...crawlabilityChecks,
    ...sitemap.checks,
    ...seo.checks,
    ...content.checks,
    ...schema.checks,
    ...performance.checks,
  ];

  const recommendations = prioritizeRecommendations([
    ...robots.recommendations,
    ...sitemap.recommendations,
    ...seo.recommendations,
    ...content.recommendations,
    ...schema.recommendations,
    ...performance.recommendations,
    ...(!httpsCheck.ok
      ? [
          {
            id: "enable-https",
            title: "Enable HTTPS",
            description:
              httpsCheck.message ||
              "HTTP sites are less trusted by modern crawlers and users.",
            priority: "high" as const,
            impact: "high" as const,
            suggestedFix:
              "Install a TLS certificate and redirect all HTTP traffic to HTTPS.",
            category: "Crawlability",
          },
        ]
      : []),
  ]);

  const platforms = analyzePlatformReadiness(
    categories,
    robots.crawlers,
    schema.schemas
  );

  const report: WebsiteReport = {
    url,
    finalUrl,
    scannedAt: new Date().toISOString(),
    score,
    level,
    categories,
    checks,
    recommendations,
    crawlers: robots.crawlers,
    schemas: schema.schemas,
    platforms,
    meta: {
      title: seo.title,
      description: seo.description,
      canonical: seo.canonical,
      pageSizeBytes: page.bytes,
      loadTimeMs: page.elapsedMs,
    },
  };

  return {
    success: true,
    score,
    level,
    categories: {
      crawlability: categories.crawlability.score,
      sitemapHealth: categories.sitemapHealth.score,
      technicalSeo: categories.technicalSeo.score,
      contentQuality: categories.contentQuality.score,
      aiDiscoverability: categories.aiDiscoverability.score,
      performance: categories.performance.score,
    },
    checks,
    recommendations,
    crawlers: robots.crawlers,
    schemas: schema.schemas,
    platforms,
    report,
  };
}
