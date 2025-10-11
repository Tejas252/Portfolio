import { tool, ToolExecuteFunction } from "ai";
import { z } from "zod";
import { embed, cosineSimilarity } from "ai";
import { google } from "@ai-sdk/google";
import { getDb } from "./mongodb";
import { getEmbeddingModel } from "./models/getEmbbedingModel";

// Tool for getting context about the user from database
export const getContextTool = tool({
  description: "Search for relevant context and information about Tejas from the database. Use this when you need specific details about his projects, skills, experience, or background that aren't in the current conversation.",
  inputSchema: z.object({
    query: z.string().describe("The search query to find relevant context about Tejas"),
    maxResults: z.number().optional().default(3).describe("Maximum number of context results to return (1-5)")
  }),
  type: "function",
    execute: async ({ query, maxResults }) => {
    console.log("🚀 ~ query:", query)

    // const { query, maxResults } = params;

     if (!query) {
        return {
          success: true,
          message: "No relevant context found for the query. say to contact me on LinkedIn.",
          results: ["No relevant context found for the query. say to contact me on LinkedIn.",]
        };
      }

    try {
      // Limit maxResults to prevent excessive data
      const limitedResults = Math.min(Math.max(maxResults, 1), 5);
      
      // Generate embedding for the query
      const queryEmbedding = await embed({
        model: getEmbeddingModel(),
        value: query,
      });

      // Search the database using vector similarity
      const db = await getDb();
      const collection = db.collection("TejasData");
      
      const searchResults = await collection.aggregate([
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
        },
        {
          $limit: 10 // Get more results for similarity comparison
        }
      ]).toArray();

      if (!searchResults || searchResults.length === 0) {
        return {
          success: true,
          message: "No relevant context found for the query. say to contact me on LinkedIn.",
          results: ["No relevant context found for the query. say to contact me on LinkedIn.",]
        };
      }

      // Calculate similarity scores and rank results
      interface RankedResult {
        content: string;
        similarity: number;
        source: string;
        metadata: {
          id: any;
          score: any;
        };
      }

      const rankedResults: RankedResult[] = searchResults
        .map((result: any) => {
          const similarity = cosineSimilarity(queryEmbedding?.embedding, result.embedding || []);
          return {
            content: result.value || result.content || result.text,
            similarity,
            source: result.source || result.type || "database",
            metadata: {
              id: result._id,
              score: result.score
            }
          };
        })
        .sort((a: RankedResult, b: RankedResult) => b.similarity - a.similarity)
        .slice(0, limitedResults);

      return {
        success: true,
        message: `Found ${rankedResults.length} relevant context items for "${query}"`,
        results: rankedResults.map((r: RankedResult) => ({
          content: r.content,
          relevanceScore: Math.round(r.similarity * 100) / 100,
          source: r.source
        }))
      };

    } catch (error) {
      console.error("Error in getContextTool:", error);
      return {
        success: false,
        message: "Error searching for context information.",
        results: []
      };
    }
  }
});

// Tool registry with usage tracking to prevent infinite loops
export class ToolUsageTracker {
  private usageMap = new Map<string, { count: number, lastUsed: number }>();
  private readonly maxUsagePerSession = 3;
  private readonly cooldownMs = 30000; // 30 seconds

  canUseTool(sessionId: string, toolName: string): boolean {
    const key = `${sessionId}:${toolName}`;
    const usage = this.usageMap.get(key);
    const now = Date.now();

    if (!usage) {
      return true;
    }

    // Reset count if cooldown period has passed
    if (now - usage.lastUsed > this.cooldownMs) {
      this.usageMap.set(key, { count: 0, lastUsed: now });
      return true;
    }

    return usage.count < this.maxUsagePerSession;
  }

  recordUsage(sessionId: string, toolName: string): void {
    const key = `${sessionId}:${toolName}`;
    const usage = this.usageMap.get(key) || { count: 0, lastUsed: 0 };
    
    this.usageMap.set(key, {
      count: usage.count + 1,
      lastUsed: Date.now()
    });
  }

  getRemainingUsage(sessionId: string, toolName: string): number {
    const key = `${sessionId}:${toolName}`;
    const usage = this.usageMap.get(key);
    
    if (!usage) {
      return this.maxUsagePerSession;
    }

    const now = Date.now();
    if (now - usage.lastUsed > this.cooldownMs) {
      return this.maxUsagePerSession;
    }

    return Math.max(0, this.maxUsagePerSession - usage.count);
  }

  // Cleanup old entries periodically
  cleanup(): void {
    const now = Date.now();
    const cleanupThreshold = 60 * 60 * 1000; // 1 hour

    for (const [key, usage] of this.usageMap.entries()) {
      if (now - usage.lastUsed > cleanupThreshold) {
        this.usageMap.delete(key);
      }
    }
  }
}

export const toolUsageTracker = new ToolUsageTracker();

// Cleanup old entries every 30 minutes
setInterval(() => {
  toolUsageTracker.cleanup();
}, 30 * 60 * 1000);
