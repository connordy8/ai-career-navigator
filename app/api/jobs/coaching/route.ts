import { createAnthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";
import { buildCoachingPlanPrompt } from "@/lib/ai/prompts";

const coachingStepSchema = z.object({
  steps: z.array(
    z.object({
      id: z.string().describe("A short unique id like 'research-company' or 'resume-skills'"),
      title: z.string().describe("Short, action-oriented title"),
      description: z.string().describe("1-2 sentence explanation of what to do and why"),
      category: z.enum(["research", "skills", "resume", "practice", "apply"]),
    })
  ).describe("Array of 4-6 preparation steps"),
});

export async function POST(req: Request) {
  try {
    const { job, profile } = await req.json();

    const anthropic = createAnthropic({
      baseURL: "https://api.anthropic.com/v1",
      apiKey: process.env.APP_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY,
    });

    const result = await generateObject({
      model: anthropic("claude-sonnet-4-5-20250929"),
      schema: coachingStepSchema,
      prompt: buildCoachingPlanPrompt(job, profile),
    });

    return Response.json(result.object);
  } catch (error) {
    console.error("Coaching plan error:", error);
    return Response.json(
      { error: "Failed to generate coaching plan" },
      { status: 500 }
    );
  }
}
