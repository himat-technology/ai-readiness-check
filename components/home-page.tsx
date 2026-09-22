"use client";

import { useCallback } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Toaster, toast } from "sonner";
import { AnalyzeForm } from "@/components/forms/analyze-form";
import { ScoreDashboard } from "@/components/dashboard/score-dashboard";
import { AnalysisSkeleton } from "@/components/dashboard/analysis-skeleton";
import { AuditResults } from "@/components/reports/audit-results";
import { RecommendationsList } from "@/components/reports/recommendations-list";
import { PlatformCompatibility } from "@/components/reports/platform-compatibility";
import { CrawlerDetection } from "@/components/reports/crawler-detection";
import { SchemaInspector } from "@/components/reports/schema-inspector";
import { ExportActions } from "@/components/reports/export-actions";
import { ScanHistoryList } from "@/components/reports/scan-history";
import { HeroSection } from "@/components/layout/hero-section";
import { FaqSection } from "@/components/layout/faq-section";
import { CtaSection } from "@/components/layout/cta-section";
import { SiteFooter } from "@/components/layout/site-footer";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
} from "@/components/icons/social";
import { useAnalyze } from "@/hooks/use-analyze";
import { useScanHistory } from "@/hooks/use-scan-history";
import { SITE } from "@/lib/site";
import type { AnalyzeApiResponse } from "@/types";

export function HomePage() {
  const { history, addScan, clearHistory } = useScanHistory();

  const handleSuccess = useCallback(
    (data: AnalyzeApiResponse) => {
      addScan({
        url: data.report.finalUrl || data.report.url,
        score: data.score,
        scannedAt: data.report.scannedAt,
      });
      toast.success(`Analysis complete — score ${data.score}/100`);
    },
    [addScan]
  );

  const { form, analyze, reset, loadUrl, result, loading, error } =
    useAnalyze(handleSuccess);

  return (
    <div className="min-h-screen text-slate-900">
      <Toaster richColors position="top-right" />
      <a
        href="#analyze"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow"
      >
        Skip to analyzer
      </a>

      <header className="sticky top-0 z-40 border-b border-white/50 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group min-w-0">
            <span className="block font-display text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-sky-600 to-orange-500 sm:text-xl">
              {SITE.brand}
            </span>
            <span className="block truncate text-xs font-medium text-slate-500 group-hover:text-teal-700">
              {SITE.product}
            </span>
          </Link>
          <nav className="flex items-center gap-2 text-sm font-semibold text-slate-600 sm:gap-3">
            <a href="#analyze" className="hidden hover:text-teal-700 sm:inline">
              Analyze
            </a>
            <a href="#faq" className="hidden hover:text-orange-600 sm:inline">
              FAQ
            </a>
            <a
              href={SITE.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-slate-700 hover:bg-teal-50 hover:text-teal-800 md:inline-flex"
            >
              Demo
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <div className="ml-1 flex items-center gap-1.5">
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href={SITE.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="rounded-lg p-1.5 text-sky-600 hover:bg-sky-50"
              >
                <LinkedInIcon className="h-4 w-4" />
              </a>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            </div>
          </nav>
        </div>
      </header>

      <HeroSection />

      <main className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-6 lg:px-8">
        <section className="space-y-6" aria-labelledby="form-heading">
          <div className="text-center">
            <h2
              id="form-heading"
              className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl"
            >
              Analyze any public website
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-slate-600">
              Enter a URL for a live AI readiness audit — the same idea as our{" "}
              <a
                href={SITE.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-teal-700 underline-offset-2 hover:underline"
              >
                himat.tech demo
              </a>
              .
            </p>
          </div>
          <AnalyzeForm
            form={form}
            loading={loading}
            error={error}
            onSubmit={analyze}
            onReset={reset}
          />
          <div className="mx-auto max-w-3xl">
            <ScanHistoryList
              history={history}
              onSelect={(url) => {
                loadUrl(url);
                toast.message("URL loaded — click Analyze Website");
              }}
              onClear={clearHistory}
            />
          </div>
        </section>

        {loading && <AnalysisSkeleton />}

        {result && !loading && (
          <div className="space-y-16 animate-in fade-in duration-500">
            <ScoreDashboard data={result} />
            <AuditResults checks={result.checks} />
            <PlatformCompatibility platforms={result.platforms} />
            <CrawlerDetection crawlers={result.crawlers} />
            <SchemaInspector schemas={result.schemas} />
            <RecommendationsList recommendations={result.recommendations} />
            <ExportActions data={result} />
          </div>
        )}

        <FaqSection />
        <CtaSection />
      </main>

      <SiteFooter />
    </div>
  );
}
