"use client";

import { JobListing } from "@/lib/jobs/types";
import { useUserProfile } from "@/lib/context/UserProfileContext";

interface StickyApplyBarProps {
  job: JobListing;
  isSaved: boolean;
  onToggleSave: () => void;
}

export default function StickyApplyBar({ job, isSaved, onToggleSave }: StickyApplyBarProps) {
  const { trackMilestone } = useUserProfile();

  const handleApplyClick = () => {
    trackMilestone("applied_to_job");
  };

  return (
    <div className="fixed bottom-14 md:bottom-0 left-0 right-0 z-40 bg-white border-t border-ma-border px-4 py-3">
      <div className="max-w-lg mx-auto flex items-center gap-3">
        <button
          onClick={onToggleSave}
          className="p-3 rounded-xl border border-ma-border hover:border-ma-teal transition-colors"
          aria-label={isSaved ? "Unsave job" : "Save job"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? "#2DD7B9" : "none"} stroke={isSaved ? "#2DD7B9" : "#9ca3af"} strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
        {job.applyLink ? (
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleApplyClick}
            className="flex-1 py-3 bg-ma-teal text-white rounded-xl text-sm font-medium text-center hover:bg-ma-teal/90 transition-colors"
          >
            Apply Now
          </a>
        ) : (
          <span className="flex-1 py-3 bg-ma-teal/50 text-white rounded-xl text-sm font-medium text-center cursor-not-allowed">
            Illustrative listing
          </span>
        )}
      </div>
    </div>
  );
}
