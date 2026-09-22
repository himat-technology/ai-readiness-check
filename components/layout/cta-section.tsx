import { ArrowRight, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-600 via-sky-600 to-orange-500 px-6 py-12 text-white shadow-2xl shadow-orange-500/20 sm:px-10">
      <div className="pointer-events-none absolute -right-8 top-0 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-rose-400/30 blur-2xl" />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
          {SITE.brand}
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Make your site citation-ready for AI search
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-white/90">
          Ship the fixes, scan again, and raise your score. Questions? Reach Himat
          Technology anytime.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-white text-teal-900 hover:bg-orange-50"
          >
            <a href="#analyze">
              Analyze another URL
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 bg-white/10 text-white hover:bg-white/20"
          >
            <a href={`mailto:${SITE.email}`}>
              <Mail className="h-4 w-4" />
              {SITE.email}
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 bg-white/10 text-white hover:bg-white/20"
          >
            <a href={`tel:${SITE.phoneTel}`}>
              <Phone className="h-4 w-4" />
              {SITE.phone}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
