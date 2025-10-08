import { DynamicHomePage } from "@/components/DynamicHomePage";

// Keep the route static while rendering the full client experience
export const dynamic = "force-static";

export default function HomePage() {
  return <DynamicHomePage />;
}