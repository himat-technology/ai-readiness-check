export function isValidWebsiteUrl(value: string): boolean {
  try {
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    const host = parsed.hostname.toLowerCase();
    if (!host || host === "localhost") return host === "localhost";
    // Require a dot (TLD) so values like "not-a-url" are rejected
    if (!host.includes(".")) return false;
    if (host.startsWith(".") || host.endsWith(".")) return false;
    if (/\s/.test(host)) return false;
    return true;
  } catch {
    return false;
  }
}
