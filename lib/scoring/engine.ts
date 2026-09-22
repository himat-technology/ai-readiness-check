import type { AuditCheck, CategoryScore, Recommendation } from "@/types";

export const CATEGORY_WEIGHTS = {
  crawlability: 0.2,
  sitemapHealth: 0.15,
  technicalSeo: 0.2,
  contentQuality: 0.15,
  aiDiscoverability: 0.15,
  performance: 0.15,
} as const;

export type CategoryKey = keyof typeof CATEGORY_WEIGHTS;

export function createCategoryScore(
  checks: AuditCheck[],
  weight: number
): CategoryScore {
  const passed = checks.filter((c) => c.status === "pass").length;
  const warnings = checks.filter((c) => c.status === "warning").length;
  const failed = checks.filter((c) => c.status === "fail").length;
  const total = passed + warnings + failed;

  if (total === 0) {
    return { score: 0, passed: 0, warnings: 0, failed: 0, weight };
  }

  const raw = (passed * 1 + warnings * 0.5 + failed * 0) / total;
  const score = Math.round(raw * 100);

  return { score, passed, warnings, failed, weight };
}

export function computeWeightedScore(
  categories: Record<CategoryKey, CategoryScore>
): number {
  let total = 0;
  let weightSum = 0;

  for (const key of Object.keys(CATEGORY_WEIGHTS) as CategoryKey[]) {
    const category = categories[key];
    total += category.score * category.weight;
    weightSum += category.weight;
  }

  if (weightSum === 0) return 0;
  return Math.round(total / weightSum);
}

export function prioritizeRecommendations(
  recommendations: Recommendation[]
): Recommendation[] {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const impactOrder = { high: 0, medium: 1, low: 2 };

  return [...recommendations].sort((a, b) => {
    const p = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (p !== 0) return p;
    return impactOrder[a.impact] - impactOrder[b.impact];
  });
}

export function makeCheck(
  partial: Omit<AuditCheck, "id"> & { id?: string }
): AuditCheck {
  return {
    id: partial.id ?? `${partial.category}-${partial.name}`.toLowerCase().replace(/\s+/g, "-"),
    ...partial,
  };
}

export function makeRecommendation(
  partial: Omit<Recommendation, "id"> & { id?: string }
): Recommendation {
  return {
    id:
      partial.id ??
      `${partial.category}-${partial.title}`.toLowerCase().replace(/\s+/g, "-"),
    ...partial,
  };
}
