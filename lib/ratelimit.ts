// In-memory rate limiting implementation
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class InMemoryRateLimit {
  private store = new Map<string, RateLimitEntry>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    
    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  async limit(identifier: string) {
    const now = Date.now();
    const entry = this.store.get(identifier);
    
    // If no entry or entry is expired, create new one
    if (!entry || now >= entry.resetTime) {
      const resetTime = now + this.windowMs;
      this.store.set(identifier, { count: 1, resetTime });
      
      return {
        success: true,
        limit: this.maxRequests,
        remaining: this.maxRequests - 1,
        reset: resetTime
      };
    }
    
    // Check if limit exceeded
    if (entry.count >= this.maxRequests) {
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset: entry.resetTime
      };
    }
    
    // Increment count
    entry.count++;
    this.store.set(identifier, entry);
    
    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - entry.count,
      reset: entry.resetTime
    };
  }
  
  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now >= entry.resetTime) {
        this.store.delete(key);
      }
    }
  }
  
  // Get current stats for monitoring
  getStats() {
    return {
      totalEntries: this.store.size,
      entries: Array.from(this.store.entries()).map(([key, entry]) => ({
        identifier: key,
        count: entry.count,
        resetTime: new Date(entry.resetTime).toISOString()
      }))
    };
  }
}

// Create rate limiter - 10 requests per minute for anonymous users
export const ratelimit = new InMemoryRateLimit(10, 60 * 1000); // 10 requests per 60 seconds

// Get client identifier for rate limiting
export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  
  const ip = forwarded?.split(",")[0] || realIp || cfConnectingIp || "unknown";
  
  // For anonymous users, use IP + User-Agent for better uniqueness
  const userAgent = request.headers.get("user-agent") || "unknown";
  return `anonymous:${ip}:${userAgent.slice(0, 50)}`;
}
