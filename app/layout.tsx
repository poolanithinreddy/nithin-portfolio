import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import { constructMetadata } from "@/lib/seo";
import { Analytics } from "@/components/Analytics";
import { Providers } from "@/components/providers";
import { Navigation } from "@/components/navigation";
import { SkipToContent, RouteAnnouncer } from "@/components/accessibility";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'light';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        <Providers>
          <SkipToContent />
          <RouteAnnouncer />
          <Navigation />
          <main id="main-content">
            {children}
          </main>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
