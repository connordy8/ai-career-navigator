import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { buildJobCoachingSessionPrompt } from "@/lib/ai/prompts";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, job, userProfile } = body;

    const apiKey = process.env.APP_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const anthropic = createAnthropic({
      baseURL: "https://api.anthropic.com/v1",
      apiKey,
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
  } catch (error: unknown) {
    console.error("Coaching API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
