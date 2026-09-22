"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE } from "@/lib/site";

const FAQS = [
  {
    q: "What is an AI Readiness Check?",
    a: "It evaluates how prepared your website is for AI-powered search, answer engines, and LLM crawlers — covering robots.txt, sitemaps, metadata, structured data, content signals, and performance.",
  },
  {
    q: "Which AI platforms are considered?",
    a: "Compatibility estimates cover ChatGPT, Google AI Overviews, Perplexity, Gemini, Claude, and Bing Copilot based on crawler access, technical SEO, and schema quality.",
  },
  {
    q: "Where can I try the public demo?",
    a: `Open the live Himat Technology demo at ${SITE.demo}`,
  },
  {
    q: "How do I contact Himat Technology?",
    a: `Email ${SITE.email}, call ${SITE.phone}, or visit ${SITE.websiteLabel}. Follow us on Facebook, LinkedIn, and Instagram.`,
  },
  {
    q: "Is scan history stored on a server?",
    a: "Recent scans are stored only in your browser via localStorage. Clearing history or browser data removes them.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="space-y-4">
      <h2
        id="faq-heading"
        className="font-display text-3xl font-semibold text-slate-900"
      >
        Frequently asked questions
      </h2>
      <Card className="overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-teal-500 via-sky-500 to-orange-500" />
        <CardHeader>
          <CardTitle className="text-base text-slate-600">
            Practical answers from {SITE.brand}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {FAQS.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>
                  {item.q.includes("demo") ? (
                    <>
                      Open the live Himat Technology demo at{" "}
                      <a
                        href={SITE.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-teal-700 underline-offset-2 hover:underline"
                      >
                        himat.tech/free-tools/ai-readiness-check
                      </a>
                      .
                    </>
                  ) : item.q.includes("contact") ? (
                    <>
                      Email{" "}
                      <a
                        href={`mailto:${SITE.email}`}
                        className="font-semibold text-orange-700 underline-offset-2 hover:underline"
                      >
                        {SITE.email}
                      </a>
                      , call{" "}
                      <a
                        href={`tel:${SITE.phoneTel}`}
                        className="font-semibold text-teal-700 underline-offset-2 hover:underline"
                      >
                        {SITE.phone}
                      </a>
                      , or visit{" "}
                      <a
                        href={SITE.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-sky-700 underline-offset-2 hover:underline"
                      >
                        {SITE.websiteLabel}
                      </a>
                      . Follow us on Facebook, LinkedIn, and Instagram.
                    </>
                  ) : (
                    item.a
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
}
