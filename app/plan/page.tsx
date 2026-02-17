"use client";

import Link from "next/link";
import { useUserProfile, MILESTONE_ACTIONS, BADGE_THRESHOLD } from "@/lib/context/UserProfileContext";
import { mockJobs } from "@/lib/jobs/mock-data";
import { careerPaths } from "@/lib/careers/career-paths";

export default function PlanPage() {
  const { profile, hasMilestone, milestoneCount } = useUserProfile();

  if (!profile.completedOnboarding) {
    return (
      <div className="max-w-lg mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold text-ma-navy mb-2">Your plan starts here</h1>
        <p className="text-sm text-ma-text-light mb-6 leading-relaxed">
          Tell us a bit about yourself and we&apos;ll create a personalized action plan to help you move forward.
        </p>
        <Link
          href="/onboarding/situation"
          className="inline-block px-6 py-3 bg-ma-navy text-white rounded-xl text-sm font-medium"
        >
          Get started
        </Link>
      </div>
    );
  }

  const savedJobs = mockJobs.filter((j) => profile.savedJobs.includes(j.id));
  const exploredCareerData = careerPaths.filter((c) => profile.exploredCareers.includes(c.id));
  const progress = Math.min(milestoneCount / BADGE_THRESHOLD, 1);
  const remaining = Math.max(BADGE_THRESHOLD - milestoneCount, 0);

  return (
    <div className="max-w-lg mx-auto px-6 py-6 pb-20 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ma-navy mb-1">My plan</h1>
        <p className="text-sm text-ma-text-light">
          Everything you&apos;re working toward, in one place.
        </p>
      </div>

      {/* Badge progress card */}
      {!profile.badgeUnlocked ? (
        <div className="bg-gradient-to-br from-ma-navy to-ma-navy/90 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold">Unlock a free coaching session</p>
            <div className="text-lg font-bold">{milestoneCount}/{BADGE_THRESHOLD}</div>
          </div>
          <p className="text-xs text-white/60 mb-4">
            {remaining > 0
              ? `Complete ${remaining} more step${remaining !== 1 ? "s" : ""} to earn a free 30-minute session with a live career coach.`
              : "You did it! All steps complete."}
          </p>

          {/* Progress bar */}
          <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-5">
            <div
              className="h-full bg-ma-teal rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* Milestone checklist — clickable! */}
          <div className="space-y-1">
            {MILESTONE_ACTIONS.map((action) => {
              const done = hasMilestone(action.id);
              if (done) {
                return (
                  <div key={action.id} className="flex items-center gap-3 py-2 px-3 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-ma-teal flex items-center justify-center shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/70 line-through">{action.label}</p>
                    </div>
                    <span className="text-lg">{action.icon}</span>
                  </div>
                );
              }
              return (
                <Link key={action.id} href={action.href} className="block">
                  <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors">
                    <div className="w-6 h-6 rounded-full border-2 border-white/30 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">{action.label}</p>
                      <p className="text-xs text-white/50">{action.description}</p>
                    </div>
                    <span className="text-lg">{action.icon}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        /* Badge unlocked state */
        <div className="bg-gradient-to-br from-ma-teal to-ma-teal/80 rounded-2xl p-5 text-white text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-lg font-bold mb-1">You earned your coaching session!</h2>
          <p className="text-sm text-white/80 mb-4">
            Your grit is showing. You&apos;ve completed all {milestoneCount} steps. A live coach can help you go even further.
          </p>
          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-white text-ma-navy rounded-xl text-sm font-bold hover:bg-white/90 transition-colors"
          >
            Book your free session
          </a>

          {/* Completed milestones */}
          <div className="mt-5 space-y-1 text-left">
            {MILESTONE_ACTIONS.map((action) => (
              <div key={action.id} className="flex items-center gap-3 py-1.5 px-3">
                <span className="text-base">{action.icon}</span>
                <p className="text-xs text-white/70">{action.label}</p>
                <svg className="ml-auto w-4 h-4 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved jobs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-ma-navy">Saved jobs</h2>
          <Link href="/jobs" className="text-xs text-ma-teal font-medium">
            Browse more
          </Link>
        </div>
        {savedJobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-ma-border p-4 text-center">
            <p className="text-sm text-ma-text-light mb-2">No saved jobs yet</p>
            <Link href="/jobs" className="text-xs text-ma-teal font-medium">
              Find jobs that match your goals
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {savedJobs.slice(0, 3).map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="block">
                <div className="bg-white rounded-xl border border-ma-border p-3 hover:border-ma-teal transition-colors">
                  <p className="text-sm font-medium text-ma-navy">{job.title}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-ma-text-light">
                    <span>{job.employer}</span>
                    <span>&middot;</span>
                    <span className="text-ma-navy font-medium">${job.salary.min}&ndash;${job.salary.max}/{job.salary.period === "hourly" ? "hr" : "yr"}</span>
                  </div>
                </div>
              </Link>
            ))}
            {savedJobs.length > 3 && (
              <Link href="/jobs/saved" className="block text-center text-xs text-ma-teal font-medium py-2">
                View all {savedJobs.length} saved jobs
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Career interests */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-ma-navy">Career interests</h2>
          <Link href="/careers" className="text-xs text-ma-teal font-medium">
            Explore more
          </Link>
        </div>
        {exploredCareerData.length === 0 ? (
          <div className="bg-white rounded-xl border border-ma-border p-4 text-center">
            <p className="text-sm text-ma-text-light mb-2">No careers explored yet</p>
            <Link href="/careers" className="text-xs text-ma-teal font-medium">
              See careers you can train for
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {exploredCareerData.map((career) => (
              <Link key={career.id} href={`/careers/${career.id}`} className="block">
                <div className="bg-white rounded-xl border border-ma-border p-3 hover:border-ma-teal transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{career.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-ma-navy">{career.title}</p>
                      <p className="text-xs text-ma-text-light">{career.salaryRange} &middot; {career.timeToEntry}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Preferences link */}
      <div className="text-center pt-2">
        <Link href="/profile" className="text-xs text-ma-text-light hover:text-ma-teal transition-colors">
          Edit your preferences
        </Link>
      </div>
    </div>
  );
}
