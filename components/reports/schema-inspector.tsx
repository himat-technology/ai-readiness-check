"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SchemaAnalysis } from "@/types";

interface SchemaInspectorProps {
  schemas: SchemaAnalysis;
}

export function SchemaInspector({ schemas }: SchemaInspectorProps) {
  return (
    <section aria-labelledby="schema-heading" className="space-y-4">
      <h2 id="schema-heading" className="font-display text-3xl font-semibold text-slate-900">
        Structured Data Inspector
      </h2>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">JSON-LD</p>
            <p className="text-2xl font-bold text-slate-900">{schemas.jsonLdCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Microdata</p>
            <p className="text-2xl font-bold text-slate-900">{schemas.microdataCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">RDFa</p>
            <p className="text-2xl font-bold text-slate-900">{schemas.rdfaCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Found types</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {schemas.foundTypes.length === 0 ? (
              <p className="text-sm text-slate-500">No schema types detected.</p>
            ) : (
              schemas.foundTypes.map((type) => (
                <Badge key={type} className="bg-emerald-50 text-emerald-800 border-emerald-200">
                  Found · {type}
                </Badge>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Missing recommended types</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {schemas.missingTypes.length === 0 ? (
              <p className="text-sm text-slate-500">Key schema types are present.</p>
            ) : (
              schemas.missingTypes.map((type) => (
                <Badge key={type} className="bg-amber-50 text-amber-800 border-amber-200">
                  Missing · {type}
                </Badge>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {schemas.items.slice(0, 12).map((item, index) => (
          <Card key={`${item.type}-${index}`}>
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-base">{item.type}</CardTitle>
                <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                  {item.format}
                </Badge>
                <Badge
                  className={
                    item.valid
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }
                >
                  {item.valid ? "Valid" : "Invalid"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {item.issues.length > 0 && (
                <p className="mb-2 text-sm text-rose-600">{item.issues.join("; ")}</p>
              )}
              <pre className="max-h-48 overflow-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-100">
                {JSON.stringify(item.properties, null, 2)}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
