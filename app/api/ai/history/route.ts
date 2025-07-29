import { NextRequest, NextResponse } from "next/server";
import { chatHistoryManager } from "@/lib/chatHistory";
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

    const url = new URL(request.url);
    const sessionId = url.searchParams.get("sessionId");
    const limit_param = url.searchParams.get("limit");
    
    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId parameter is required" },
        { status: 400 }
      );
    }

    const messageLimit = limit_param ? parseInt(limit_param) : 50;
    const conversationHistory = await chatHistoryManager.getConversationHistory(sessionId, messageLimit);
    
    return NextResponse.json({
      sessionId,
      messages: conversationHistory,
      count: conversationHistory.length,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": new Date(reset).toISOString(),
      }
    });

  } catch (error) {
    console.error("Chat History API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
