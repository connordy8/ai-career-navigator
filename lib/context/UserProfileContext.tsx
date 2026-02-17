"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

// --- Milestone / Badge definitions ---
export interface MilestoneAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  href: string;
}

export const MILESTONE_ACTIONS: MilestoneAction[] = [
  { id: "completed_onboarding", label: "Tell us about your goals", description: "Share your situation so we can personalize everything for you", icon: "🎯", href: "/onboarding/situation" },
  { id: "applied_to_job", label: "Apply to a job", description: "Take the leap and submit an application", icon: "🚀", href: "/jobs" },
  { id: "used_advisor", label: "Chat with the AI career advisor", description: "Get personalized guidance on your next move", icon: "💬", href: "/chat" },
  { id: "explored_career", label: "Explore a career path", description: "Research a higher-paying career you could train for", icon: "🗺️", href: "/careers" },
  { id: "explored_resource", label: "Find free support near you", description: "Get help with food, housing, childcare, or more", icon: "🤝", href: "/resources" },
];

export const BADGE_THRESHOLD = 5;

// --- Profile ---
export interface UserProfile {
  currentJob: string;
  currentIncome: string;
  location: string;
  goals: string[];
  availableHours: string;
  barriers: string[];
  completedOnboarding: boolean;
  savedJobs: string[];
  // Milestone tracking
  completedMilestones: string[];
  badgeUnlocked: boolean;
  badgeUnlockedAt: string | null;
  firstVisitDate: string | null;
  lastVisitDate: string | null;
  // Exploration tracking
  exploredCareers: string[];
  exploredResources: string[];
}

const defaultProfile: UserProfile = {
  currentJob: "",
  currentIncome: "",
  location: "",
  goals: [],
  availableHours: "",
  barriers: [],
  completedOnboarding: false,
  savedJobs: [],
  completedMilestones: [],
  badgeUnlocked: false,
  badgeUnlockedAt: null,
  firstVisitDate: null,
  lastVisitDate: null,
  exploredCareers: [],
  exploredResources: [],
};

interface UserProfileContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetProfile: () => void;
  toggleSavedJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
  trackMilestone: (milestoneId: string) => void;
  hasMilestone: (milestoneId: string) => boolean;
  milestoneCount: number;
  trackCareerExplored: (careerId: string) => void;
  trackResourceExplored: (resourceId: string) => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

const STORAGE_KEY = "career-navigator-profile";

// Sync write to localStorage — guarantees persistence before any navigation
function persistToStorage(profile: UserProfile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore localStorage errors (private browsing, full storage, etc.)
  }
}

function addMilestone(prev: UserProfile, milestoneId: string): Partial<UserProfile> {
  if (prev.completedMilestones.includes(milestoneId)) return {};
  const newMilestones = [...prev.completedMilestones, milestoneId];
  const updates: Partial<UserProfile> = { completedMilestones: newMilestones };
  if (newMilestones.length >= BADGE_THRESHOLD && !prev.badgeUnlocked) {
    updates.badgeUnlocked = true;
    updates.badgeUnlockedAt = new Date().toISOString();
  }
  return updates;
}

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfile({ ...defaultProfile, ...JSON.parse(stored) });
      }
    } catch {
      // Ignore localStorage errors
    }
    setLoaded(true);
  }, []);

  // Track visit dates (runs once after load)
  useEffect(() => {
    if (!loaded) return;
    const today = new Date().toISOString().split("T")[0];
    setProfile((prev) => {
      const updates: Partial<UserProfile> = { lastVisitDate: today };
      if (!prev.firstVisitDate) {
        updates.firstVisitDate = today;
      }
      const next = { ...prev, ...updates };
      persistToStorage(next);
      return next;
    });
  }, [loaded]);

  // Wrapper: update state AND persist synchronously inside the updater
  // This prevents the race condition where router.push() fires before
  // the useEffect-based localStorage write can execute.
  const setProfileAndPersist = useCallback(
    (updater: (prev: UserProfile) => UserProfile) => {
      setProfile((prev) => {
        const next = updater(prev);
        if (next !== prev) {
          persistToStorage(next);
        }
        return next;
      });
    },
    []
  );

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfileAndPersist((prev) => ({ ...prev, ...updates }));
  }, [setProfileAndPersist]);

  const resetProfile = useCallback(() => {
    setProfile(defaultProfile);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  const toggleSavedJob = useCallback((jobId: string) => {
    setProfileAndPersist((prev) => {
      const isRemoving = prev.savedJobs.includes(jobId);
      const newSavedJobs = isRemoving
        ? prev.savedJobs.filter((id) => id !== jobId)
        : [...prev.savedJobs, jobId];
      return { ...prev, savedJobs: newSavedJobs };
    });
  }, [setProfileAndPersist]);

  const isJobSaved = useCallback((jobId: string) => {
    return profile.savedJobs.includes(jobId);
  }, [profile.savedJobs]);

  const trackMilestone = useCallback((milestoneId: string) => {
    setProfileAndPersist((prev) => {
      const updates = addMilestone(prev, milestoneId);
      return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev;
    });
  }, [setProfileAndPersist]);

  const hasMilestone = useCallback((milestoneId: string) => {
    return profile.completedMilestones.includes(milestoneId);
  }, [profile.completedMilestones]);

  const trackCareerExplored = useCallback((careerId: string) => {
    setProfileAndPersist((prev) => {
      if (prev.exploredCareers.includes(careerId)) return prev;
      const milestoneUpdates = addMilestone(prev, "explored_career");
      return {
        ...prev,
        exploredCareers: [...prev.exploredCareers, careerId],
        ...milestoneUpdates,
      };
    });
  }, [setProfileAndPersist]);

  const trackResourceExplored = useCallback((resourceId: string) => {
    setProfileAndPersist((prev) => {
      if (prev.exploredResources.includes(resourceId)) return prev;
      const milestoneUpdates = addMilestone(prev, "explored_resource");
      return {
        ...prev,
        exploredResources: [...prev.exploredResources, resourceId],
        ...milestoneUpdates,
      };
    });
  }, [setProfileAndPersist]);

  // Only count milestones that are in the current MILESTONE_ACTIONS list
  const validMilestoneIds = MILESTONE_ACTIONS.map((a) => a.id);
  const milestoneCount = profile.completedMilestones.filter((m) => validMilestoneIds.includes(m)).length;

  if (!loaded) {
    return null;
  }

  return (
    <UserProfileContext.Provider value={{
      profile, updateProfile, resetProfile, toggleSavedJob, isJobSaved,
      trackMilestone, hasMilestone, milestoneCount, trackCareerExplored, trackResourceExplored,
    }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
}
