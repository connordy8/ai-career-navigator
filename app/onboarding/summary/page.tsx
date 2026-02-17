"use client";

import { useRouter } from "next/navigation";
import { useUserProfile } from "@/lib/context/UserProfileContext";
import ProgressBar from "@/components/ui/ProgressBar";

function getRecommendation(goals: string[], availableHours: string) {
  const wantsNewCareer = goals.includes("new_career") || goals.includes("learn_skills");
  const hasTime = !["1_2", "just_job"].includes(availableHours);

  if (wantsNewCareer && hasTime) {
    return {
      primary: "careers",
      title: "Build skills for a great career",
      description: "Based on your goals, training programs could lead to significantly better-paying roles.",
    };
  }
  return {
    primary: "jobs",
    title: "Find a better job now",
    description: "Based on your experience, there are better jobs available that match what you want.",
  };
}

export default function SummaryPage() {
  const router = useRouter();
  const { profile, updateProfile, trackMilestone } = useUserProfile();
  const recommendation = getRecommendation(profile.goals, profile.availableHours);

  const handleFinish = (path: string) => {
    updateProfile({ completedOnboarding: true });
    trackMilestone("completed_onboarding");
    router.push(path);
  };

  return (
    <div className="space-y-8">
      <ProgressBar currentStep={5} totalSteps={5} />

      <div>
        <h1 className="text-2xl font-bold text-ma-navy mb-1">Great &mdash; here&apos;s what we&apos;d suggest</h1>
        <p className="text-sm text-ma-text-light">Based on what you shared, this looks like a great fit. You can always change course later.</p>
      </div>

      {/* Primary recommendation */}
      <button
        onClick={() => handleFinish(recommendation.primary === "jobs" ? "/jobs" : "/careers")}
        className="w-full text-left bg-white rounded-2xl p-6 border-2 border-ma-teal"
      >
        <p className="text-xs font-medium text-ma-teal mb-2 uppercase tracking-wide">Recommended</p>
        <h2 className="text-xl font-bold text-ma-navy mb-2">{recommendation.title}</h2>
        <p className="text-sm text-ma-text-light">{recommendation.description}</p>
      </button>

      {/* Secondary option */}
      <button
        onClick={() => handleFinish(recommendation.primary === "jobs" ? "/careers" : "/jobs")}
        className="w-full text-left bg-white rounded-2xl p-6 border border-ma-border hover:border-ma-teal transition-colors"
      >
        <h2 className="font-bold text-ma-navy mb-1">
          {recommendation.primary === "jobs" ? "Or explore career training" : "Or find a better job now"}
        </h2>
        <p className="text-sm text-ma-text-light">
          {recommendation.primary === "jobs"
            ? "Free programs that lead to higher-paying careers."
            : "Jobs that match your skills right now."}
        </p>
      </button>

      {/* Chat option */}
      <div className="text-center pt-2">
        <button
          onClick={() => { updateProfile({ completedOnboarding: true }); trackMilestone("completed_onboarding"); router.push("/chat"); }}
          className="text-sm text-ma-teal font-medium hover:underline"
        >
          I&apos;d rather talk it through with someone &rarr;
        </button>
      </div>

      <button
        onClick={() => router.push("/onboarding/barriers")}
        className="w-full py-3 text-sm text-ma-text-light hover:text-ma-navy transition-colors"
      >
        ← Back
      </button>
    </div>
  );
}
