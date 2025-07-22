import { NextRequest } from "next/server";
import { embed, generateText, streamText } from "ai"
import { google } from "@ai-sdk/google"
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const GET = async (request: NextRequest) => {
  // const body = await request.json();
  // console.log("🚀 ~ POST ~ body:", body)


  const query = new URL(request?.url)?.searchParams?.get("query") || "Give me description of all project"

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

  const result = streamText({
    model: google("models/gemini-2.0-flash-exp"),
    prompt: `Context: ${context?.[0]?.value} \n Question: ${query} \n Answer:`,
  });

  const readableStream = new ReadableStream({
    async pull(controller) {
      for await (const chunk of result.textStream) {
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });

};