"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

export function ScrollReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useScrollReveal(0.1);
  
  return (
    <div ref={ref} className={`scroll-reveal ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
