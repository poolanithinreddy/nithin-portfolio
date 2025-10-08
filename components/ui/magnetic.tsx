"use client";

export function Magnetic({
  children,
  strength = 26,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  return (
    <span
      className="inline-block will-change-transform"
      onMouseMove={(e) => {
        const el = e.currentTarget as HTMLSpanElement;
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLSpanElement;
        el.style.transform = `translate(0px, 0px)`;
      }}
    >
      {children}
    </span>
  );
}
