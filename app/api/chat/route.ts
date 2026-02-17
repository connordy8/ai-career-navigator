import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { careerAdvisorSystemPrompt } from "@/lib/ai/prompts";

export async function POST(req: Request) {
  const { messages, context } = await req.json();

  // Create provider inside handler to ensure env vars are loaded
  const anthropic = createAnthropic({
    baseURL: "https://api.anthropic.com/v1",
    apiKey: process.env.APP_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY,
  });

  // Use context-specific system prompt if provided, otherwise default
  const systemPrompt = context || careerAdvisorSystemPrompt;

  const result = streamText({
    model: anthropic("claude-sonnet-4-5-20250929"),
    system: systemPrompt,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
