import { XMLParser } from "fast-xml-parser";
import type { AuditCheck, Recommendation } from "@/types";
import { absoluteUrl } from "@/lib/utils";
import { makeCheck, makeRecommendation } from "@/lib/scoring/engine";
import { fetchResource } from "./fetch";

export interface SitemapAnalysis {
  checks: AuditCheck[];
  recommendations: Recommendation[];
  urlCount: number;
  sitemapUrl: string | null;
  isIndex: boolean;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

function countUrls(parsed: unknown): { count: number; isIndex: boolean } {
  if (!parsed || typeof parsed !== "object") {
    return { count: 0, isIndex: false };
  }

  const root = parsed as Record<string, unknown>;

  if (root.sitemapindex) {
    const index = root.sitemapindex as Record<string, unknown>;
    const sitemaps = index.sitemap;
    const list = Array.isArray(sitemaps) ? sitemaps : sitemaps ? [sitemaps] : [];
    return { count: list.length, isIndex: true };
  }

  if (root.urlset) {
    const urlset = root.urlset as Record<string, unknown>;
    const urls = urlset.url;
    const list = Array.isArray(urls) ? urls : urls ? [urls] : [];
    return { count: list.length, isIndex: false };
  }

  return { count: 0, isIndex: false };
}

export async function analyzeSitemap(
  baseUrl: string,
  robotsSitemaps: string[]
): Promise<SitemapAnalysis> {
  const candidates = [
    ...robotsSitemaps,
    absoluteUrl(baseUrl, "/sitemap.xml"),
    absoluteUrl(baseUrl, "/sitemap_index.xml"),
    absoluteUrl(baseUrl, "/sitemap-index.xml"),
  ];

  const uniqueCandidates = [...new Set(candidates)];
  const checks: AuditCheck[] = [];
  const recommendations: Recommendation[] = [];

  let foundUrl: string | null = null;
  let content = "";
  let linkedInRobots = false;

  const results = await Promise.all(
    uniqueCandidates.map(async (candidate) => {
      const result = await fetchResource(candidate, {
        accept: "application/xml,text/xml,*/*",
        timeout: 8000,
      });
      return { candidate, result };
    })
  );

  for (const { candidate, result } of results) {
    if (result.ok && result.data.includes("<")) {
      foundUrl = result.finalUrl || candidate;
      content = result.data;
      linkedInRobots = robotsSitemaps.some(
        (s) => s.replace(/\/$/, "") === candidate.replace(/\/$/, "")
      );
      break;
    }
  }

  if (!foundUrl) {
    checks.push(
      makeCheck({
        category: "Sitemap Health",
        name: "sitemap.xml exists",
        description: "A sitemap should be available for URL discovery.",
        status: "fail",
        details: "No sitemap found at common locations.",
      }),
      makeCheck({
        category: "Sitemap Health",
        name: "sitemap accessible",
        description: "Sitemap must be reachable over HTTP.",
        status: "fail",
      }),
      makeCheck({
        category: "Sitemap Health",
        name: "sitemap valid XML",
        description: "Sitemap should be well-formed XML.",
        status: "fail",
      }),
      makeCheck({
        category: "Sitemap Health",
        name: "sitemap linked in robots.txt",
        description: "robots.txt should reference the sitemap.",
        status: robotsSitemaps.length > 0 ? "warning" : "fail",
        details:
          robotsSitemaps.length > 0
            ? "robots.txt lists a sitemap, but it was not reachable."
            : "No Sitemap directive in robots.txt.",
      })
    );

    recommendations.push(
      makeRecommendation({
        category: "Sitemap Health",
        title: "Publish an XML sitemap",
        description:
          "Without a sitemap, AI systems and search engines discover pages more slowly and incompletely.",
        priority: "high",
        impact: "high",
        suggestedFix:
          "Generate sitemap.xml (or a sitemap index), host it at /sitemap.xml, and reference it in robots.txt.",
      })
    );

    return {
      checks,
      recommendations,
      urlCount: 0,
      sitemapUrl: null,
      isIndex: false,
    };
  }

  checks.push(
    makeCheck({
      category: "Sitemap Health",
      name: "sitemap.xml exists",
      description: "Sitemap discovered successfully.",
      status: "pass",
      value: foundUrl,
    }),
    makeCheck({
      category: "Sitemap Health",
      name: "sitemap accessible",
      description: "Sitemap responds successfully.",
      status: "pass",
      details: foundUrl,
    })
  );

  let urlCount = 0;
  let isIndex = false;
  let validXml = true;

  try {
    const parsed = parser.parse(content);
    const counted = countUrls(parsed);
    urlCount = counted.count;
    isIndex = counted.isIndex;
    if (urlCount === 0 && !content.includes("<url>") && !content.includes("<sitemap>")) {
      validXml = false;
    }
  } catch {
    validXml = false;
  }

  checks.push(
    makeCheck({
      category: "Sitemap Health",
      name: "sitemap valid XML",
      description: "Sitemap parses as valid XML with URL entries.",
      status: validXml ? "pass" : "fail",
      details: validXml ? "Valid XML structure detected." : "XML parse failed or empty.",
    }),
    makeCheck({
      category: "Sitemap Health",
      name: "URL count",
      description: "Sitemap contains discoverable URLs.",
      status: urlCount > 0 ? "pass" : "warning",
      value: urlCount,
      details: isIndex
        ? `Sitemap index with ${urlCount} child sitemap(s)`
        : `${urlCount} URL(s) listed`,
    }),
    makeCheck({
      category: "Sitemap Health",
      name: "index sitemap support",
      description: "Sitemap index helps large sites scale discovery.",
      status: isIndex || urlCount > 0 ? "pass" : "info",
      details: isIndex
        ? "Sitemap index detected."
        : "Standard urlset sitemap detected.",
    }),
    makeCheck({
      category: "Sitemap Health",
      name: "sitemap linked in robots.txt",
      description: "robots.txt should reference the sitemap URL.",
      status: linkedInRobots || robotsSitemaps.length > 0 ? "pass" : "warning",
      details:
        linkedInRobots || robotsSitemaps.length > 0
          ? "Sitemap referenced in robots.txt."
          : "Consider adding a Sitemap directive.",
    })
  );

  if (!validXml) {
    recommendations.push(
      makeRecommendation({
        category: "Sitemap Health",
        title: "Fix invalid sitemap XML",
        description: "The sitemap could not be parsed as valid XML.",
        priority: "high",
        impact: "high",
        suggestedFix:
          "Validate your sitemap with an XML validator and regenerate it from your CMS or static site generator.",
      })
    );
  }

  if (urlCount === 0 && validXml) {
    recommendations.push(
      makeRecommendation({
        category: "Sitemap Health",
        title: "Populate sitemap with URLs",
        description: "The sitemap appears empty, limiting AI and search discovery.",
        priority: "high",
        impact: "medium",
        suggestedFix:
          "Ensure all important public pages are included in your sitemap generation pipeline.",
      })
    );
  }

  if (!linkedInRobots && robotsSitemaps.length === 0) {
    recommendations.push(
      makeRecommendation({
        category: "Sitemap Health",
        title: "Link sitemap from robots.txt",
        description: "Your sitemap exists but is not declared in robots.txt.",
        priority: "medium",
        impact: "medium",
        suggestedFix: `Add: Sitemap: ${foundUrl}`,
      })
    );
  }

  return {
    checks,
    recommendations,
    urlCount,
    sitemapUrl: foundUrl,
    isIndex,
  };
}
