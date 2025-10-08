"use client";

import Script from "next/script";

const plausibleSrc = "https://plausible.io/js/script.tagged-events.js";

export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) {
    return null;
  }

  return (
    <Script
      defer
      data-domain={domain}
      src={plausibleSrc}
      strategy="afterInteractive"
    />
  );
}
