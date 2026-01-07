/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or Upstash
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (resets on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>();

interface RateLimitConfig {
  // Maximum number of requests
  limit: number;
  // Time window in seconds
  windowSec: number;
}

// Default configurations for different endpoints
export const RATE_LIMIT_CONFIG = {
  // Auth endpoints - stricter limits
  auth: { limit: 5, windowSec: 60 }, // 5 requests per minute
  register: { limit: 3, windowSec: 60 }, // 3 registrations per minute
  
  // API endpoints - moderate limits
  api: { limit: 60, windowSec: 60 }, // 60 requests per minute
  
  // Create/Update operations - stricter
  mutation: { limit: 20, windowSec: 60 }, // 20 mutations per minute
} as const;

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetIn: number; // seconds until reset
}

/**
 * Check rate limit for a given identifier (usually IP or user ID)
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMIT_CONFIG.api
): RateLimitResult {
  const now = Date.now();
  const key = `${identifier}`;
  const entry = rateLimitStore.get(key);

  // Clean up expired entries periodically
  if (Math.random() < 0.01) { // 1% chance to clean up
    cleanupExpiredEntries();
  }

  // No entry or expired entry
  if (!entry || now > entry.resetTime) {
    const resetTime = now + config.windowSec * 1000;
    rateLimitStore.set(key, { count: 1, resetTime });
    
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      resetIn: config.windowSec,
    };
  }

  // Entry exists and not expired
  const remaining = config.limit - entry.count - 1;
  const resetIn = Math.ceil((entry.resetTime - now) / 1000);

  if (entry.count >= config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      resetIn,
    };
  }

  // Increment counter
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    success: true,
    limit: config.limit,
    remaining: Math.max(0, remaining),
    resetIn,
  };
}

/**
 * Clean up expired entries to prevent memory leaks
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Get client identifier from request
 * Uses X-Forwarded-For header or falls back to a default
 */
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  // Fallback for development
  return "127.0.0.1";
}

/**
 * Rate limit response headers
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.resetIn),
  };
}

