"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { mockJobs } from "@/lib/jobs/mock-data";
import { useUserProfile } from "@/lib/context/UserProfileContext";
import CoachingPlan from "@/components/jobs/CoachingPlan";
import JobDetailsAccordion from "@/components/jobs/JobDetailsAccordion";
import JobCoachingChat from "@/components/jobs/JobCoachingChat";
import StickyApplyBar from "@/components/jobs/StickyApplyBar";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { profile, toggleSavedJob, isJobSaved } = useUserProfile();

  const job = mockJobs.find((j) => j.id === id);

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
    <>
      <div className="max-w-lg mx-auto px-6 py-6 pb-28 space-y-6">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-ma-text-light hover:text-ma-navy transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Job header */}
        <div>
          <h1 className="text-xl font-bold text-ma-navy mb-1">{job.title}</h1>
          <p className="text-sm text-ma-text-light mb-3">{job.employer}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {salary && (
              <span className="px-2.5 py-1 bg-ma-teal/10 text-ma-navy font-medium rounded-full">
                {salary}
              </span>
            )}
            <span className="px-2.5 py-1 bg-ma-bg text-ma-text-light rounded-full">
              {job.location}
            </span>
            {job.isRemote && (
              <span className="px-2.5 py-1 bg-ma-mint/20 text-ma-navy rounded-full">
                Remote
              </span>
            )}
            <span className="px-2.5 py-1 bg-ma-bg text-ma-text-light rounded-full">
              {job.employmentType === "FULLTIME" ? "Full-time" : job.employmentType === "PARTTIME" ? "Part-time" : "Contract"}
            </span>
          </div>
        </div>

        {/* Coaching plan */}
        <CoachingPlan job={job} profile={profile} />

        {/* Job details accordion */}
        <div>
          <h2 className="text-lg font-bold text-ma-navy mb-3">Job details</h2>
          <JobDetailsAccordion job={job} />
        </div>

        {/* Embedded coaching chat */}
        <JobCoachingChat job={job} profile={profile} />

        {/* Disclaimer for mock jobs */}
        {!job.applyLink && (
          <p className="text-xs text-ma-text-light text-center">
            This is an illustrative listing to help you explore and practice.
          </p>
        )}
      </div>

      {/* Sticky apply bar */}
      <StickyApplyBar
        job={job}
        isSaved={isJobSaved(job.id)}
        onToggleSave={() => toggleSavedJob(job.id)}
      />
    </>
  );
}
