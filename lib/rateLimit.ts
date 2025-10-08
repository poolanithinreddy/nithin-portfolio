type Bucket = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 1000 * 60 * 10; // 10 minutes
const MAX_REQUESTS = 5;
const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
};

export function rateLimitByIp(ip: string): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true, remaining: MAX_REQUESTS - 1, reset: now + WINDOW_MS };
  }

  if (bucket.count >= MAX_REQUESTS) {
    return { success: false, remaining: 0, reset: bucket.resetAt };
  }

  bucket.count += 1;
  return { success: true, remaining: MAX_REQUESTS - bucket.count, reset: bucket.resetAt };
}
