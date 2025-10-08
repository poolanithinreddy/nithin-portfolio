"use client";

import { Timeline, SkillsMatrix } from "@/components/timeline";

interface TimelineItem {
  year: string;
  title: string;
  company?: string;
  description: string;
  tech?: string[];
}

interface SkillCategory {
  category: string;
  skills: {
    name: string;
    level: number;
  }[];
}

interface AboutClientComponentsProps {
  timelineData: TimelineItem[];
  skillsData: SkillCategory[];
}

export function AboutClientComponents({ timelineData, skillsData }: AboutClientComponentsProps) {
  return (
    <>
      <section className="mb-24">
        <h2 className="text-4xl lg:text-5xl font-black mb-10 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          Professional Journey
        </h2>
        <Timeline items={timelineData} />
      </section>

      <section className="mb-24">
        <h2 className="text-4xl lg:text-5xl font-black mb-10 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          Technical Skills
        </h2>
        <SkillsMatrix categories={skillsData} />
      </section>
    </>
  );
}