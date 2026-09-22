import type { CheerioAPI } from "cheerio";
import type { AuditCheck, Recommendation } from "@/types";
import { makeCheck, makeRecommendation } from "@/lib/scoring/engine";

export interface ContentAnalysis {
  checks: AuditCheck[];
  recommendations: Recommendation[];
  wordCount: number;
  h1Count: number;
}

export function analyzeContentQuality($: CheerioAPI): ContentAnalysis {
  const checks: AuditCheck[] = [];
  const recommendations: Recommendation[] = [];

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText ? bodyText.split(/\s+/).length : 0;

  const h1Count = $("h1").length;
  const headings = ["h1", "h2", "h3", "h4", "h5", "h6"].map((tag) => ({
    tag,
    count: $(tag).length,
  }));

  const semanticTags = ["main", "article", "section", "nav", "header", "footer", "aside"];
  const semanticPresent = semanticTags.filter((tag) => $(tag).length > 0);

  const images = $("img");
  const imagesWithoutAlt = images.filter((_, el) => !$(el).attr("alt")?.trim()).length;

  const titles = $("title")
    .map((_, el) => $(el).text().trim())
    .get();
  const duplicateTitle = titles.length > 1;

  // H1
  checks.push(
    makeCheck({
      category: "Content Quality",
      name: "H1 count",
      description: "Pages should typically have exactly one H1.",
      status: h1Count === 1 ? "pass" : h1Count === 0 ? "fail" : "warning",
      value: h1Count,
      details: `${h1Count} H1 heading(s)`,
    })
  );
  if (h1Count !== 1) {
    recommendations.push(
      makeRecommendation({
        category: "Content Quality",
        title: h1Count === 0 ? "Add an H1 heading" : "Use a single H1",
        description:
          "Clear heading hierarchy helps AI systems extract topic and structure.",
        priority: "high",
        impact: "medium",
        suggestedFix:
          h1Count === 0
            ? "Add one descriptive H1 that states the primary topic of the page."
            : "Keep a single primary H1 and demote additional headings to H2+.",
      })
    );
  }

  // Heading hierarchy
  const hasH2 = (headings.find((h) => h.tag === "h2")?.count ?? 0) > 0;
  checks.push(
    makeCheck({
      category: "Content Quality",
      name: "heading hierarchy",
      description: "Logical heading structure supports answer extraction.",
      status: h1Count >= 1 && hasH2 ? "pass" : h1Count >= 1 ? "warning" : "fail",
      details: headings.map((h) => `${h.tag.toUpperCase()}:${h.count}`).join(" · "),
    })
  );

  // Content length
  checks.push(
    makeCheck({
      category: "Content Quality",
      name: "content length",
      description: "Substantial content improves AI citation potential.",
      status:
        wordCount >= 300 ? "pass" : wordCount >= 100 ? "warning" : "fail",
      value: wordCount,
      details: `Approx. ${wordCount} words`,
    })
  );
  if (wordCount < 300) {
    recommendations.push(
      makeRecommendation({
        category: "Content Quality",
        title: "Expand substantive content",
        description:
          "Thin pages are less likely to be cited by AI answer engines.",
        priority: wordCount < 100 ? "high" : "medium",
        impact: "high",
        suggestedFix:
          "Add clear explanations, FAQs, examples, and authoritative details related to the page topic.",
      })
    );
  }

  // Semantic HTML
  checks.push(
    makeCheck({
      category: "Content Quality",
      name: "semantic HTML",
      description: "Semantic landmarks improve machine understanding.",
      status:
        semanticPresent.length >= 3
          ? "pass"
          : semanticPresent.length >= 1
            ? "warning"
            : "fail",
      details:
        semanticPresent.length > 0
          ? `Found: ${semanticPresent.join(", ")}`
          : "No semantic landmarks found.",
    })
  );
  if (semanticPresent.length < 3) {
    recommendations.push(
      makeRecommendation({
        category: "Content Quality",
        title: "Use semantic HTML landmarks",
        description:
          "Elements like main, article, and section help AI parse page structure.",
        priority: "medium",
        impact: "medium",
        suggestedFix:
          "Wrap primary content in <main> / <article> and group related blocks with <section>.",
      })
    );
  }

  // Readability indicators (simple heuristic)
  const sentences = bodyText.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgWords =
    sentences.length > 0 ? wordCount / sentences.length : wordCount;
  checks.push(
    makeCheck({
      category: "Content Quality",
      name: "readability indicators",
      description: "Average sentence length as a simple readability signal.",
      status: avgWords <= 25 ? "pass" : avgWords <= 35 ? "warning" : "fail",
      details: `Avg ~${avgWords.toFixed(1)} words/sentence`,
    })
  );

  // Image alts
  if (images.length > 0) {
    checks.push(
      makeCheck({
        category: "Content Quality",
        name: "image alt attributes",
        description: "Alt text improves accessibility and multimodal AI understanding.",
        status:
          imagesWithoutAlt === 0
            ? "pass"
            : imagesWithoutAlt / images.length > 0.3
              ? "fail"
              : "warning",
        details: `${images.length - imagesWithoutAlt}/${images.length} images have alt text`,
      })
    );
    if (imagesWithoutAlt > 0) {
      recommendations.push(
        makeRecommendation({
          category: "Content Quality",
          title: "Add image alt text",
          description: `${imagesWithoutAlt} image(s) are missing alt attributes.`,
          priority: "medium",
          impact: "medium",
          suggestedFix:
            "Provide concise, descriptive alt text for informative images; use empty alt for decorative ones.",
        })
      );
    }
  } else {
    checks.push(
      makeCheck({
        category: "Content Quality",
        name: "image alt attributes",
        description: "No images detected on the page.",
        status: "info",
        details: "N/A",
      })
    );
  }

  // Duplicate metadata
  checks.push(
    makeCheck({
      category: "Content Quality",
      name: "duplicate metadata",
      description: "Multiple title tags can confuse parsers.",
      status: duplicateTitle ? "warning" : "pass",
      details: duplicateTitle
        ? "Multiple <title> tags detected."
        : "No duplicate title tags detected.",
    })
  );

  return { checks, recommendations, wordCount, h1Count };
}
