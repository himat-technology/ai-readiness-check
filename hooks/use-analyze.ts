"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AnalyzeApiResponse } from "@/types";
import { isValidWebsiteUrl } from "@/lib/validate-url";

const schema = z.object({
  url: z
    .string()
    .min(1, "Website URL is required")
    .refine(isValidWebsiteUrl, "Enter a valid URL (e.g. https://example.com)"),
});

export type AnalyzeFormValues = z.infer<typeof schema>;

export function useAnalyze(onSuccess?: (data: AnalyzeApiResponse) => void) {
  const [result, setResult] = useState<AnalyzeApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AnalyzeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { url: "" },
  });

  const analyze = form.handleSubmit(async (values) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: values.url }),
      });
      const data = (await response.json()) as AnalyzeApiResponse & {
        error?: string;
      };
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Analysis failed");
      }
      setResult(data);
      onSuccess?.(data);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  });

  const reset = () => {
    form.reset({ url: "" });
    setResult(null);
    setError(null);
  };

  const loadUrl = (url: string) => {
    form.setValue("url", url, { shouldValidate: true });
  };

  return { form, analyze, reset, loadUrl, result, loading, error, setResult };
}
