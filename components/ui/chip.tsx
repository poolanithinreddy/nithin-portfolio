// components/ui/chip.tsx
export function Chip({ children }:{children:React.ReactNode}) {
  return (
    <span className="rounded-md border border-neutral-200/70 bg-white px-2 py-1 text-[11px] text-neutral-700 dark:border-white/10 dark:bg-[#0b0f14] dark:text-neutral-200">
      {children}
    </span>
  );
}

export function Pill({ children }:{children:React.ReactNode}) {
  return (
    <span className="rounded-full border border-neutral-200/70 bg-neutral-50 px-2.5 py-1 text-[11px] font-medium text-neutral-700 dark:border-white/10 dark:bg-[#0b0f14] dark:text-neutral-200">
      {children}
    </span>
  );
}
