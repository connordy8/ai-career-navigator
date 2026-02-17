"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-ma-border">
      <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-ma-teal rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">MA</span>
          </div>
          <span className="font-semibold text-ma-navy text-sm">Career Navigator</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/plan" className="text-ma-text-light hover:text-ma-navy transition-colors">My Plan</Link>
          <Link href="/jobs" className="text-ma-text-light hover:text-ma-navy transition-colors">Jobs</Link>
          <Link href="/careers" className="text-ma-text-light hover:text-ma-navy transition-colors">Careers</Link>
          <Link href="/chat" className="text-ma-text-light hover:text-ma-navy transition-colors">Advisor</Link>
          <Link href="/resources" className="text-ma-text-light hover:text-ma-navy transition-colors">Resources</Link>
          <Link href="/profile" className="text-ma-text-light hover:text-ma-navy transition-colors">Profile</Link>
        </nav>
      </div>
    </header>
  );
}
