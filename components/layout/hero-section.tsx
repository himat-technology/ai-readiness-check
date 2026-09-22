"use client";

import { ArrowRight, Bot, ExternalLink, Radar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-teal-900/10">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#ecfeff_0%,#fff7ed_42%,#f0f9ff_78%,#fdf2f8_100%)]" />
      <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 animate-float rounded-full bg-orange-400/25 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-24 h-56 w-56 rounded-full bg-sky-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-teal-400/30 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-3xl space-y-6">
          <p className="font-display text-sm font-bold uppercase tracking-[0.24em] text-teal-700">
            {SITE.brand}
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            <span className="brand-gradient-text">{SITE.product}</span>
            <span className="mt-2 block text-slate-900">
              See if AI search can find and cite your site.
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-slate-600 sm:text-xl">
            Colorful, actionable audits for crawlability, sitemaps, structured data,
            and AI crawlers — built by Himat Technology for modern discovery.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-to-r from-teal-600 via-sky-600 to-orange-500 text-white shadow-lg shadow-orange-500/20 hover:from-teal-700 hover:via-sky-700 hover:to-orange-600">
              <a href="#analyze">
                Start free analysis
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-teal-300 bg-white/80 text-teal-900 hover:bg-teal-50">
              <a href={SITE.demo} target="_blank" rel="noopener noreferrer">
                View live demo
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Radar,
              title: "Real site scans",
              text: "Fetches live HTML, robots.txt, and sitemaps — not placeholder scores.",
              tone: "from-teal-500 to-emerald-400",
              iconBg: "bg-teal-100 text-teal-700",
            },
            {
              icon: Bot,
              title: "AI crawler map",
              text: "See whether GPTBot, ClaudeBot, PerplexityBot, and others are allowed.",
              tone: "from-sky-500 to-blue-400",
              iconBg: "bg-sky-100 text-sky-700",
            },
            {
              icon: Sparkles,
              title: "Actionable fixes",
              text: "Prioritized recommendations with estimated impact for faster wins.",
              tone: "from-orange-500 to-rose-400",
              iconBg: "bg-orange-100 text-orange-700",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/75 p-5 shadow-md shadow-slate-900/5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.tone}`}
              />
              <div
                className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg}`}
              >
                <item.icon className="h-5 w-5" aria-hidden />
              </div>
              <h2 className="font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
