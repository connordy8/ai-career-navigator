import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { buildJobCoachingSessionPrompt } from "@/lib/ai/prompts";

export async function POST(req: Request) {
  const { messages, job, userProfile } = await req.json();

  const anthropic = createAnthropic({
    baseURL: "https://api.anthropic.com/v1",
    apiKey: process.env.APP_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY,
  });

  const systemPrompt = buildJobCoachingSessionPrompt(
    {
      title: job?.title || "",
      employer: job?.employer || "",
      description: job?.description || "",
      qualifications: job?.qualifications || [],
      salary: job?.salary || { min: 0, max: 0, period: "hourly" },
      benefits: job?.benefits || [],
    },
    {
      currentJob: userProfile?.currentJob || "",
      goals: userProfile?.goals || [],
      barriers: userProfile?.barriers || [],
      availableHours: userProfile?.availableHours || "",
    }
  );

  const result = streamText({
    model: anthropic("claude-sonnet-4-5-20250929"),
    system: systemPrompt,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
