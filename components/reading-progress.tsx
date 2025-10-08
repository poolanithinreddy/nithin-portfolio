"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-a via-accent-b to-accent-c origin-left z-50"
      style={{ scaleX }}
    />
  );
}

export function ReadingProgressCircular() {
  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <div className="relative w-12 h-12">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-surface-2 stroke-current"
            strokeWidth="8"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
          <motion.circle
            className="text-accent-a stroke-current"
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
            style={{
              pathLength: scaleProgress,
            }}
            strokeDasharray="251.2"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-xs font-bold"
            style={{
              opacity: useSpring(scrollYProgress, {
                stiffness: 100,
                damping: 30,
              }),
            }}
          >
            <motion.span
              style={{
                opacity: scaleProgress,
              }}
            >
              {Math.round((scrollYProgress.get() || 0) * 100)}%
            </motion.span>
          </motion.span>
        </div>
      </div>
    </div>
  );
}
