"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface TimelineItem {
  year: string;
  title: string;
  company?: string;
  description: string;
  tech?: string[];
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-a via-accent-b to-accent-c opacity-20" />

      <div className="space-y-12">
        {items.map((item, index) => (
          <TimelineItemComponent key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

function TimelineItemComponent({ item, index }: { item: TimelineItem; index: number }) {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-12"
    >
      {/* Timeline Dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
        className="absolute left-0 w-8 h-8 rounded-full bg-gradient-to-br from-accent-a to-accent-b flex items-center justify-center shadow-glow"
      >
        <div className="w-3 h-3 rounded-full bg-background" />
      </motion.div>

      <div className="surface-card p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="pill-accent text-xs font-bold">{item.year}</span>
          {item.company && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm font-medium text-muted-foreground">{item.company}</span>
            </>
          )}
        </div>
        
        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
        <p className="text-muted-foreground leading-relaxed mb-4">{item.description}</p>

        {item.tech && item.tech.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tech.map((tech) => (
              <span key={tech} className="pill text-xs">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface SkillCategory {
  category: string;
  skills: { name: string; level: number }[];
}

interface SkillsMatrixProps {
  categories: SkillCategory[];
}

export function SkillsMatrix({ categories }: SkillsMatrixProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {categories.map((category, catIndex) => (
        <SkillCategoryComponent key={catIndex} category={category} index={catIndex} />
      ))}
    </div>
  );
}

function SkillCategoryComponent({ category, index }: { category: SkillCategory; index: number }) {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="surface-card p-6"
    >
      <h3 className="text-lg font-bold mb-4 text-gradient">{category.category}</h3>
      <div className="space-y-4">
        {category.skills.map((skill, skillIndex) => (
          <div key={skillIndex}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{skill.name}</span>
              <span className="text-xs text-muted-foreground">{skill.level}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: `${skill.level}%` } : {}}
                transition={{ duration: 1, delay: index * 0.1 + skillIndex * 0.05, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-accent-a to-accent-b rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

interface StatCardProps {
  value: string;
  label: string;
  icon?: string;
}

export function StatCard({ value, label, icon }: StatCardProps) {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="surface-card p-6 text-center hover:shadow-glow transition-all duration-300"
    >
      {icon && <div className="text-4xl mb-3">{icon}</div>}
      <div className="text-3xl font-bold text-gradient mb-2">{value}</div>
      <div className="text-sm text-muted-foreground uppercase tracking-wider">{label}</div>
    </motion.div>
  );
}
