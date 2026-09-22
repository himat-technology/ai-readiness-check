import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { AnalyzeApiResponse } from "@/types";
import { getScoreLabel } from "@/lib/utils";

export async function generatePdfReport(
  data: AnalyzeApiResponse
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let page = pdf.addPage([612, 792]);
  let y = 750;
  const margin = 48;
  const width = 612 - margin * 2;

  const drawText = (
    text: string,
    options: {
      size?: number;
      bold?: boolean;
      color?: ReturnType<typeof rgb>;
      x?: number;
    } = {}
  ) => {
    const size = options.size ?? 11;
    const usedFont = options.bold ? bold : font;
    const color = options.color ?? rgb(0.1, 0.12, 0.16);
    const x = options.x ?? margin;

    const words = text.split(/\s+/);
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      const textWidth = usedFont.widthOfTextAtSize(test, size);
      if (textWidth > width && line) {
        if (y < 60) {
          page = pdf.addPage([612, 792]);
          y = 750;
        }
        page.drawText(line, { x, y, size, font: usedFont, color });
        y -= size + 6;
        line = word;
      } else {
        line = test;
      }
    }
    if (line) {
      if (y < 60) {
        page = pdf.addPage([612, 792]);
        y = 750;
      }
      page.drawText(line, { x, y, size, font: usedFont, color });
      y -= size + 8;
    }
  };

  const report = data.report;
  drawText("AI Readiness Check Report", { size: 20, bold: true });
  drawText(report?.finalUrl || report?.url || "Website audit", { size: 12 });
  drawText(`Scanned: ${report?.scannedAt || new Date().toISOString()}`, {
    size: 10,
    color: rgb(0.4, 0.45, 0.5),
  });
  y -= 8;

  drawText(`Overall Score: ${data.score}/100 (${getScoreLabel(data.level)})`, {
    size: 16,
    bold: true,
    color: rgb(0.05, 0.45, 0.5),
  });
  y -= 6;

  drawText("Category Scores", { size: 14, bold: true });
  Object.entries(data.categories).forEach(([key, value]) => {
    drawText(`${key}: ${value}/100`, { size: 11 });
  });
  y -= 8;

  drawText("Top Recommendations", { size: 14, bold: true });
  data.recommendations.slice(0, 8).forEach((rec, index) => {
    drawText(`${index + 1}. [${rec.priority.toUpperCase()}] ${rec.title}`, {
      size: 11,
      bold: true,
    });
    drawText(rec.description, { size: 10, color: rgb(0.25, 0.28, 0.32) });
    drawText(`Fix: ${rec.suggestedFix}`, {
      size: 10,
      color: rgb(0.15, 0.4, 0.42),
    });
    y -= 4;
  });

  y -= 6;
  drawText("AI Crawler Status", { size: 14, bold: true });
  data.crawlers.forEach((crawler) => {
    drawText(`${crawler.name}: ${crawler.status} — ${crawler.details}`, {
      size: 10,
    });
  });

  y -= 6;
  drawText("Platform Compatibility", { size: 14, bold: true });
  data.platforms.forEach((platform) => {
    drawText(
      `${platform.platform}: ${platform.score}/100 (${getScoreLabel(platform.status)})`,
      { size: 10 }
    );
  });

  return pdf.save();
}

export function buildAuditSummary(data: AnalyzeApiResponse): string {
  const lines = [
    `AI Readiness Check Summary`,
    `URL: ${data.report?.finalUrl || data.report?.url || "N/A"}`,
    `Score: ${data.score}/100 (${getScoreLabel(data.level)})`,
    ``,
    `Categories:`,
    ...Object.entries(data.categories).map(([k, v]) => `  - ${k}: ${v}`),
    ``,
    `Top recommendations:`,
    ...data.recommendations
      .slice(0, 5)
      .map((r, i) => `  ${i + 1}. [${r.priority}] ${r.title}`),
    ``,
    `Crawlers:`,
    ...data.crawlers.map((c) => `  - ${c.name}: ${c.status}`),
  ];
  return lines.join("\n");
}
