"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { resourceCategories } from "@/lib/resources/resources-data";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function ResourceCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryId } = use(params);
  const router = useRouter();

  const category = resourceCategories.find((c) => c.id === categoryId);

  if (!category) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-ma-navy mb-4">Category Not Found</h1>
        <Button variant="teal" onClick={() => router.push("/resources")}>Back to Resources</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-ma-text-light hover:text-ma-navy mb-4 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to resources
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{category.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-ma-navy">{category.title}</h1>
          <p className="text-sm text-ma-text-light">{category.description}</p>
        </div>
      </div>

      <div className="space-y-3">
        {category.resources.map((resource) => (
          <Card key={resource.id}>
            <h2 className="font-bold text-ma-navy mb-1">{resource.name}</h2>
            <p className="text-sm text-ma-text mb-3">{resource.description}</p>
            <div className="flex flex-col gap-2">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="teal" size="sm" fullWidth>
                  Visit Website →
                </Button>
              </a>
              {resource.phone && (
                <a href={`tel:${resource.phone}`}>
                  <Button variant="secondary" size="sm" fullWidth>
                    📞 Call {resource.phone}
                  </Button>
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
