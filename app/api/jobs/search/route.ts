import { NextRequest, NextResponse } from "next/server";
import { searchJobsLive } from "@/lib/jobs/jsearch-service";
import { searchJobs as searchMockJobs } from "@/lib/jobs/mock-data";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const query = searchParams.get("query") || undefined;
  const location = searchParams.get("location") || undefined;
  const employmentType = searchParams.get("employmentType") || undefined;
  const category = searchParams.get("category") || undefined;
  const remoteOnly = searchParams.get("remoteOnly") === "true";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const useMock = searchParams.get("mock") === "true";

  // Use mock data if explicitly requested or if no API key is set
  if (useMock || !process.env.RAPIDAPI_KEY) {
    const results = searchMockJobs({ query, category, employmentType });
    return NextResponse.json({ jobs: results, source: "mock" });
  }

  try {
    const jobs = await searchJobsLive({
      query,
      location,
      employmentType,
      remoteOnly,
      page,
    });
    return NextResponse.json({ jobs, source: "jsearch" });
  } catch (error) {
    console.error("JSearch API error, falling back to mock:", error);
    const results = searchMockJobs({ query, category, employmentType });
    return NextResponse.json({ jobs: results, source: "mock", fallback: true });
  }
}
