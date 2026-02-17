"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserProfile } from "@/lib/context/UserProfileContext";
import ProgressBar from "@/components/ui/ProgressBar";

const jobOptions = [
  { id: "retail", label: "Retail / Sales" },
  { id: "warehouse", label: "Warehouse / Logistics" },
  { id: "food_service", label: "Food Service" },
  { id: "customer_service", label: "Customer Service" },
  { id: "healthcare_support", label: "Healthcare" },
  { id: "admin", label: "Office / Admin" },
  { id: "delivery", label: "Delivery / Driving" },
  { id: "cleaning", label: "Cleaning / Maintenance" },
  { id: "childcare", label: "Childcare / Education" },
  { id: "other", label: "Something else" },
];

const incomeOptions = [
  { id: "under_10", label: "Under $10/hr" },
  { id: "10_13", label: "$10 – $13/hr" },
  { id: "13_16", label: "$13 – $16/hr" },
  { id: "16_20", label: "$16 – $20/hr" },
  { id: "over_20", label: "Over $20/hr" },
  { id: "not_working", label: "Not currently working" },
  { id: "prefer_not", label: "Prefer not to say" },
];

export default function SituationPage() {
  const router = useRouter();
  const { profile, updateProfile } = useUserProfile();
  const isEditing = profile.completedOnboarding;
  const [selectedJob, setSelectedJob] = useState(profile.currentJob);
  const [selectedIncome, setSelectedIncome] = useState(profile.currentIncome);
  const [location, setLocation] = useState(profile.location);

  const handleSave = () => {
    updateProfile({ currentJob: selectedJob, currentIncome: selectedIncome, location });
    router.push(isEditing ? "/profile" : "/onboarding/goals");
  };

  return (
    <div className="space-y-8">
      {!isEditing && <ProgressBar currentStep={1} totalSteps={5} />}

      <div>
        <h1 className="text-2xl font-bold text-ma-navy mb-1">
          {isEditing ? "Update your info" : "Let\u2019s get to know you"}
        </h1>
        <p className="text-sm text-ma-text-light">No wrong answers here. This just helps us personalize things for you.</p>
      </div>

      <div>
        <h2 className="font-semibold text-ma-navy mb-3">What kind of work do you do?</h2>
        <div className="grid grid-cols-2 gap-2">
          {jobOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedJob(option.id)}
              className={`p-3 rounded-xl border text-left text-sm transition-all min-h-[48px] ${
                selectedJob === option.id
                  ? "border-ma-teal bg-ma-teal/10 font-medium text-ma-navy"
                  : "border-ma-border bg-white text-ma-text hover:border-ma-teal/50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-ma-navy mb-3">How much do you earn?</h2>
        <div className="space-y-2">
          {incomeOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedIncome(option.id)}
              className={`w-full p-3 rounded-xl border text-left text-sm transition-all min-h-[48px] ${
                selectedIncome === option.id
                  ? "border-ma-teal bg-ma-teal/10 font-medium text-ma-navy"
                  : "border-ma-border bg-white text-ma-text hover:border-ma-teal/50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-ma-navy mb-3">Where do you live?</h2>
        <input
          type="text"
          placeholder="ZIP code or city, state"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 rounded-xl border border-ma-border bg-white text-sm focus:border-ma-teal focus:outline-none min-h-[48px]"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => router.push(isEditing ? "/profile" : "/onboarding/goals")}
          className="flex-1 py-3 text-sm text-ma-text-light hover:text-ma-navy transition-colors"
        >
          {isEditing ? "Cancel" : "Skip"}
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
