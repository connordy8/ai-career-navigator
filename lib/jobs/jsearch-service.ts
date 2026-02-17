import { JobListing, JobSearchParams } from "./types";

const RAPIDAPI_HOST = "jsearch.p.rapidapi.com";

interface JSearchResult {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo: string | null;
  job_city: string;
  job_state: string;
  job_country: string;
  job_is_remote: boolean;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_salary_currency: string;
  job_salary_period: string;
  job_employment_type: string;
  job_description: string;
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
    Benefits?: string[];
  };
  job_posted_at_datetime_utc: string;
  job_apply_link: string;
  job_google_link: string;
  job_publisher: string;
}

function daysSince(dateStr: string): number {
  const posted = new Date(dateStr);
  const now = new Date();
  return Math.max(0, Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24)));
}

function mapEmploymentType(type: string): "FULLTIME" | "PARTTIME" | "CONTRACT" {
  const upper = (type || "").toUpperCase();
  if (upper.includes("PART")) return "PARTTIME";
  if (upper.includes("CONTRACT") || upper.includes("TEMP")) return "CONTRACT";
  return "FULLTIME";
}

function normalizeSalary(min: number | null, max: number | null, period: string): { min: number; max: number; period: "hourly" | "yearly" } {
  const salaryPeriod = (period || "").toUpperCase().includes("HOUR") ? "hourly" as const : "yearly" as const;

  let salaryMin = min || 0;
  let salaryMax = max || 0;

  // If only one is set, estimate the other
  if (salaryMin && !salaryMax) salaryMax = Math.round(salaryMin * 1.2);
  if (salaryMax && !salaryMin) salaryMin = Math.round(salaryMax * 0.8);

  return { min: salaryMin, max: salaryMax, period: salaryPeriod };
}

function mapToJobListing(result: JSearchResult): JobListing {
  const location = result.job_is_remote
    ? "Remote"
    : [result.job_city, result.job_state].filter(Boolean).join(", ") || "United States";

  return {
    id: result.job_id,
    title: result.job_title,
    employer: result.employer_name,
    employerLogo: result.employer_logo || undefined,
    location,
    isRemote: result.job_is_remote,
    salary: normalizeSalary(result.job_min_salary, result.job_max_salary, result.job_salary_period),
    employmentType: mapEmploymentType(result.job_employment_type),
    description: (result.job_description || "").slice(0, 500),
    qualifications: result.job_highlights?.Qualifications?.slice(0, 6) || [],
    benefits: result.job_highlights?.Benefits?.slice(0, 6) || [],
    postedDaysAgo: daysSince(result.job_posted_at_datetime_utc),
    category: "",
    applyLink: result.job_apply_link || result.job_google_link,
    source: result.job_publisher,
  };
}

export async function searchJobsLive(params: JobSearchParams): Promise<JobListing[]> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    throw new Error("RAPIDAPI_KEY not set");
  }

  const query = params.query || "jobs hiring";
  const location = params.location || "United States";
  const searchParams = new URLSearchParams({
    query: `${query} in ${location}`,
    page: String(params.page || 1),
    num_pages: "1",
    date_posted: "week",
  });

  if (params.remoteOnly) {
    searchParams.set("remote_jobs_only", "true");
  }
  if (params.employmentType) {
    searchParams.set("employment_types", params.employmentType);
  }

  const response = await fetch(`https://${RAPIDAPI_HOST}/search?${searchParams}`, {
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": RAPIDAPI_HOST,
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`JSearch API error: ${response.status}`);
  }

  const data = await response.json();
  const results: JSearchResult[] = data.data || [];

  return results.map(mapToJobListing);
}
