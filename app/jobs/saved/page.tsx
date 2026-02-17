"use client";

import Link from "next/link";
import { mockJobs } from "@/lib/jobs/mock-data";
import { useUserProfile } from "@/lib/context/UserProfileContext";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function SavedJobsPage() {
  const { profile, toggleSavedJob } = useUserProfile();

  const savedJobs = mockJobs.filter((job) => profile.savedJobs.includes(job.id));

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-ma-navy mb-1">Saved Jobs</h1>
      <p className="text-ma-text-light text-sm mb-6">{savedJobs.length} job{savedJobs.length !== 1 ? "s" : ""} saved</p>

      {savedJobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📌</div>
          <h2 className="font-bold text-ma-navy mb-2">No saved jobs yet</h2>
          <p className="text-sm text-ma-text-light mb-4">Tap the bookmark icon on any job to save it here</p>
          <Link href="/jobs">
            <Button variant="teal">Browse Jobs</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {savedJobs.map((job) => (
            <Card key={job.id} hover>
              <div className="flex justify-between items-start mb-2">
                <Link href={`/jobs/${job.id}`} className="flex-1">
                  <h2 className="font-bold text-ma-navy hover:text-ma-teal transition-colors">{job.title}</h2>
                  <p className="text-sm text-ma-text-light">{job.employer}</p>
                </Link>
                <button onClick={() => toggleSavedJob(job.id)} className="p-2 hover:bg-ma-bg rounded-lg" aria-label="Remove saved job">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#2DD7B9" stroke="#2DD7B9" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="teal">${job.salary.min}-${job.salary.max}/hr</Badge>
                <Badge variant="light-blue">📍 {job.location}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
