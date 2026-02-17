import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText, convertToModelMessages } from "ai";
import { buildCareerCoachingSessionPrompt } from "@/lib/ai/prompts";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, career, userProfile } = body;

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

    const systemPrompt = buildCareerCoachingSessionPrompt(
      {
        title: career?.title || "",
        description: career?.description || "",
        salaryRange: career?.salaryRange || "",
        timeToEntry: career?.timeToEntry || "",
        demandLevel: career?.demandLevel || "",
        skills: career?.skills || [],
        steppingStones: career?.steppingStones || [],
        programs: career?.programs || [],
      },
      {
        currentJob: userProfile?.currentJob || "",
        goals: userProfile?.goals || [],
        barriers: userProfile?.barriers || [],
        availableHours: userProfile?.availableHours || "",
      }
    );

    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: anthropic("claude-sonnet-4-5-20250929"),
      system: systemPrompt,
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    console.error("Career coaching API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
