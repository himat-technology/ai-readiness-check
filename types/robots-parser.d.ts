declare module "robots-parser" {
  interface Robots {
    isAllowed: (url: string, userAgent?: string) => boolean | undefined;
    isDisallowed: (url: string, userAgent?: string) => boolean | undefined;
    getMatchingLineNumber: (url: string, userAgent?: string) => number;
    getCrawlDelay: (userAgent?: string) => number | undefined;
    getSitemaps: () => string[];
    getPreferredHost: () => string | null;
  }

  export default function robotsParser(url: string, robotsTxt: string): Robots;
}
