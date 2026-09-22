import { Mail, Phone, Globe, ExternalLink } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
} from "@/components/icons/social";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-teal-900/10 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 text-slate-200">
      <div className="pointer-events-none absolute -right-10 top-0 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <p className="font-display text-2xl font-semibold text-white">
            {SITE.brand}
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-teal-100/80">
            {SITE.product} helps website owners optimize for AI search, answer
            engines, and modern crawlers.
          </p>
          <a
            href={SITE.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:brightness-110"
          >
            Live demo on himat.tech
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300">
            Contact
          </p>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a
                href={SITE.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-teal-50 hover:text-white"
              >
                <Globe className="h-4 w-4 text-sky-300" />
                {SITE.websiteLabel}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-2 text-teal-50 hover:text-white"
              >
                <Mail className="h-4 w-4 text-orange-300" />
                {SITE.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${SITE.phoneTel}`}
                className="inline-flex items-center gap-2 text-teal-50 hover:text-white"
              >
                <Phone className="h-4 w-4 text-emerald-300" />
                {SITE.phone}
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
            Follow us
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Himat Technology on Facebook"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 text-blue-200 ring-1 ring-blue-400/30 transition hover:bg-blue-500/35 hover:text-white"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a
              href={SITE.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Himat Technology on LinkedIn"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/20 text-sky-200 ring-1 ring-sky-400/30 transition hover:bg-sky-500/35 hover:text-white"
            >
              <LinkedInIcon className="h-5 w-5" />
            </a>
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Himat Technology on Instagram"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/30 to-rose-500/30 text-orange-100 ring-1 ring-orange-400/30 transition hover:brightness-125"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-teal-100/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {SITE.brand}. All rights reserved.
          </p>
          <p>
            Demo ·{" "}
            <a
              href={SITE.demo}
              className="text-orange-200 underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              himat.tech AI Readiness Check
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
