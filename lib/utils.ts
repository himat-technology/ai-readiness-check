import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ScoreLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeUrl(input: string): string {
  let url = input.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("Invalid URL protocol");
  }
  return parsed.toString();
}

export function ensureHttps(url: string): { ok: boolean; message?: string } {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") {
      return {
        ok: false,
        message: "HTTPS is strongly recommended for AI crawler trust and security.",
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: "Invalid URL" };
  }
}

export function getScoreLevel(score: number): ScoreLevel {
  if (score >= 90) return "excellent";
  if (score >= 75) return "good";
  if (score >= 50) return "needs_improvement";
  return "poor";
}

export function getScoreLabel(level: ScoreLevel): string {
  switch (level) {
    case "excellent":
      return "Excellent";
    case "good":
      return "Good";
    case "needs_improvement":
      return "Needs Improvement";
    case "poor":
      return "Poor";
  }
}

export function getScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-600";
  if (score >= 75) return "text-sky-600";
  if (score >= 50) return "text-amber-600";
  return "text-rose-600";
}

export function getScoreBg(score: number): string {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 75) return "bg-sky-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-rose-500";
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function absoluteUrl(base: string, path: string): string {
  try {
    return new URL(path, base).toString();
  } catch {
    return path;
  }
}
