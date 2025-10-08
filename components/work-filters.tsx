"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "All Projects" },
  { id: "web", label: "Web Apps" },
  { id: "mobile", label: "Mobile" },
  { id: "ai", label: "AI/ML" },
  { id: "infra", label: "Infrastructure" },
];

export function WorkFilters() {
  const [selected, setSelected] = useState("all");

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setSelected(category.id)}
          className={cn(
            "pill transition-all duration-200",
            selected === category.id
              ? "pill-accent"
              : "hover:border-accent/30"
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
