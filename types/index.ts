export type CheckStatus = "pass" | "warning" | "fail" | "info";

export type Priority = "high" | "medium" | "low";

export type Impact = "high" | "medium" | "low";

export type ScoreLevel = "excellent" | "good" | "needs_improvement" | "poor";

export interface AuditCheck {
  id: string;
  category: string;
  name: string;
  description: string;
  status: CheckStatus;
  details?: string;
  value?: string | number | boolean | null;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  impact: Impact;
  suggestedFix: string;
  category: string;
}

export interface CategoryScore {
  score: number;
  passed: number;
  warnings: number;
  failed: number;
  weight: number;
}

export interface ScoreBreakdown {
  crawlability: CategoryScore;
  sitemapHealth: CategoryScore;
  technicalSeo: CategoryScore;
  contentQuality: CategoryScore;
  aiDiscoverability: CategoryScore;
  performance: CategoryScore;
}

export type CrawlerAccess = "allowed" | "blocked" | "unknown";

export interface CrawlerStatus {
  name: string;
  userAgent: string;
  status: CrawlerAccess;
  details: string;
}

export interface SchemaItem {
  type: string;
  format: "json-ld" | "microdata" | "rdfa";
  properties: Record<string, unknown>;
  valid: boolean;
  issues: string[];
  raw?: string;
}

export interface SchemaAnalysis {
  items: SchemaItem[];
  foundTypes: string[];
  missingTypes: string[];
  jsonLdCount: number;
  microdataCount: number;
  rdfaCount: number;
}

export interface PlatformReadiness {
  platform: string;
  score: number;
  status: ScoreLevel;
  recommendations: string[];
}

export interface WebsiteReport {
  url: string;
  finalUrl: string;
  scannedAt: string;
  score: number;
  level: ScoreLevel;
  categories: ScoreBreakdown;
  checks: AuditCheck[];
  recommendations: Recommendation[];
  crawlers: CrawlerStatus[];
  schemas: SchemaAnalysis;
  platforms: PlatformReadiness[];
  meta: {
    title?: string;
    description?: string;
    canonical?: string;
    pageSizeBytes: number;
    loadTimeMs: number;
  };
}

export interface AnalyzeApiResponse {
  success: boolean;
  score: number;
  level: ScoreLevel;
  categories: {
    crawlability: number;
    sitemapHealth: number;
    technicalSeo: number;
    contentQuality: number;
    aiDiscoverability: number;
    performance: number;
  };
  checks: AuditCheck[];
  recommendations: Recommendation[];
  crawlers: CrawlerStatus[];
  schemas: SchemaAnalysis;
  platforms: PlatformReadiness[];
  report: WebsiteReport;
  error?: string;
}

export interface ScanHistory {
  id: string;
  url: string;
  score: number;
  scannedAt: string;
}

export interface AnalyzeRequest {
  url: string;
}
