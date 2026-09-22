import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeWebsite } from "@/lib/analyzers";
import { isValidWebsiteUrl } from "@/lib/validate-url";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .refine(isValidWebsiteUrl, "Please provide a valid URL"),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Invalid request",
        },
        { status: 400 }
      );
    }

    const result = await analyzeWebsite(parsed.data.url);

    if (!result.success) {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analyze API error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while analyzing the website.",
      },
      { status: 500 }
    );
  }
}
