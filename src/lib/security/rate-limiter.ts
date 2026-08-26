/**
 * ============================================================================
 * SLIDING-WINDOW RATE LIMITER
 * ============================================================================
 * High-performance sliding-window in-memory rate limiter to protect
 * authentication endpoints, TOTP verifications, and machine API keys.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export const RateLimiter = {
  /**
   * Check if an identifier exceeds maxRequests within windowSeconds
   */
  check(identifier: string, maxRequests = 30, windowSeconds = 60): { isAllowed: boolean; remaining: number; resetSec: number } {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const record = rateLimitStore.get(identifier) || { timestamps: [] };

    // Filter timestamps within the current sliding window
    const validTimestamps = record.timestamps.filter(ts => now - ts < windowMs);

    if (validTimestamps.length >= maxRequests) {
      const oldest = validTimestamps[0];
      const resetSec = Math.ceil((oldest + windowMs - now) / 1000);
      return {
        isAllowed: false,
        remaining: 0,
        resetSec: Math.max(resetSec, 1)
      };
    }

    validTimestamps.push(now);
    rateLimitStore.set(identifier, { timestamps: validTimestamps });

    return {
      isAllowed: true,
      remaining: maxRequests - validTimestamps.length,
      resetSec: windowSeconds
    };
  }
};
