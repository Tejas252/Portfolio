import { NextRequest, NextResponse } from "next/server";
import { cosineSimilarity, embed, streamText } from "ai";
import { google } from "@ai-sdk/google";
import { getDb } from "@/lib/mongodb";
import { SYSTEM_PROMPT } from "@/prompt/system";
import { ratelimit, getClientIdentifier } from "@/lib/ratelimit";
import { chatHistoryManager } from "@/lib/chatHistory";
import { IChatMessage } from "@/models/ChatSession";
import { getContextTool, toolUsageTracker } from "@/lib/tools";
import { v4 as uuidv4 } from "uuid";
import { getLanguageModel } from "@/lib/models/getLanguageModel";
import { getEmbeddingModel } from "@/lib/models/getEmbbedingModel";

// Request interface
interface ChatRequest {
  query: string;
  sessionId?: string;
  conversationHistory?: IChatMessage[];
}

// GET endpoint for simple queries (backwards compatibility)
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

    const query = new URL(request?.url)?.searchParams?.get("query") || "Give me description of all project";
    const sessionId = new URL(request?.url)?.searchParams?.get("sessionId");

    // Get context from database
    const db = await getDb();
    const collection = db.collection("TejasData");
    const context = await collection.aggregate([
      {
        $search: {
          index: "tejas",
          text: {
            query: query,
            path: {
              wildcard: "*"
            }
          }
        }
      }
    ]).toArray();

    // Handle chat history
    let conversationHistory: IChatMessage[] = [];
    let currentSessionId = sessionId;
    
    if (!currentSessionId) {
      // Create new session for anonymous user
      const metadata = {
        userAgent: request.headers.get("user-agent"),
        ip: request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown"
      };
      currentSessionId = await chatHistoryManager.createSession(clientId, metadata);
    } else {
      // Get existing conversation history
      conversationHistory = await chatHistoryManager.getConversationHistory(currentSessionId, 10);
    }

    // Add user message to history
    const userMessage = {
      role: "user" as const,
      content: query
    };
    await chatHistoryManager.addMessage(currentSessionId, userMessage);

    conversationHistory = await chatHistoryManager.getConversationHistory(currentSessionId, 10);

    const queryEmbedding = await embed({
      model: getEmbeddingModel(),
      value: query,
    });


    const nearestContext = context
      ?.map((c: any) => {
        const similarity = cosineSimilarity(queryEmbedding?.embedding, c.value);
        return { ...c, similarity };
      })
      .sort((a: any, b: any) => b.similarity - a.similarity)
      .slice(0, 3)
      .map((c: any) => c.value)
      .join("\n");

    const fullPrompt = `Context: ${nearestContext} Question: ${query}\nAnswer:`;

    // Check if tools can be used (prevent infinite loops)
    const canUseContextTool = toolUsageTracker.canUseTool(currentSessionId, 'getContext');
    
    const result = streamText({
      model: getLanguageModel(),
      system: SYSTEM_PROMPT,
      // prompt: fullPrompt,
      messages: conversationHistory,
      tools: canUseContextTool ? { getContext: getContextTool } : undefined,
      maxSteps: 3, // Limit the number of tool calls
      onStepFinish: (step) => {
        // Track tool usage
        if (step.toolCalls && step.toolCalls.length > 0) {
          step.toolCalls.forEach(toolCall => {
            if (toolCall.toolName === 'getContext') {
              toolUsageTracker.recordUsage(currentSessionId, 'getContext');
            }
          });
        }
      },
    });

    // Store assistant response
    let assistantResponse = "";
    const readableStream = new ReadableStream({
      async pull(controller) {
        try {
          for await (const chunk of result.textStream) {
            assistantResponse += chunk;
            controller.enqueue(chunk);
          }
          
          // Save assistant message to history
          const assistantMessage = {
            role: "assistant" as const,
            content: assistantResponse
          };
          await chatHistoryManager.addMessage(currentSessionId!, assistantMessage);
          
          controller.close();
        } catch (error) {
          // console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "X-Session-Id": currentSessionId,
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": new Date(reset).toISOString(),
      },
    });

  } catch (error) {
    // console.error("AI API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

// POST endpoint for chat conversations
export const POST = async (request: NextRequest) => {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    console.log(clientId);
    const { success, limit, reset, remaining } = await ratelimit.limit(clientId);
    
    console.log(success, limit, reset, remaining);

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

    const body: ChatRequest = await request.json();
    const { query, sessionId, conversationHistory = [] } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // Get context from database
    const db = await getDb();
    const collection = db.collection("TejasData");
    const context = await collection.aggregate([
      {
        $search: {
          index: "tejas",
          text: {
            query: query,
            path: {
              wildcard: "*"
            }
          }
        }
      }
    ]).toArray();

    console.log(context);
    // Handle chat history
    let currentSessionId = sessionId;
    let dbConversationHistory: IChatMessage[] = [];
    
    if (!currentSessionId) {
      // Create new session for anonymous user
      const metadata = {
        userAgent: request.headers.get("user-agent"),
        ip: request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown"
      };
      currentSessionId = await chatHistoryManager.createSession(clientId, metadata);
    } else {
      // Get existing conversation history from DB
      dbConversationHistory = await chatHistoryManager.getConversationHistory(currentSessionId, 5);
    }

    // Use provided conversation history or DB history
    const finalConversationHistory = conversationHistory.length > 0 ? conversationHistory : dbConversationHistory;

    // Add user message to history
    const userMessage = {
      role: "user" as const,
      content: query
    };
    await chatHistoryManager.addMessage(currentSessionId, userMessage);

    dbConversationHistory = await chatHistoryManager.getConversationHistory(currentSessionId, 10);

    const queryEmbedding = await embed({
      model: getEmbeddingModel(),
      value: query,
    });

    const nearestContext = context
      ?.map((c: any) => {
        const similarity = cosineSimilarity(queryEmbedding?.embedding, c.embedding);
        return { ...c, similarity };
      })
      .sort((a: any, b: any) => b.similarity - a.similarity)
      .slice(0, 3)
      .map((c: any) => c.value)
      .join("\n");

    const fullPrompt = `Context: ${nearestContext} Question: ${query}\nAnswer:`;

    // Check if tools can be used (prevent infinite loops)
    const canUseContextTool = toolUsageTracker.canUseTool(currentSessionId, 'getContext');

   const result = streamText({
  model: getLanguageModel(),
  system: SYSTEM_PROMPT, // keep only rules
  messages: [
    ...dbConversationHistory,
    { role: "assistant", content: `Relevant context:\n${nearestContext}` },
  ],
  tools: canUseContextTool ? { getContext: getContextTool } : undefined,
  onStepFinish: (step) => {
    if (step.toolCalls && step.toolCalls.length > 0) {
      step.toolCalls.forEach(toolCall => {
        if (toolCall.toolName === 'getContext') {
          toolUsageTracker.recordUsage(currentSessionId, 'getContext');
        }
      });
    }
  },
maxRetries: 3,
});

    // Store assistant response
    let assistantResponse = "";
    const readableStream = new ReadableStream({
      async pull(controller) {
        try {
          for await (const chunk of result.textStream) {
            assistantResponse += chunk;
            controller.enqueue(chunk);
          }
          
          // Save assistant message to history
          const assistantMessage = {
            role: "assistant" as const,
            content: assistantResponse
          };
          console.log(assistantMessage);
          if(assistantResponse){
            await chatHistoryManager.addMessage(currentSessionId!, assistantMessage);
          }else{
            await chatHistoryManager.addMessage(currentSessionId!, {role: "assistant", content: "Sorry, I'm having trouble responding right now. Please contact to savaliyatejas108@gmail.com"});
            controller.error("No response");
          }
          
          controller.close();
        } catch (error) {
          // console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "X-Session-Id": currentSessionId,
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": new Date(reset).toISOString(),
      },
    });

  } catch (error) {
    // console.error("AI API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};