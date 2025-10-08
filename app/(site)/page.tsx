// app/(site)/page.tsx
import dynamic from "next/dynamic";

const DynamicHomePage = dynamic(
  () => import("@/components/DynamicHomePage").then((m) => m.DynamicHomePage),
  { ssr: true }
);

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata = {
  title: "Nithin Reddy Poola — Software Engineer",
  description:
    "Full-stack engineer building resilient, measurable platforms with design-level polish.",
};

export default function HomePage() {
  return (
    // Reserve space for the sticky CTA only on mobile
    <div className="pb-[calc(env(safe-area-inset-bottom)+64px)] sm:pb-0 min-h-[100svh]">
      <DynamicHomePage />
    </div>
  );
}
