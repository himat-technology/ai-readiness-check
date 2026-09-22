import type { CheerioAPI } from "cheerio";
import type { AuditCheck, Recommendation } from "@/types";
import { makeCheck, makeRecommendation } from "@/lib/scoring/engine";

export interface SeoAnalysis {
  checks: AuditCheck[];
  recommendations: Recommendation[];
  title?: string;
  description?: string;
  canonical?: string;
}

export function analyzeTechnicalSeo($: CheerioAPI, pageUrl: string): SeoAnalysis {
  const checks: AuditCheck[] = [];
  const recommendations: Recommendation[] = [];

  const title = $("title").first().text().trim();
  const description =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[property="og:description"]').attr("content")?.trim() ||
    "";
  const canonical =
    $('link[rel="canonical"]').attr("href")?.trim() ||
    $('meta[property="og:url"]').attr("content")?.trim() ||
    "";
  const hreflangCount = $('link[rel="alternate"][hreflang]').length;

  const ogTitle = $('meta[property="og:title"]').attr("content");
  const ogImage = $('meta[property="og:image"]').attr("content");
  const ogType = $('meta[property="og:type"]').attr("content");
  const twitterCard = $('meta[name="twitter:card"]').attr("content");
  const twitterTitle = $('meta[name="twitter:title"]').attr("content");

  const hasJsonLd = $('script[type="application/ld+json"]').length > 0;

  // Title
  if (!title) {
    checks.push(
      makeCheck({
        category: "Technical SEO",
        name: "title tag",
        description: "Page should include a descriptive <title>.",
        status: "fail",
      })
    );
    recommendations.push(
      makeRecommendation({
        category: "Technical SEO",
        title: "Add a title tag",
        description: "Missing title tags hurt search and AI summarization quality.",
        priority: "high",
        impact: "high",
        suggestedFix:
          "Add a unique, descriptive <title> between 30–60 characters for each important page.",
      })
    );
  } else {
    const len = title.length;
    checks.push(
      makeCheck({
        category: "Technical SEO",
        name: "title tag",
        description: "Title tag present and reasonably sized.",
        status: len < 15 || len > 70 ? "warning" : "pass",
        value: title,
        details: `${len} characters`,
      })
    );
    if (len < 15 || len > 70) {
      recommendations.push(
        makeRecommendation({
          category: "Technical SEO",
          title: "Optimize title length",
          description: `Title is ${len} characters. Ideal range is roughly 30–60.`,
          priority: "medium",
          impact: "medium",
          suggestedFix: "Rewrite the title to be concise, keyword-aware, and unique.",
        })
      );
    }
  }

  // Meta description
  if (!description) {
    checks.push(
      makeCheck({
        category: "Technical SEO",
        name: "meta description",
        description: "Meta description helps snippets and AI grounding.",
        status: "fail",
      })
    );
    recommendations.push(
      makeRecommendation({
        category: "Technical SEO",
        title: "Add a meta description",
        description:
          "Without a meta description, AI systems and search engines invent summaries.",
        priority: "high",
        impact: "high",
        suggestedFix:
          "Add <meta name=\"description\" content=\"...\"> with a clear 120–160 character summary.",
      })
    );
  } else {
    const len = description.length;
    checks.push(
      makeCheck({
        category: "Technical SEO",
        name: "meta description",
        description: "Meta description present.",
        status: len < 50 || len > 180 ? "warning" : "pass",
        value: description.slice(0, 160),
        details: `${len} characters`,
      })
    );
  }

  // Canonical
  checks.push(
    makeCheck({
      category: "Technical SEO",
      name: "canonical tags",
      description: "Canonical URL reduces duplicate content ambiguity.",
      status: canonical ? "pass" : "warning",
      value: canonical || null,
      details: canonical || "No canonical link found.",
    })
  );
  if (!canonical) {
    recommendations.push(
      makeRecommendation({
        category: "Technical SEO",
        title: "Add a canonical URL",
        description:
          "Canonical tags help AI and search engines identify the preferred page version.",
        priority: "medium",
        impact: "medium",
        suggestedFix: `<link rel="canonical" href="${pageUrl}" />`,
      })
    );
  }

  // hreflang
  checks.push(
    makeCheck({
      category: "Technical SEO",
      name: "hreflang",
      description: "hreflang helps multilingual targeting when applicable.",
      status: hreflangCount > 0 ? "pass" : "info",
      value: hreflangCount,
      details:
        hreflangCount > 0
          ? `${hreflangCount} hreflang alternate(s)`
          : "No hreflang tags (OK for single-language sites).",
    })
  );

  // Open Graph
  const ogScore = [ogTitle, ogImage, ogType].filter(Boolean).length;
  checks.push(
    makeCheck({
      category: "Technical SEO",
      name: "Open Graph tags",
      description: "Open Graph improves link previews and social AI surfaces.",
      status: ogScore >= 2 ? "pass" : ogScore === 1 ? "warning" : "fail",
      details: `Found ${ogScore}/3 core OG tags (title, image, type)`,
    })
  );
  if (ogScore < 2) {
    recommendations.push(
      makeRecommendation({
        category: "Technical SEO",
        title: "Complete Open Graph tags",
        description: "Missing OG tags reduce rich preview quality across platforms.",
        priority: "medium",
        impact: "medium",
        suggestedFix:
          "Add og:title, og:description, og:image, and og:type meta properties.",
      })
    );
  }

  // Twitter cards
  checks.push(
    makeCheck({
      category: "Technical SEO",
      name: "Twitter cards",
      description: "Twitter/X card tags support rich sharing.",
      status: twitterCard || twitterTitle ? "pass" : "warning",
      details: twitterCard
        ? `twitter:card=${twitterCard}`
        : "No Twitter card meta tags detected.",
    })
  );

  // Structured data presence (high-level for technical SEO)
  checks.push(
    makeCheck({
      category: "Technical SEO",
      name: "structured data",
      description: "JSON-LD structured data present on the page.",
      status: hasJsonLd ? "pass" : "warning",
      details: hasJsonLd
        ? `${$('script[type="application/ld+json"]').length} JSON-LD block(s)`
        : "No JSON-LD detected.",
    })
  );

  return { checks, recommendations, title, description, canonical };
}
