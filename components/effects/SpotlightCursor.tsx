"use client";

import { useEffect, useRef } from "react";

export function SpotlightCursor() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    const spotlight = spotlightRef.current;
    if (!spotlight) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      // Smooth follow with easing
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      
      currentX += dx * 0.15;
      currentY += dy * 0.15;

      spotlight.style.transform = `translate(${currentX}px, ${currentY}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={spotlightRef}
      className="pointer-events-none fixed -left-48 -top-48 z-[1] h-96 w-96 opacity-0 transition-opacity duration-500 hover:opacity-100"
      style={{
        background: "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
        mixBlendMode: "normal",
      }}
      aria-hidden="true"
    />
  );
}
