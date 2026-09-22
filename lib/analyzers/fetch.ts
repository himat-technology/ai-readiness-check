import axios, { type AxiosResponse } from "axios";

const USER_AGENT =
  process.env.ANALYZE_USER_AGENT ||
  "AIReadinessCheck/1.0 (+https://localhost; research/audit bot)";

const DEFAULT_TIMEOUT = Number(process.env.ANALYZE_TIMEOUT_MS || 12000);

export interface FetchResult {
  url: string;
  finalUrl: string;
  status: number;
  headers: Record<string, string>;
  data: string;
  bytes: number;
  elapsedMs: number;
  ok: boolean;
  error?: string;
}

export async function fetchResource(
  url: string,
  options: { timeout?: number; accept?: string } = {}
): Promise<FetchResult> {
  const start = Date.now();
  try {
    const response: AxiosResponse<string> = await axios.get(url, {
      timeout: options.timeout ?? DEFAULT_TIMEOUT,
      maxRedirects: 5,
      responseType: "text",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: options.accept ?? "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      validateStatus: () => true,
      transitional: { clarifyTimeoutError: true },
    });

    const data =
      typeof response.data === "string"
        ? response.data
        : JSON.stringify(response.data);

    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(response.headers)) {
      if (typeof value === "string") headers[key.toLowerCase()] = value;
      else if (Array.isArray(value)) headers[key.toLowerCase()] = value.join(", ");
    }

    const responseUrl =
      (response.request as { res?: { responseUrl?: string } })?.res
        ?.responseUrl ||
      (typeof response.request?.responseURL === "string"
        ? response.request.responseURL
        : undefined) ||
      url;

    return {
      url,
      finalUrl: responseUrl,
      status: response.status,
      headers,
      data,
      bytes: Buffer.byteLength(data, "utf8"),
      elapsedMs: Date.now() - start,
      ok: response.status >= 200 && response.status < 400,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch resource";
    return {
      url,
      finalUrl: url,
      status: 0,
      headers: {},
      data: "",
      bytes: 0,
      elapsedMs: Date.now() - start,
      ok: false,
      error: message,
    };
  }
}
