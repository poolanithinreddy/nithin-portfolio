"use client";

import React, { useRef, useState, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  ripple?: boolean;
}

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  ripple = true,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (ripple && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      
      setRipples((prev) => [...prev, { x, y, id }]);
      
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    }
    
    props.onClick?.(e);
  };

  return (
    <button
      ref={buttonRef}
      className={cn(
        "relative overflow-hidden rounded-lg px-6 py-3 font-medium",
        "bg-accent text-accent-foreground",
        "transition-all duration-200 ease-smooth",
        "hover:shadow-glow hover:scale-105 active:scale-95",
        "focus-ring",
        className
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      {...props}
    >
      {/* Ripple Effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none animate-ping rounded-full bg-white/30"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10,
          }}
        />
      ))}
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
