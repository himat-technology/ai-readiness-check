"use client";

import { useCallback, useEffect, useState } from "react";
import type { ScanHistory } from "@/types";

const STORAGE_KEY = "ai-readiness-scan-history";
const MAX_ITEMS = 12;

export function useScanHistory() {
  const [history, setHistory] = useState<ScanHistory[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw) as ScanHistory[]);
    } catch {
      setHistory([]);
    }
  }, []);

  const persist = useCallback((next: ScanHistory[]) => {
    setHistory(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addScan = useCallback(
    (entry: Omit<ScanHistory, "id">) => {
      const item: ScanHistory = {
        ...entry,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      };
      const next = [item, ...history.filter((h) => h.url !== entry.url)].slice(
        0,
        MAX_ITEMS
      );
      persist(next);
      return item;
    },
    [history, persist]
  );

  const clearHistory = useCallback(() => {
    persist([]);
  }, [persist]);

  return { history, addScan, clearHistory };
}
