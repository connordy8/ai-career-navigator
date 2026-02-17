"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { JobListing } from "@/lib/jobs/types";
import { useUserProfile } from "@/lib/context/UserProfileContext";

export default function JobsPage() {
  const router = useRouter();
  const { profile, toggleSavedJob, isJobSaved } = useUserProfile();
  const [query, setQuery] = useState("");

  const storeAndNavigate = useCallback((job: JobListing) => {
    try {
      sessionStorage.setItem(`job_${job.id}`, JSON.stringify(job));
    } catch {}
    router.push(`/jobs/${job.id}`);
  }, [router]);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState("");

  const fetchJobs = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("query", q);
      if (profile.location) params.set("location", profile.location);
      const res = await fetch(`/api/jobs/search?${params}`);
      const data = await res.json();
      setJobs(data.jobs || []);
      setDataSource(data.source || "unknown");
    } catch {
      setJobs([]);
      setDataSource("error");
    }
    setLoading(false);
  }, [profile.location]);

  useEffect(() => { fetchJobs(""); }, [fetchJobs]);

  useEffect(() => {
    const timeout = setTimeout(() => setSearchQuery(query), 500);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => { fetchJobs(searchQuery); }, [searchQuery, fetchJobs]);

  const formatSalary = (job: JobListing) => {
    if (!job.salary.min && !job.salary.max) return null;
    const suffix = job.salary.period === "hourly" ? "hr" : "yr";
    if (job.salary.min && job.salary.max) return `$${job.salary.min}–$${job.salary.max}/${suffix}`;
    if (job.salary.min) return `$${job.salary.min}+/${suffix}`;
    return `Up to $${job.salary.max}/${suffix}`;
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold text-ma-navy mb-1">Jobs for you</h1>
      <p className="text-sm text-ma-text-light mb-6 leading-relaxed">
        {dataSource === "jsearch" ? "Real openings from Indeed, LinkedIn & more \u2014 updated daily." : "Here are some opportunities that could be a great fit for you."}
      </p>

      {/* Search */}
      <input
        type="text"
        placeholder="Search jobs, companies, or keywords..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-ma-border bg-white text-sm focus:border-ma-teal focus:outline-none min-h-[48px] mb-6"
      />

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <div className="w-6 h-6 border-2 border-ma-teal border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-ma-text-light">Searching...</p>
        </div>
      )}

      {/* Job list */}
      {!loading && (
        <div className="space-y-3">
          <p className="text-xs text-ma-text-light">{jobs.length} jobs found</p>

          {jobs.map((job) => {
            const salary = formatSalary(job);
            return (
              <div key={job.id} className="bg-white rounded-xl border border-ma-border p-4">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-ma-navy text-sm truncate">{job.title}</h2>
                    <p className="text-xs text-ma-text-light">{job.employer}</p>
                  </div>
                  <button
                    onClick={() => toggleSavedJob(job.id)}
                    className="p-1.5 ml-2 shrink-0"
                    aria-label={isJobSaved(job.id) ? "Unsave" : "Save"}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={isJobSaved(job.id) ? "#2DD7B9" : "none"} stroke={isJobSaved(job.id) ? "#2DD7B9" : "#9ca3af"} strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-ma-text-light mt-2">
                  {salary && <span className="font-medium text-ma-navy">{salary}</span>}
                  <span>{job.location}</span>
                  {job.isRemote && <span className="text-ma-teal">Remote</span>}
                </div>

                <div className="text-xs text-ma-text-light mt-2">
                  {job.postedDaysAgo}d ago{job.source ? ` · ${job.source}` : ""}
                </div>

                <div className="flex items-center gap-2 mt-3">
                  {job.applyLink ? (
                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 bg-ma-teal text-white rounded-lg text-xs font-medium text-center hover:bg-ma-teal/90 transition-colors"
                    >
                      Apply now
                    </a>
                  ) : (
                    <button
                      onClick={() => storeAndNavigate(job)}
                      className="flex-1 py-2 bg-ma-teal text-white rounded-lg text-xs font-medium text-center hover:bg-ma-teal/90 transition-colors"
                    >
                      Learn more
                    </button>
                  )}
                  <button
                    onClick={() => storeAndNavigate(job)}
                    className="flex-1 py-2 border border-ma-teal text-ma-teal rounded-lg text-xs font-medium text-center hover:bg-ma-teal/5 transition-colors"
                  >
                    Help me apply
                  </button>
                </div>
              </div>
            );
          })}

          {jobs.length === 0 && (
            <div className="text-center py-16">
              <p className="font-semibold text-ma-navy mb-2">Nothing yet</p>
              <p className="text-sm text-ma-text-light mb-4">Try different keywords or broaden your search</p>
              <button onClick={() => setQuery("")} className="text-sm text-ma-teal font-medium hover:underline">
                Clear search
              </button>
            </div>
          )}
        </div>
      )}

      {/* Preference feedback */}
      {!loading && profile.completedOnboarding && (
        <div className="mt-8 bg-ma-warm-bg rounded-2xl p-5 text-center">
          <p className="text-sm text-ma-text mb-2">
            Options not aligned with what you&apos;re looking for?
          </p>
          <Link
            href="/profile"
            className="text-sm font-medium text-ma-teal hover:underline"
          >
            Adjust your preferences
          </Link>
        </div>
      )}
    </div>
  );
}
