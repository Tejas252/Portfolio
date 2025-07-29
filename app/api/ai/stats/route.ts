import { NextRequest, NextResponse } from "next/server";
import { chatStatsManager } from "@/lib/chatStats";
import { ratelimit, getClientIdentifier } from "@/lib/ratelimit";

export const GET = async (request: NextRequest) => {
  try {
    // Rate limiting for stats endpoint
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

    const stats = await chatStatsManager.getStats();
    const topUsers = await chatStatsManager.getTopActiveUsers(5);

    return NextResponse.json({
      stats,
      topUsers,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": new Date(reset).toISOString(),
      }
    });

  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
