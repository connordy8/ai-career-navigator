"use client";

import { useRouter } from "next/navigation";
import { useUserProfile } from "@/lib/context/UserProfileContext";
import Link from "next/link";

const jobLabels: Record<string, string> = {
  retail: "Retail / Sales", warehouse: "Warehouse / Logistics", food_service: "Food Service",
  customer_service: "Customer Service", healthcare_support: "Healthcare",
  admin: "Office / Admin", delivery: "Delivery / Driving", cleaning: "Cleaning / Maintenance",
  childcare: "Childcare / Education", other: "Other",
};

const goalLabels: Record<string, string> = {
  better_pay: "Better pay", benefits: "Better benefits", closer_commute: "Closer to home",
  better_hours: "Better hours", new_career: "New career", learn_skills: "Learn skills",
  stability: "Job security", growth: "Room to grow",
};

const barrierLabels: Record<string, string> = {
  childcare: "Childcare", transportation: "Transportation", housing: "Housing",
  food: "Food", healthcare: "Healthcare", internet: "Internet / Computer",
  language: "Language", none: "None",
};

const hoursLabels: Record<string, string> = {
  "1_2": "1–2 hrs/week", "3_5": "3–5 hrs/week", "5_10": "5–10 hrs/week",
  "10_20": "10–20 hrs/week", "20_plus": "20+ hrs/week", just_job: "Just looking for a job",
};

export default function ProfilePage() {
  const router = useRouter();
  const { profile, resetProfile } = useUserProfile();

  if (!profile.completedOnboarding) {
    return (
      <div className="max-w-lg mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold text-ma-navy mb-2">Welcome!</h1>
        <p className="text-sm text-ma-text-light mb-6">Tell us about yourself so we can personalize your experience.</p>
        <Link
          href="/onboarding/situation"
          className="inline-block px-6 py-3 bg-ma-navy text-white rounded-xl text-sm font-medium"
        >
          Get started
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold text-ma-navy mb-6">Your preferences</h1>

      <div className="bg-white rounded-xl border border-ma-border divide-y divide-ma-border">
        {/* Each preference as an editable row */}
        {profile.currentJob && (
          <Link href="/onboarding/situation" className="flex justify-between items-center p-4 hover:bg-ma-bg/50 transition-colors">
            <div>
              <p className="text-xs text-ma-text-light">Current work</p>
              <p className="text-sm font-medium text-ma-navy">{jobLabels[profile.currentJob] || profile.currentJob}</p>
            </div>
            <span className="text-xs text-ma-teal">Edit</span>
          </Link>
        )}
        {profile.location && (
          <Link href="/onboarding/situation" className="flex justify-between items-center p-4 hover:bg-ma-bg/50 transition-colors">
            <div>
              <p className="text-xs text-ma-text-light">Location</p>
              <p className="text-sm font-medium text-ma-navy">{profile.location}</p>
            </div>
            <span className="text-xs text-ma-teal">Edit</span>
          </Link>
        )}
        {profile.goals.length > 0 && (
          <Link href="/onboarding/goals" className="flex justify-between items-center p-4 hover:bg-ma-bg/50 transition-colors">
            <div>
              <p className="text-xs text-ma-text-light">Goals</p>
              <p className="text-sm font-medium text-ma-navy">{profile.goals.map(g => goalLabels[g] || g).join(", ")}</p>
            </div>
            <span className="text-xs text-ma-teal">Edit</span>
          </Link>
        )}
        {profile.availableHours && (
          <Link href="/onboarding/availability" className="flex justify-between items-center p-4 hover:bg-ma-bg/50 transition-colors">
            <div>
              <p className="text-xs text-ma-text-light">Time available</p>
              <p className="text-sm font-medium text-ma-navy">{hoursLabels[profile.availableHours] || profile.availableHours}</p>
            </div>
            <span className="text-xs text-ma-teal">Edit</span>
          </Link>
        )}
        {profile.barriers.length > 0 && profile.barriers[0] !== "none" && (
          <Link href="/onboarding/barriers" className="flex justify-between items-center p-4 hover:bg-ma-bg/50 transition-colors">
            <div>
              <p className="text-xs text-ma-text-light">Support needed</p>
              <p className="text-sm font-medium text-ma-navy">{profile.barriers.map(b => barrierLabels[b] || b).join(", ")}</p>
            </div>
            <span className="text-xs text-ma-teal">Edit</span>
          </Link>
        )}
      </div>

      {/* Quick links */}
      <h2 className="text-lg font-bold text-ma-navy mt-8 mb-3">Explore</h2>
      <div className="bg-white rounded-xl border border-ma-border divide-y divide-ma-border">
        <Link href="/resources" className="flex items-center justify-between p-4 hover:bg-ma-bg/50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-xl">🤝</span>
            <div>
              <p className="text-sm font-medium text-ma-navy">Support Resources</p>
              <p className="text-xs text-ma-text-light">Free help with food, housing, childcare & more</p>
            </div>
          </div>
          <span className="text-ma-text-light">→</span>
        </Link>
        <Link href="/plan" className="flex items-center justify-between p-4 hover:bg-ma-bg/50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-xl">📋</span>
            <div>
              <p className="text-sm font-medium text-ma-navy">My Action Plan</p>
              <p className="text-xs text-ma-text-light">Track your progress and earn your badge</p>
            </div>
          </div>
          <span className="text-ma-text-light">→</span>
        </Link>
        <Link href="/chat" className="flex items-center justify-between p-4 hover:bg-ma-bg/50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-xl">💬</span>
            <div>
              <p className="text-sm font-medium text-ma-navy">Career Advisor</p>
              <p className="text-xs text-ma-text-light">Get personalized guidance anytime</p>
            </div>
          </div>
          <span className="text-ma-text-light">→</span>
        </Link>
      </div>

      {/* Preference actions */}
      <div className="mt-6 space-y-3">
        <Link
          href="/onboarding/situation"
          className="block w-full text-center py-3 bg-white border border-ma-border rounded-xl text-sm font-medium text-ma-navy hover:border-ma-teal transition-colors"
        >
          Redo all preferences
        </Link>
        <button
          className="block w-full text-center py-3 bg-white border border-ma-border rounded-xl text-sm font-medium text-ma-text-light hover:border-ma-error hover:text-ma-error transition-colors"
          onClick={() => {
            if (confirm("This will clear your preferences so you can start over. Continue?")) {
              resetProfile();
              router.push("/onboarding/situation");
            }
          }}
        >
          Start fresh as a new user
        </button>
      </div>
    </div>
  );
}
