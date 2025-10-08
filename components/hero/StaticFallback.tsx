"use client";

import { motion } from "framer-motion";

export function StaticFallback() {
  return (
    <motion.svg
      role="img"
      aria-label="CyberSphere systems diagram"
      viewBox="0 0 600 600"
      className="h-full w-full text-neutral-800"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <defs>
        <radialGradient id="sphereGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(45, 212, 191, 0.45)" />
          <stop offset="35%" stopColor="rgba(56, 189, 248, 0.2)" />
          <stop offset="100%" stopColor="rgba(15, 23, 42, 0.05)" />
        </radialGradient>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern
          id="circuit"
          x="0"
          y="0"
          width="0.1"
          height="0.1"
          patternUnits="objectBoundingBox"
          patternTransform="rotate(12)"
        >
          <path
            d="M0 0 L10 0 L10 10"
            fill="none"
            stroke="rgba(79, 70, 229, 0.28)"
            strokeWidth="0.5"
          />
          <circle cx="10" cy="10" r="1.5" fill="rgba(79, 70, 229, 0.4)" />
        </pattern>
      </defs>

      <motion.circle
        cx="300"
        cy="300"
        r="200"
        fill="url(#sphereGradient)"
        stroke="rgba(59, 130, 246, 0.55)"
        strokeWidth="1.5"
        filter="url(#softGlow)"
        style={{ mixBlendMode: "screen" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      <circle
        cx="300"
        cy="300"
        r="180"
        fill="none"
        stroke="rgba(148, 163, 184, 0.4)"
        strokeWidth="1"
      />

      {["UI", "API", "Workers", "vCenter"].map((label, index) => {
        const angle = (index / 4) * Math.PI * 2 - Math.PI / 2;
        const x = 300 + Math.cos(angle) * 120;
        const y = 300 + Math.sin(angle) * 120;
        return (
          <g key={label}>
            <motion.rect
              x={x - 42}
              y={y - 18}
              width="84"
              height="36"
              rx="10"
              ry="10"
              fill="rgba(15, 23, 42, 0.78)"
              stroke="rgba(94, 234, 212, 0.45)"
              strokeWidth="1.2"
              animate={{
                opacity: [0.85, 1, 0.85],
                scale: [0.98, 1.02, 0.98],
              }}
              transition={{ duration: 5, repeat: Infinity, delay: index * 0.6 }}
            />
            <text
              x={x}
              y={y + 4}
              textAnchor="middle"
              fontSize="14"
              fontWeight={600}
              fill="rgba(226, 232, 240, 0.9)"
              style={{ letterSpacing: "0.12em", textTransform: "uppercase" }}
            >
              {label}
            </text>
          </g>
        );
      })}

      <motion.circle
        cx="300"
        cy="300"
        r="148"
        fill="none"
        stroke="rgba(59, 130, 246, 0.35)"
        strokeWidth="1"
        strokeDasharray="8 8"
        animate={{ rotate: -360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />

      <circle cx="300" cy="300" r="120" fill="url(#circuit)" opacity="0.55" />

      <motion.circle
        cx="300"
        cy="300"
        r="4"
        fill="rgba(226, 232, 240, 0.9)"
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
    </motion.svg>
  );
}
