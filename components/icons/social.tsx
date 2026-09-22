import { cn } from "@/lib/utils";

type IconProps = {
  className?: string;
};

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-4 w-4", className)} aria-hidden>
      <path d="M14 8h3V4.5C16.3 4.3 15.2 4 13.9 4 11.3 4 9.5 5.6 9.5 8.5V11H6.5v4H9.5v9H14v-9h3.1l.4-4H14V8.7c0-.6.2-1 .7-1z" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-4 w-4", className)} aria-hidden>
      <path d="M6.5 9H3v12h3.5V9zM4.7 3C3.5 3 2.5 4 2.5 5.2S3.5 7.4 4.7 7.4 7 6.4 7 5.2 6 3 4.7 3zM21 14.4c0-3.3-1.8-4.8-4.1-4.8-1.9 0-2.7 1-3.2 1.8V9.5H10.2c0 .9 0 12 0 12H13.7v-6.7c0-.4 0-.7.1-1 .3-.7.9-1.4 2-1.4 1.4 0 2 1.1 2 2.6V21.5H21v-7.1z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-4 w-4", className)} aria-hidden>
      <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zM17.5 6.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z" />
      <path d="M12 2.5c-2.6 0-2.9 0-3.9.1-2.6.1-3.9 1.4-4 4-.1 1-.1 1.3-.1 3.9s0 2.9.1 3.9c.1 2.6 1.4 3.9 4 4 1 .1 1.3.1 3.9.1s2.9 0 3.9-.1c2.6-.1 3.9-1.4 4-4 .1-1 .1-1.3.1-3.9s0-2.9-.1-3.9c-.1-2.6-1.4-3.9-4-4-1-.1-1.3-.1-3.9-.1zm0 1.7c2.5 0 2.8 0 3.8.1 1.9.1 2.8 1 2.9 2.9.1 1 .1 1.3.1 3.8s0 2.8-.1 3.8c-.1 1.9-1 2.8-2.9 2.9-1 .1-1.3.1-3.8.1s-2.8 0-3.8-.1c-1.9-.1-2.8-1-2.9-2.9-.1-1-.1-1.3-.1-3.8s0-2.8.1-3.8c.1-1.9 1-2.8 2.9-2.9 1-.1 1.3-.1 3.8-.1z" />
    </svg>
  );
}
