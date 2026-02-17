"use client";

import { useState } from "react";
import { JobListing } from "@/lib/jobs/types";

interface JobDetailsAccordionProps {
  job: JobListing;
}

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

export default function JobDetailsAccordion({ job }: JobDetailsAccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const sections: Section[] = [
    {
      id: "about",
      title: "About this job",
      content: (
        <p className="text-sm text-ma-text leading-relaxed">{job.description}</p>
      ),
    },
    ...(job.qualifications.length > 0
      ? [
          {
            id: "qualifications",
            title: "What you need",
            content: (
              <ul className="space-y-2">
                {job.qualifications.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ma-text">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2DD7B9" strokeWidth="2" className="shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 12l3 3 5-5" />
                    </svg>
                    {q}
                  </li>
                ))}
              </ul>
            ),
          },
        ]
      : []),
    ...(job.benefits.length > 0
      ? [
          {
            id: "benefits",
            title: "Benefits",
            content: (
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((b, i) => (
                  <span key={i} className="px-3 py-1 bg-ma-mint/20 text-ma-navy text-xs rounded-full">
                    {b}
                  </span>
                ))}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="bg-white rounded-xl border border-ma-border divide-y divide-ma-border">
      {sections.map((section) => (
        <div key={section.id}>
          <button
            onClick={() => toggle(section.id)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-ma-bg/50 transition-colors"
          >
            <span className="text-sm font-medium text-ma-navy">{section.title}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`text-ma-text-light transition-transform ${openSection === section.id ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {openSection === section.id && (
            <div className="px-4 pb-4">{section.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
