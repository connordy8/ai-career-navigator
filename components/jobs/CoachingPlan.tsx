"use client";

import { useState, useEffect, useCallback } from "react";
import { JobListing } from "@/lib/jobs/types";
import { UserProfile } from "@/lib/context/UserProfileContext";

interface CoachingStep {
  id: string;
  title: string;
  description: string;
  category: "research" | "skills" | "resume" | "practice" | "apply";
}

interface CoachingPlanProps {
  job: JobListing;
  profile: UserProfile;
}

const categoryIcons: Record<string, string> = {
  research: "🔍",
  skills: "⭐",
  resume: "📄",
  practice: "🎤",
  apply: "🚀",
};

export default function CoachingPlan({ job, profile }: CoachingPlanProps) {
  const [steps, setSteps] = useState<CoachingStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const fetchPlan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/jobs/coaching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job: {
            title: job.title,
            employer: job.employer,
            description: job.description,
            qualifications: job.qualifications,
            salary: job.salary,
            benefits: job.benefits,
          },
          profile: {
            currentJob: profile.currentJob,
            goals: profile.goals,
            barriers: profile.barriers,
            availableHours: profile.availableHours,
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setSteps(data.steps || []);
    } catch {
      setError("Couldn\u2019t generate your plan. Let\u2019s try again.");
    }
    setLoading(false);
  }, [job, profile]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const toggleCheck = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const checkedCount = checked.size;
  const totalCount = steps.length;

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-ma-navy">Your prep plan</h2>
        <p className="text-sm text-ma-text-light">Building a personalized plan for you...</p>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-ma-border p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-ma-border rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-ma-border rounded w-3/4" />
                <div className="h-3 bg-ma-border rounded w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-ma-navy">Your prep plan</h2>
        <div className="bg-ma-warm-bg rounded-xl p-4 text-center">
          <p className="text-sm text-ma-text mb-3">{error}</p>
          <button
            onClick={fetchPlan}
            className="text-sm font-medium text-ma-teal hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ma-navy">Your prep plan</h2>
        {totalCount > 0 && (
          <span className="text-xs text-ma-text-light">
            {checkedCount} of {totalCount} steps reviewed
          </span>
        )}
      </div>
      <p className="text-sm text-ma-text-light">
        Here&apos;s what we&apos;d suggest before you apply. Check off each step as you go.
      </p>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="h-1.5 bg-ma-border rounded-full overflow-hidden">
          <div
            className="h-full bg-ma-teal rounded-full transition-all duration-300"
            style={{ width: `${(checkedCount / totalCount) * 100}%` }}
          />
        </div>
      )}

      {steps.map((step) => (
        <button
          key={step.id}
          onClick={() => toggleCheck(step.id)}
          className={`w-full text-left bg-white rounded-xl border p-4 transition-all ${
            checked.has(step.id)
              ? "border-ma-teal/30 bg-ma-teal/5"
              : "border-ma-border hover:border-ma-teal/50"
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                checked.has(step.id)
                  ? "border-ma-teal bg-ma-teal"
                  : "border-ma-border"
              }`}
            >
              {checked.has(step.id) && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{categoryIcons[step.category] || "📋"}</span>
                <span
                  className={`text-sm font-medium transition-colors ${
                    checked.has(step.id) ? "text-ma-text-light line-through" : "text-ma-navy"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              <p
                className={`text-xs leading-relaxed transition-colors ${
                  checked.has(step.id) ? "text-ma-text-light/60" : "text-ma-text-light"
                }`}
              >
                {step.description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
