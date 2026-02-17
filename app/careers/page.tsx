"use client";

import Link from "next/link";
import { careerPaths } from "@/lib/careers/career-paths";
import { useUserProfile } from "@/lib/context/UserProfileContext";

export default function CareersPage() {
  const { profile } = useUserProfile();

  return (
    <div className="max-w-lg mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold text-ma-navy mb-1">Careers you can train for</h1>
      <p className="text-sm text-ma-text-light mb-8 leading-relaxed">
        These are real career paths with free or low-cost training. Many people start earning more within months.
      </p>

      <div className="space-y-3">
        {careerPaths.map((path) => (
          <Link key={path.id} href={`/careers/${path.id}`} className="block">
            <div className="bg-white rounded-xl border border-ma-border p-4 hover:border-ma-teal transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{path.icon}</span>
                <h2 className="font-semibold text-ma-navy">{path.title}</h2>
              </div>
              <p className="text-sm text-ma-text-light mb-3">{path.description}</p>
              <div className="flex items-center gap-4 text-xs text-ma-text-light">
                <span className="font-medium text-ma-navy">{path.salaryRange}</span>
                <span>{path.timeToEntry}</span>
                <span className="text-ma-teal">{path.demandLevel} demand</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Preference feedback */}
      {profile.completedOnboarding && (
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
