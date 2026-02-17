"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { careerPaths } from "@/lib/careers/career-paths";
import { useUserProfile } from "@/lib/context/UserProfileContext";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export default function CareerPathDetailPage({ params }: { params: Promise<{ pathId: string }> }) {
  const { pathId } = use(params);
  const router = useRouter();
  const { trackCareerExplored } = useUserProfile();

  const path = careerPaths.find((p) => p.id === pathId);

  useEffect(() => {
    if (path) {
      trackCareerExplored(path.id);
    }
  }, [path, trackCareerExplored]);

  if (!path) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-ma-navy mb-4">Career Path Not Found</h1>
        <Button variant="teal" onClick={() => router.push("/careers")}>Back to Career Paths</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-ma-text-light hover:text-ma-navy mb-4 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to career paths
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="text-4xl mb-3">{path.icon}</div>
        <h1 className="text-2xl font-bold text-ma-navy mb-2">{path.title}</h1>
        <p className="text-ma-text-light">{path.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="teal">{path.salaryRange}</Badge>
          <Badge variant="lavender">{path.timeToEntry} to get started</Badge>
          <Badge variant="success">{path.demandLevel} Demand</Badge>
        </div>
      </div>

      {/* Skills needed */}
      <Card className="mb-4">
        <h2 className="font-bold text-ma-navy mb-3">Skills You&apos;ll Learn</h2>
        <div className="flex flex-wrap gap-2">
          {path.skills.map((skill) => (
            <Badge key={skill} variant="light-blue">{skill}</Badge>
          ))}
        </div>
      </Card>

      {/* Career progression */}
      <Card className="mb-4">
        <h2 className="font-bold text-ma-navy mb-3">Where This Path Can Take You</h2>
        <div className="space-y-3">
          {path.steppingStones[0].split(" → ").map((step, i, arr) => (
            <div key={step} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                i === 0 ? "bg-ma-teal/20 text-ma-navy" : "bg-ma-bg text-ma-text-light"
              }`}>
                {i + 1}
              </div>
              <div>
                <p className={`font-medium ${i === 0 ? "text-ma-navy" : "text-ma-text"}`}>{step}</p>
                {i === 0 && <p className="text-xs text-ma-teal">← You start here</p>}
              </div>
              {i < arr.length - 1 && (
                <div className="absolute left-[1.25rem] top-8 w-0.5 h-4 bg-ma-border" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Training programs */}
      <h2 className="text-lg font-bold text-ma-navy mb-3">Training Programs</h2>
      <div className="space-y-3 mb-6">
        {path.programs.map((program) => (
          <Card key={program.id} className={program.isFeatured ? "border-2 border-ma-teal" : ""}>
            {program.isFeatured && (
              <Badge variant="teal" className="mb-2">Featured</Badge>
            )}
            <h3 className="font-bold text-ma-navy mb-1">{program.name}</h3>
            <p className="text-sm text-ma-text-light mb-3">{program.provider}</p>
            <p className="text-sm text-ma-text mb-3">{program.description}</p>
            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div>
                <span className="text-ma-text-light">Duration: </span>
                <span className="font-medium">{program.duration}</span>
              </div>
              <div>
                <span className="text-ma-text-light">Cost: </span>
                <span className="font-medium">{program.cost}</span>
              </div>
              <div className="col-span-2">
                <span className="text-ma-text-light">Format: </span>
                <span className="font-medium">{program.format}</span>
              </div>
            </div>
            <a
              href={program.providerUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant={program.isFeatured ? "teal" : "secondary"} fullWidth size="sm">
                Learn More →
              </Button>
            </a>
          </Card>
        ))}
      </div>

      {/* AI Help CTA */}
      <Card className="bg-ma-navy text-white border-none">
        <h2 className="font-bold mb-2">Have Questions About This Career?</h2>
        <p className="text-sm text-white/80 mb-4">Our AI advisor can tell you more about what this job is really like, what training is best for you, and how to get started.</p>
        <Link href="/chat">
          <Button variant="teal" fullWidth>Ask the Career Advisor</Button>
        </Link>
      </Card>
    </div>
  );
}
