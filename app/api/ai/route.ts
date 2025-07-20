import { NextRequest } from "next/server";
import { generateText, streamText } from "ai"
import { google } from "@ai-sdk/google"
import { NextResponse } from "next/server";

export const GET = async (request: NextRequest, response: NextRequest) => {
    // const body = await request.json();
    // console.log("🚀 ~ POST ~ body:", body)

    const result = streamText({
        model: google("models/gemini-2.0-flash-exp"),
        prompt: 'Invent a new holiday and describe its traditions.',
    });
    console.log("🚀 ~ POST ~ result:", result)

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