import type { CheerioAPI } from "cheerio";
import type {
  AuditCheck,
  Recommendation,
  SchemaAnalysis,
  SchemaItem,
} from "@/types";
import { makeCheck, makeRecommendation } from "@/lib/scoring/engine";

const IMPORTANT_TYPES = [
  "Organization",
  "FAQPage",
  "Article",
  "Product",
  "BreadcrumbList",
  "LocalBusiness",
  "WebSite",
  "WebPage",
];

function extractTypes(node: unknown, found: Set<string>) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach((item) => extractTypes(item, found));
    return;
  }
  const obj = node as Record<string, unknown>;
  const typeVal = obj["@type"];
  if (typeof typeVal === "string") found.add(typeVal);
  if (Array.isArray(typeVal)) {
    typeVal.forEach((t) => typeof t === "string" && found.add(t));
  }
  if (obj["@graph"]) extractTypes(obj["@graph"], found);
}

function flattenProperties(node: unknown): Record<string, unknown> {
  if (!node || typeof node !== "object" || Array.isArray(node)) return {};
  const obj = { ...(node as Record<string, unknown>) };
  delete obj["@context"];
  return obj;
}

export interface FullSchemaAnalysis {
  checks: AuditCheck[];
  recommendations: Recommendation[];
  schemas: SchemaAnalysis;
}

export function analyzeStructuredData($: CheerioAPI): FullSchemaAnalysis {
  const checks: AuditCheck[] = [];
  const recommendations: Recommendation[] = [];
  const items: SchemaItem[] = [];
  const foundTypes = new Set<string>();

  // JSON-LD
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).html()?.trim() || "";
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as unknown;
      extractTypes(parsed, foundTypes);

      const nodes = Array.isArray(parsed)
        ? parsed
        : parsed &&
            typeof parsed === "object" &&
            Array.isArray((parsed as Record<string, unknown>)["@graph"])
          ? ((parsed as Record<string, unknown>)["@graph"] as unknown[])
          : [parsed];

      for (const node of nodes) {
        if (!node || typeof node !== "object") continue;
        const typeVal = (node as Record<string, unknown>)["@type"];
        const type =
          typeof typeVal === "string"
            ? typeVal
            : Array.isArray(typeVal)
              ? typeVal.join(", ")
              : "Unknown";
        items.push({
          type,
          format: "json-ld",
          properties: flattenProperties(node),
          valid: true,
          issues: type === "Unknown" ? ["Missing @type"] : [],
          raw: JSON.stringify(node, null, 2).slice(0, 2000),
        });
      }
    } catch {
      items.push({
        type: "Invalid JSON-LD",
        format: "json-ld",
        properties: {},
        valid: false,
        issues: ["Failed to parse JSON-LD block"],
        raw: raw.slice(0, 500),
      });
    }
  });

  // Microdata
  $("[itemscope]").each((_, el) => {
    const type =
      $(el).attr("itemtype")?.split("/").pop() ||
      $(el).attr("itemtype") ||
      "Unknown";
    foundTypes.add(type);
    const properties: Record<string, unknown> = {};
    $(el)
      .find("[itemprop]")
      .each((__, propEl) => {
        const name = $(propEl).attr("itemprop");
        if (!name) return;
        properties[name] =
          $(propEl).attr("content") ||
          $(propEl).attr("href") ||
          $(propEl).text().trim().slice(0, 200);
      });
    items.push({
      type,
      format: "microdata",
      properties,
      valid: type !== "Unknown",
      issues: type === "Unknown" ? ["Missing itemtype"] : [],
    });
  });

  // RDFa
  $("[typeof]").each((_, el) => {
    const type = $(el).attr("typeof") || "Unknown";
    foundTypes.add(type);
    const properties: Record<string, unknown> = {};
    $(el)
      .find("[property]")
      .each((__, propEl) => {
        const name = $(propEl).attr("property");
        if (!name) return;
        properties[name] =
          $(propEl).attr("content") || $(propEl).text().trim().slice(0, 200);
      });
    items.push({
      type,
      format: "rdfa",
      properties,
      valid: true,
      issues: [],
    });
  });

  const foundList = [...foundTypes];
  const missingTypes = IMPORTANT_TYPES.filter(
    (t) =>
      !foundList.some(
        (f) => f === t || f.endsWith(t) || f.toLowerCase() === t.toLowerCase()
      )
  );

  const hasType = (name: string) =>
    foundList.some(
      (f) =>
        f === name ||
        f.endsWith(`/${name}`) ||
        f.toLowerCase() === name.toLowerCase()
    );

  for (const schemaType of [
    "Organization",
    "FAQPage",
    "Article",
    "Product",
    "BreadcrumbList",
    "LocalBusiness",
  ]) {
    const found = hasType(schemaType);
    checks.push(
      makeCheck({
        category: "AI Discoverability",
        name: `${schemaType} schema`,
        description: `${schemaType} structured data ${found ? "found" : "missing"}.`,
        status: found ? "pass" : schemaType === "Organization" || schemaType === "WebSite" ? "warning" : "info",
        details: found ? "Found" : "Missing",
        value: found,
      })
    );
  }

  const jsonLdCount = items.filter((i) => i.format === "json-ld").length;
  const microdataCount = items.filter((i) => i.format === "microdata").length;
  const rdfaCount = items.filter((i) => i.format === "rdfa").length;
  const invalidCount = items.filter((i) => !i.valid).length;

  checks.push(
    makeCheck({
      category: "AI Discoverability",
      name: "Schema.org markup",
      description: "Presence of Schema.org structured data.",
      status: items.length > 0 ? (invalidCount > 0 ? "warning" : "pass") : "fail",
      details:
        items.length > 0
          ? `${items.length} schema item(s); ${invalidCount} invalid`
          : "No structured data detected.",
    })
  );

  if (items.length === 0) {
    recommendations.push(
      makeRecommendation({
        category: "AI Discoverability",
        title: "Add Schema.org structured data",
        description:
          "Structured data helps AI systems understand entities, FAQs, and relationships for citation.",
        priority: "high",
        impact: "high",
        suggestedFix:
          "Add JSON-LD for Organization and WebSite at minimum; add FAQPage, Article, or Product where relevant.",
      })
    );
  }

  if (!hasType("FAQPage")) {
    recommendations.push(
      makeRecommendation({
        category: "AI Discoverability",
        title: "Missing FAQ Schema",
        description:
          "Add FAQ structured data to improve AI answer extraction and citation opportunities.",
        priority: "high",
        impact: "high",
        suggestedFix:
          "Mark up Q&A content with FAQPage JSON-LD containing Question and acceptedAnswer pairs.",
      })
    );
  }

  if (!hasType("Organization")) {
    recommendations.push(
      makeRecommendation({
        category: "AI Discoverability",
        title: "Add Organization schema",
        description:
          "Organization markup strengthens entity recognition across AI platforms.",
        priority: "medium",
        impact: "high",
        suggestedFix:
          "Publish Organization JSON-LD with name, url, logo, and sameAs social profiles.",
      })
    );
  }

  if (!hasType("BreadcrumbList")) {
    recommendations.push(
      makeRecommendation({
        category: "AI Discoverability",
        title: "Add Breadcrumb schema",
        description: "Breadcrumbs help AI and search understand site hierarchy.",
        priority: "low",
        impact: "medium",
        suggestedFix: "Add BreadcrumbList JSON-LD matching your visible breadcrumb navigation.",
      })
    );
  }

  if (invalidCount > 0) {
    recommendations.push(
      makeRecommendation({
        category: "AI Discoverability",
        title: "Fix invalid structured data",
        description: `${invalidCount} structured data block(s) failed validation/parsing.`,
        priority: "high",
        impact: "medium",
        suggestedFix:
          "Validate JSON-LD with Google Rich Results Test or Schema Markup Validator and fix syntax errors.",
      })
    );
  }

  const schemas: SchemaAnalysis = {
    items,
    foundTypes: foundList,
    missingTypes,
    jsonLdCount,
    microdataCount,
    rdfaCount,
  };

  return { checks, recommendations, schemas };
}
