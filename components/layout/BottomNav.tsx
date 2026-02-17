"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserProfile, BADGE_THRESHOLD } from "@/lib/context/UserProfileContext";

const navItems = [
  {
    href: "/jobs",
    label: "Jobs",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    href: "/careers",
    label: "Careers",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    href: "/plan",
    label: "My Plan",
    hasBadge: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 20V10" />
        <path d="M18 20V4" />
        <path d="M6 20v-4" />
      </svg>
    ),
  },
  {
    href: "/chat",
    label: "Advisor",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "More",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { milestoneCount, profile } = useUserProfile();

  if (pathname?.startsWith("/onboarding")) return null;

  const showProgressDot = profile.completedOnboarding && milestoneCount > 0 && milestoneCount < BADGE_THRESHOLD;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-ma-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = item.href === "/profile"
            ? pathname === "/profile" || pathname?.startsWith("/resources")
            : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
                isActive ? "text-ma-teal" : "text-ma-text-light hover:text-ma-navy"
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
              {"hasBadge" in item && showProgressDot && (
                <span className="absolute top-1.5 right-1/2 translate-x-4 w-2 h-2 bg-ma-teal rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
