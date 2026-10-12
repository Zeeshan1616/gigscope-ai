/**
 * In-memory sliding window rate limiter
 * Protects server-side endpoints from abuse and runaway automated queries.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const ipRequestMap = new Map<string, RateLimitRecord>();

// Clean up expired records every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredRecords(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

  lastCleanup = now;
  const cutoff = now - windowMs;

  for (const [ip, record] of ipRequestMap.entries()) {
    const validTimestamps = record.timestamps.filter((t) => t > cutoff);
    if (validTimestamps.length === 0) {
      ipRequestMap.delete(ip);
    } else {
      record.timestamps = validTimestamps;
    }
  }
}

export interface RateLimitStatus {
  isLimited: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

export function checkRateLimit(
  clientIp: string,
  maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 30),
  windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000)
): RateLimitStatus {
  cleanupExpiredRecords(windowMs);

  const now = Date.now();
  const windowStart = now - windowMs;

  let record = ipRequestMap.get(clientIp);
  if (!record) {
    record = { timestamps: [] };
    ipRequestMap.set(clientIp, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((t) => t > windowStart);

  if (record.timestamps.length >= maxRequests) {
    const oldest = record.timestamps[0];
    const resetSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      isLimited: true,
      limit: maxRequests,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  // Record this request
  record.timestamps.push(now);
  const remaining = Math.max(0, maxRequests - record.timestamps.length);

  return {
    isLimited: false,
    limit: maxRequests,
    remaining,
    resetSeconds: Math.ceil(windowMs / 1000),
  };
}
