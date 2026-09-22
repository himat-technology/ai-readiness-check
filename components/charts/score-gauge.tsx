"use client";

import { getScoreColor, getScoreLabel } from "@/lib/utils";
import type { ScoreLevel } from "@/types";

interface ScoreGaugeProps {
  score: number;
  level: ScoreLevel;
}

export function ScoreGauge({ score, level }: ScoreGaugeProps) {
  const radius = 68;
  const stroke = 10;
  const normalized = Math.min(100, Math.max(0, score));
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="relative mx-auto flex h-48 w-48 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160" aria-hidden>
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-slate-200"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${getScoreColor(score)} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={`text-4xl font-bold tracking-tight ${getScoreColor(score)}`}>
          {normalized}
        </span>
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          / 100
        </span>
        <span className="mt-1 text-sm font-semibold text-slate-800">
          {getScoreLabel(level)}
        </span>
      </div>
    </div>
  );
}
