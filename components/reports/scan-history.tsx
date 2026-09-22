"use client";

import { History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getScoreColor } from "@/lib/utils";
import type { ScanHistory } from "@/types";

interface ScanHistoryListProps {
  history: ScanHistory[];
  onSelect: (url: string) => void;
  onClear: () => void;
}

export function ScanHistoryList({ history, onSelect, onClear }: ScanHistoryListProps) {
  if (history.length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-4 w-4 text-teal-700" />
          Recent scans
        </CardTitle>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-slate-100">
          {history.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.url)}
                className="flex w-full items-center justify-between gap-3 py-3 text-left transition hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{item.url}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(item.scannedAt).toLocaleString()}
                  </p>
                </div>
                <span className={`text-lg font-bold tabular-nums ${getScoreColor(item.score)}`}>
                  {item.score}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
