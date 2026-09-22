"use client";

import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AuditCheck, CheckStatus } from "@/types";

const STATUS_META: Record<
  CheckStatus,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  pass: {
    label: "Pass",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  warning: {
    label: "Warning",
    className: "bg-amber-50 text-amber-800 border-amber-200",
    icon: AlertTriangle,
  },
  fail: {
    label: "Fail",
    className: "bg-rose-50 text-rose-700 border-rose-200",
    icon: XCircle,
  },
  info: {
    label: "Info",
    className: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Info,
  },
};

interface AuditResultsProps {
  checks: AuditCheck[];
}

export function AuditResults({ checks }: AuditResultsProps) {
  const grouped = checks.reduce<Record<string, AuditCheck[]>>((acc, check) => {
    acc[check.category] = acc[check.category] || [];
    acc[check.category].push(check);
    return acc;
  }, {});

  return (
    <section aria-labelledby="audit-heading" className="space-y-4">
      <h2 id="audit-heading" className="font-display text-3xl font-semibold text-slate-900">
        Detailed Audit Report
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Checks by category</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={Object.keys(grouped).slice(0, 3)}>
            {Object.entries(grouped).map(([category, items]) => (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger>
                  <span className="flex items-center gap-3">
                    {category}
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {items.length}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3">
                    {items.map((check) => {
                      const meta = STATUS_META[check.status];
                      const Icon = meta.icon;
                      return (
                        <li
                          key={check.id}
                          className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                        >
                          <Icon
                            className={`mt-0.5 h-4 w-4 shrink-0 ${
                              check.status === "pass"
                                ? "text-emerald-600"
                                : check.status === "warning"
                                  ? "text-amber-600"
                                  : check.status === "fail"
                                    ? "text-rose-600"
                                    : "text-slate-500"
                            }`}
                            aria-hidden
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium text-slate-900">{check.name}</p>
                              <Badge className={meta.className}>{meta.label}</Badge>
                            </div>
                            <p className="mt-1 text-sm text-slate-600">{check.description}</p>
                            {check.details && (
                              <p className="mt-1 text-xs text-slate-500">{check.details}</p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
}
