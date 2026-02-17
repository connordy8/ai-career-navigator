"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserProfile } from "@/lib/context/UserProfileContext";
import ProgressBar from "@/components/ui/ProgressBar";

const timeOptions = [
  { id: "1_2", label: "1–2 hours a week" },
  { id: "3_5", label: "3–5 hours a week" },
  { id: "5_10", label: "5–10 hours a week" },
  { id: "10_20", label: "10–20 hours a week" },
  { id: "20_plus", label: "20+ hours a week" },
  { id: "just_job", label: "I just want a better job now" },
];

export default function AvailabilityPage() {
  const router = useRouter();
  const { profile, updateProfile } = useUserProfile();
  const isEditing = profile.completedOnboarding;
  const [selected, setSelected] = useState(profile.availableHours);

  const handleSave = () => {
    updateProfile({ availableHours: selected });
    router.push(isEditing ? "/profile" : "/onboarding/barriers");
  };

  return (
    <div className="space-y-8">
      {!isEditing && <ProgressBar currentStep={3} totalSteps={5} />}

      <div>
        <h1 className="text-2xl font-bold text-ma-navy mb-1">
          {isEditing ? "Update your availability" : "How much time can you spare?"}
        </h1>
        <p className="text-sm text-ma-text-light">Even a little bit adds up. We&apos;ll find options that fit your schedule.</p>
      </div>

      <div className="space-y-2">
        {timeOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelected(option.id)}
            className={`w-full p-3 rounded-xl border text-left text-sm transition-all min-h-[48px] ${
              selected === option.id
                ? "border-ma-teal bg-ma-teal/10 font-medium text-ma-navy"
                : "border-ma-border bg-white text-ma-text hover:border-ma-teal/50"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => router.push(isEditing ? "/profile" : "/onboarding/goals")}
          className="flex-1 py-3 text-sm text-ma-text-light hover:text-ma-navy transition-colors"
        >
          {isEditing ? "Cancel" : "Back"}
        </button>
        <button
          onClick={handleSave}
          className="flex-1 py-3 bg-ma-navy text-white rounded-xl text-sm font-medium hover:bg-ma-navy/90 transition-colors"
        >
          {isEditing ? "Save" : "Next"}
        </button>
      </div>
    </div>
  );
}
