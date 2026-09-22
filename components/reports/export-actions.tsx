"use client";

import { useState } from "react";
import { Check, Copy, Download, FileJson, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildAuditSummary, generatePdfReport } from "@/lib/export";
import type { AnalyzeApiResponse } from "@/types";

interface ExportActionsProps {
  data: AnalyzeApiResponse;
}

export function ExportActions({ data }: ExportActionsProps) {
  const [copied, setCopied] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-readiness-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON report downloaded");
  };

  const downloadPdf = async () => {
    try {
      setPdfLoading(true);
      const bytes = await generatePdfReport(data);
      const blob = new Blob([Uint8Array.from(bytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-readiness-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF report downloaded");
    } catch {
      toast.error("Failed to generate PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildAuditSummary(data));
      setCopied(true);
      toast.success("Audit summary copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  return (
    <section aria-labelledby="export-heading">
      <Card>
        <CardHeader>
          <CardTitle id="export-heading">Export report</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={downloadJson}>
            <FileJson className="h-4 w-4" />
            Download JSON
          </Button>
          <Button type="button" variant="outline" onClick={downloadPdf} disabled={pdfLoading}>
            <Download className="h-4 w-4" />
            {pdfLoading ? "Generating PDF…" : "Download PDF"}
          </Button>
          <Button type="button" variant="secondary" onClick={copySummary}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy Audit Summary"}
          </Button>
          <p className="w-full text-sm text-slate-500">
            <FileText className="mr-1 inline h-3.5 w-3.5" />
            Exports include scores, checks, crawlers, platforms, and recommendations.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
