"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingChatButton() {
  const pathname = usePathname();

  // Hide on chat page (already there), during onboarding (don't distract),
  // and on career detail pages (sticky coach bar replaces it)
  if (pathname?.startsWith("/chat") || pathname?.startsWith("/onboarding") || pathname?.match(/^\/careers\/[^/]+/)) {
    return null;
  }

  return (
    <Link
      href="/chat"
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex items-center gap-2 bg-ma-teal text-white pl-4 pr-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
      aria-label="Chat with your career advisor"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <span className="text-sm font-medium">Need help?</span>
    </Link>
  );
}
