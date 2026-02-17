"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/lib/context/UserProfileContext";

export default function HomePage() {
  const router = useRouter();
  const { profile, resetProfile } = useUserProfile();
  const jobsLink = profile.completedOnboarding ? "/jobs" : "/onboarding/situation";
  const careersLink = profile.completedOnboarding ? "/careers" : "/onboarding/situation";

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      {/* Warm greeting */}
      <div className="mb-10">
        <p className="text-ma-teal font-semibold text-sm mb-2">Merit America Career Navigator</p>
        <h1 className="text-3xl font-bold text-ma-navy mb-3 leading-snug">
          You deserve a career that works for you.
        </h1>
        <p className="text-ma-text-light leading-relaxed">
          We&apos;re here to help you take your next step &mdash; whether that&apos;s a better job today or training for an even brighter future. It&apos;s free, private, and built around your life.
        </p>
      </div>

      {/* Two clear choices */}
      <div className="space-y-4 mb-10">
        <Link href={jobsLink} className="block group">
          <div className="bg-white rounded-2xl p-6 border border-ma-border group-hover:border-ma-teal group-hover:shadow-sm transition-all">
            <p className="text-xs font-medium text-ma-teal mb-2 uppercase tracking-wide">Quick wins</p>
            <h2 className="text-lg font-bold text-ma-navy mb-1">Find a better job now</h2>
            <p className="text-sm text-ma-text-light leading-relaxed">
              See real jobs near you that pay more, offer better hours, or have benefits &mdash; no extra training needed.
            </p>
          </div>
        </Link>

        <Link href={careersLink} className="block group">
          <div className="bg-white rounded-2xl p-6 border border-ma-border group-hover:border-ma-teal group-hover:shadow-sm transition-all">
            <p className="text-xs font-medium text-ma-lavender mb-2 uppercase tracking-wide">Long-term growth</p>
            <h2 className="text-lg font-bold text-ma-navy mb-1">Build skills for a great career</h2>
            <p className="text-sm text-ma-text-light leading-relaxed">
              Explore free training programs from trusted partners that lead to careers paying $40K–$80K+.
            </p>
          </div>
        </Link>
      </div>

      {/* Friendly AI nudge */}
      <div className="bg-ma-warm-bg rounded-2xl p-6 text-center">
        <p className="text-sm text-ma-text mb-2">
          Not sure where to start? That&apos;s totally okay.
        </p>
        <Link
          href="/chat"
          className="inline-flex items-center gap-1 text-ma-teal font-semibold text-sm hover:underline"
        >
          Chat with your career advisor &rarr;
        </Link>
        <p className="text-xs text-ma-text-light mt-2">
          Free, confidential, and personalized to you.
        </p>
      </div>

      {/* Trust signals */}
      <div className="mt-10 text-center">
        <p className="text-xs text-ma-text-light">
          Trusted by 40,000+ working adults &middot; Backed by Merit America &middot; Always free
        </p>
      </div>

      {/* Start fresh option for returning users */}
      {profile.completedOnboarding && (
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              if (confirm("This will clear your preferences so you can start over. Continue?")) {
                resetProfile();
                router.push("/onboarding/situation");
              }
            }}
            className="text-xs text-ma-text-light hover:text-ma-teal transition-colors"
          >
            Start fresh with new preferences
          </button>
        </div>
      )}
    </div>
  );
}
