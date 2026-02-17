"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserProfile } from "@/lib/context/UserProfileContext";
import ProgressBar from "@/components/ui/ProgressBar";

const goalOptions = [
  { id: "better_pay", label: "Better pay" },
  { id: "benefits", label: "Better benefits" },
  { id: "closer_commute", label: "Closer to home" },
  { id: "better_hours", label: "Better hours" },
  { id: "new_career", label: "A whole new career" },
  { id: "learn_skills", label: "Learn new skills" },
  { id: "stability", label: "More job security" },
  { id: "growth", label: "Room to grow" },
];

export default function GoalsPage() {
  const router = useRouter();
  const { profile, updateProfile } = useUserProfile();
  const isEditing = profile.completedOnboarding;
  const [selectedGoals, setSelectedGoals] = useState<string[]>(profile.goals);

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    updateProfile({ goals: selectedGoals });
    router.push(isEditing ? "/profile" : "/onboarding/availability");
  };

  return (
    <div className="space-y-8">
      {!isEditing && <ProgressBar currentStep={2} totalSteps={5} />}

      <div>
        <h1 className="text-2xl font-bold text-ma-navy mb-1">
          {isEditing ? "Update your goals" : "What would make your life better?"}
        </h1>
        <p className="text-sm text-ma-text-light">Pick as many as you want &mdash; we&apos;ll build your plan around these.</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {goalOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => toggleGoal(option.id)}
            className={`p-3 rounded-xl border text-left text-sm transition-all min-h-[48px] ${
              selectedGoals.includes(option.id)
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
          onClick={() => router.push(isEditing ? "/profile" : "/onboarding/situation")}
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
