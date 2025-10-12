import { getContextTool } from '@/lib/tools';
import { SYSTEM_PROMPT } from '@/prompt/system';
import { streamText, UIMessage, convertToModelMessages, stepCountIs } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    // Always allow tools to be used - let the AI decide when to use them
    // This is simpler and more reliable than trying to parse message content

    // Create a custom prompt to ensure the AI responds with text after using tools
    const enhancedSystemPrompt = `${SYSTEM_PROMPT}
    
CRITICAL INSTRUCTIONS:
1. After using any tools, you MUST continue generating text and provide a complete, helpful response to the user based on the information you gathered.
2. Never stop at tool results - always synthesize the tool output into a coherent, informative response.
3. Your response should be conversational and helpful, not just raw tool data.
4. If you use the getContext tool, analyze the results and provide a meaningful summary or answer to the user's question.
5. Always provide a complete response even if tool results are empty or not helpful.`;

    const result = streamText({
        model: 'openai/gpt-4o',
        system: enhancedSystemPrompt,
        messages: convertToModelMessages(messages),
        tools: { getContext: getContextTool },
        // Use auto tool choice to let the AI decide when to use tools
        toolChoice: 'auto',
        stopWhen: stepCountIs(3), // Allow multiple steps to ensure completion
        onStepFinish: (step) => {
            console.log('Step finished:', step);
            if (step.toolCalls) {
                console.log('Tool calls in step:', step.toolCalls);
            }
            if (step.text) {
                console.log('Text generated in step:', step.text);
            }
        }
    });

    return result.toUIMessageStreamResponse({
        // Pass the original messages to maintain conversation history
        originalMessages: messages,
    });
}