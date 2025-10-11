import { getContextTool } from '@/lib/tools';
import { SYSTEM_PROMPT } from '@/prompt/system';
import { streamText, UIMessage, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    // Create a custom prompt to ensure the AI responds with text after using tools
    const enhancedSystemPrompt = `${SYSTEM_PROMPT}
    
CRITICAL INSTRUCTIONS:
1. After using any tools, you MUST continue generating text and provide a complete, helpful response to the user based on the information you gathered.
2. Never stop at tool results - always synthesize the tool output into a coherent, informative response.
3. Your response should be conversational and helpful, not just raw tool data.
4. If you use the getContext tool, analyze the results and provide a meaningful summary or answer to the user's question.`;

    const result = streamText({
        model: 'openai/gpt-4o',
        system: enhancedSystemPrompt,
        messages: convertToModelMessages(messages),
        tools: { getContext: getContextTool },
        onStepFinish: (step) => {
            console.log('Step finished:', step);
            if (step.toolCalls) {
                console.log('Tool calls in step:', step.toolCalls);
            }
            if (step.text) {
                console.log('Text generated in step:', step.text);
            }
        },
        maxRetries: 3, // Allow multiple steps for tool calling
    });

    return result.toUIMessageStreamResponse({
        // Pass the original messages to maintain conversation history
        originalMessages: messages,
    });
}