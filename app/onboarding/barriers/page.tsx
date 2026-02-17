"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserProfile } from "@/lib/context/UserProfileContext";
import ProgressBar from "@/components/ui/ProgressBar";

const barrierOptions = [
  { id: "childcare", label: "Childcare" },
  { id: "transportation", label: "Transportation" },
  { id: "housing", label: "Housing" },
  { id: "food", label: "Food" },
  { id: "healthcare", label: "Healthcare" },
  { id: "internet", label: "Internet / Computer" },
  { id: "language", label: "Language" },
  { id: "none", label: "None of these" },
];

export default function BarriersPage() {
  const router = useRouter();
  const { profile, updateProfile } = useUserProfile();
  const isEditing = profile.completedOnboarding;
  const [selectedBarriers, setSelectedBarriers] = useState<string[]>(profile.barriers);

  const toggleBarrier = (id: string) => {
    if (id === "none") {
      setSelectedBarriers(["none"]);
      return;
    }
    setSelectedBarriers((prev) => {
      const filtered = prev.filter((b) => b !== "none");
      return filtered.includes(id)
        ? filtered.filter((b) => b !== id)
        : [...filtered, id];
    });
  };

  const handleSave = () => {
    updateProfile({ barriers: selectedBarriers });
    router.push(isEditing ? "/profile" : "/onboarding/summary");
  };

  return (
    <div className="space-y-8">
      {!isEditing && <ProgressBar currentStep={4} totalSteps={5} />}

      <div>
        <h1 className="text-2xl font-bold text-ma-navy mb-1">
          {isEditing ? "Update support needs" : "Anything making this harder right now?"}
        </h1>
        <p className="text-sm text-ma-text-light">You&apos;re not alone. We can connect you with real help for any of these.</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {barrierOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => toggleBarrier(option.id)}
            className={`p-3 rounded-xl border text-left text-sm transition-all min-h-[48px] ${
              selectedBarriers.includes(option.id)
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
          onClick={() => router.push(isEditing ? "/profile" : "/onboarding/availability")}
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
