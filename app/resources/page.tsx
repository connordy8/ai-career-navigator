"use client";

import Link from "next/link";
import { resourceCategories } from "@/lib/resources/resources-data";
import { useUserProfile } from "@/lib/context/UserProfileContext";
import Card from "@/components/ui/Card";

export default function ResourcesPage() {
  const { trackResourceExplored } = useUserProfile();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-ma-navy mb-1">Support Resources</h1>
      <p className="text-ma-text-light text-sm mb-6">
        Getting ahead is easier when you have the right support. These free resources can help with everyday challenges.
      </p>

      {/* 211 callout */}
      <Card className="bg-ma-navy text-white border-none mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📞</span>
          <div>
            <h2 className="font-bold">Need help right now?</h2>
            <p className="text-sm text-white/80">
              Call or text <strong>211</strong> for free, confidential help 24/7. They connect you to local services for food, housing, healthcare, and more.
            </p>
          </div>
        </div>
      </Card>

      {/* Location note */}
      <div className="flex items-start gap-2 px-3 py-2.5 bg-ma-teal/5 border border-ma-teal/20 rounded-xl mb-4 text-xs text-ma-text">
        <span className="shrink-0 mt-px">📍</span>
        <p>
          Some resources below are specific to <strong>Massachusetts</strong>. If you&apos;re in a different state, call or text <strong>211</strong> to find similar programs near you.
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {resourceCategories.map((category) => (
          <Link
            key={category.id}
            href={`/resources/${category.id}`}
            onClick={() => trackResourceExplored(category.id)}
          >
            <Card hover className="mb-3">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{category.icon}</div>
                <div>
                  <h2 className="font-bold text-ma-navy">{category.title}</h2>
                  <p className="text-sm text-ma-text-light">{category.description}</p>
                  <p className="text-xs text-ma-teal mt-1">{category.resources.length} resources →</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
