import { NextRequest, NextResponse } from "next/server";
import { toolUsageTracker } from "@/lib/tools";
import { ratelimit, getClientIdentifier } from "@/lib/ratelimit";

export const GET = async (request: NextRequest) => {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const { success, limit, reset, remaining } = await ratelimit.limit(clientId);
    
    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": new Date(reset).toISOString(),
          }
        }
      );
    }

    const sessionId = new URL(request.url).searchParams.get("sessionId");
    
    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId parameter is required" },
        { status: 400 }
      );
    }

    const remainingUsage = toolUsageTracker.getRemainingUsage(sessionId, 'getContext');
    
    return NextResponse.json({
      sessionId,
      toolUsage: {
        getContext: {
          remaining: remainingUsage,
          maxUsage: 3,
          cooldownMs: 30000
        }
      },
      timestamp: new Date().toISOString()
    }, {
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": new Date(reset).toISOString(),
      }
    });

  } catch (error) {
    console.error("Tool Usage API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
