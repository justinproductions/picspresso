type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

export function checkRateLimit(key: string): { allowed: boolean; resetIn: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, resetIn: WINDOW_MS };
  }

  if (bucket.count >= MAX_REQUESTS) {
    return { allowed: false, resetIn: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { allowed: true, resetIn: bucket.resetAt - now };
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
