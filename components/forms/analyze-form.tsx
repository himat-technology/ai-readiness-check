"use client";

import { Loader2, RotateCcw, Search } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AnalyzeFormValues } from "@/hooks/use-analyze";

interface AnalyzeFormProps {
  form: UseFormReturn<AnalyzeFormValues>;
  loading: boolean;
  error: string | null;
  onSubmit: () => void;
  onReset: () => void;
}

export function AnalyzeForm({
  form,
  loading,
  error,
  onSubmit,
  onReset,
}: AnalyzeFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form
      id="analyze"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="mx-auto w-full max-w-3xl"
      aria-label="Website URL analyzer"
    >
      <div className="relative overflow-hidden rounded-3xl p-[2px] shadow-xl shadow-orange-500/10">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-sky-500 to-orange-500" />
        <div className="relative rounded-[1.4rem] bg-white p-3 sm:p-4">
          <label htmlFor="url" className="sr-only">
            Website URL
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="flex-1">
              <Input
                id="url"
                placeholder="https://example.com"
                autoComplete="url"
                inputMode="url"
                aria-invalid={!!errors.url}
                aria-describedby={errors.url ? "url-error" : undefined}
                className="border-teal-100 focus-visible:ring-orange-500"
                {...register("url")}
              />
              {errors.url && (
                <p
                  id="url-error"
                  className="mt-2 text-sm text-rose-600"
                  role="alert"
                >
                  {errors.url.message}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-teal-600 via-sky-600 to-orange-500 sm:flex-none"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Search className="h-4 w-4" aria-hidden />
                )}
                {loading ? "Analyzing…" : "Analyze Website"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onReset}
                disabled={loading}
                aria-label="Reset form"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            </div>
          </div>
          {error && (
            <p
              className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>
      </div>
      <p className="mt-3 text-center text-sm text-slate-500">
        HTTPS URLs preferred. Publicly accessible sites only.
      </p>
    </form>
  );
}
