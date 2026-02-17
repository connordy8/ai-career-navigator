"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockJobs } from "@/lib/jobs/mock-data";
import { JobListing } from "@/lib/jobs/types";
import { useUserProfile } from "@/lib/context/UserProfileContext";
import JobCoachingSession from "@/components/jobs/JobCoachingSession";
import StickyApplyBar from "@/components/jobs/StickyApplyBar";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { profile, toggleSavedJob, isJobSaved } = useUserProfile();
  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try localStorage first (set by storeAndNavigate on jobs page)
    try {
      const stored = localStorage.getItem("coaching_job");
      if (stored) {
        const parsed = JSON.parse(stored) as JobListing;
        if (parsed.id === id) {
          setJob(parsed);
          setLoading(false);
          return;
        }
      }
    } catch {}

    // Fall back to mock data
    const mockJob = mockJobs.find((j) => j.id === id);
    if (mockJob) {
      setJob(mockJob);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-6 py-16 text-center">
        <div className="w-6 h-6 border-2 border-ma-teal border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-ma-text-light">Loading job...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-lg mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold text-ma-navy mb-2">Job not found</h1>
        <p className="text-sm text-ma-text-light mb-4">This listing may no longer be available.</p>
        <button
          onClick={() => router.push("/jobs")}
          className="text-sm font-medium text-ma-teal hover:underline"
        >
          Back to jobs
        </button>
      </div>
    );
  }

  const formatSalary = () => {
    if (!job.salary.min && !job.salary.max) return null;
    const suffix = job.salary.period === "hourly" ? "hr" : "yr";
    if (job.salary.min && job.salary.max) return `$${job.salary.min}\u2013$${job.salary.max}/${suffix}`;
    if (job.salary.min) return `$${job.salary.min}+/${suffix}`;
    return `Up to $${job.salary.max}/${suffix}`;
  };

  const salary = formatSalary();

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-screen max-w-lg mx-auto">
      {/* Compact job header */}
      <div className="px-4 pt-3 pb-3 border-b border-ma-border bg-white shrink-0">
        <div className="flex items-start gap-3">
          <button
            onClick={() => router.back()}
            className="mt-0.5 p-1 -ml-1 text-ma-text-light hover:text-ma-navy transition-colors shrink-0"
            aria-label="Go back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-ma-navy leading-tight truncate">{job.title}</h1>
            <p className="text-xs text-ma-text-light mt-0.5">{job.employer}</p>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {salary && (
                <span className="px-2 py-0.5 bg-ma-teal/10 text-ma-navy text-[11px] font-medium rounded-full">
                  {salary}
                </span>
              )}
              <span className="px-2 py-0.5 bg-ma-bg text-ma-text-light text-[11px] rounded-full">
                {job.location}
              </span>
              {job.isRemote && (
                <span className="px-2 py-0.5 bg-ma-mint/20 text-ma-navy text-[11px] rounded-full">
                  Remote
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Coaching session — fills remaining space */}
      <div className="flex-1 flex flex-col min-h-0 pb-[4.5rem]">
        <JobCoachingSession job={job} profile={profile} />
      </div>

      {/* Sticky apply bar */}
      <StickyApplyBar
        job={job}
        isSaved={isJobSaved(job.id)}
        onToggleSave={() => toggleSavedJob(job.id)}
      />
    </div>
  );
}
