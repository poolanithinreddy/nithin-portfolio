import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "3rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
    extend: {
      // 8-pt Spacing Scale
      spacing: {
        0.5: "2px",
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
        16: "64px",
        20: "80px",
        24: "96px",
        32: "128px",
        40: "160px",
        48: "192px",
      },
      // Typography Scale (SF Pro Display / Inter)
      fontFamily: {
        sans: ["var(--font-inter)", "SF Pro Display", "-apple-system", "BlinkMacSystemFont", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-geist-mono)", "SF Mono", "Menlo", ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.01em" }],
        sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.005em" }],
        base: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0" }],
        lg: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "-0.005em" }],
        xl: ["1.25rem", { lineHeight: "1.875rem", letterSpacing: "-0.01em" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.015em" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.02em" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.025em" }],
        "5xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "6xl": ["3.75rem", { lineHeight: "1.05", letterSpacing: "-0.035em" }],
        "7xl": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.04em" }],
        display: ["5rem", { lineHeight: "1", letterSpacing: "-0.045em", fontWeight: "700" }],
      },
      // Premium Color System
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          a: "hsl(var(--accent-a))",
          b: "hsl(var(--accent-b))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      borderRadius: {
        none: "0",
        sm: "0.375rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        full: "9999px",
      },
      // Premium Shadow System
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        sm: "0 2px 8px -2px rgb(0 0 0 / 0.08), 0 1px 4px -1px rgb(0 0 0 / 0.06)",
        DEFAULT: "0 4px 16px -4px rgb(0 0 0 / 0.1), 0 2px 8px -2px rgb(0 0 0 / 0.08)",
        md: "0 8px 24px -6px rgb(0 0 0 / 0.12), 0 4px 12px -2px rgb(0 0 0 / 0.08)",
        lg: "0 16px 48px -12px rgb(0 0 0 / 0.18), 0 8px 24px -4px rgb(0 0 0 / 0.12)",
        xl: "0 24px 64px -16px rgb(0 0 0 / 0.22), 0 12px 32px -6px rgb(0 0 0 / 0.16)",
        "2xl": "0 32px 96px -24px rgb(0 0 0 / 0.28), 0 16px 48px -8px rgb(0 0 0 / 0.2)",
        glow: "0 0 32px -8px hsl(var(--accent-a) / 0.5), 0 0 16px -4px hsl(var(--accent-b) / 0.4)",
        "glow-lg": "0 0 48px -12px hsl(var(--accent-a) / 0.6), 0 0 24px -6px hsl(var(--accent-b) / 0.5)",
        inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
      },
      // Motion & Animation
      transitionDuration: {
        DEFAULT: "200ms",
        fast: "120ms",
        slow: "300ms",
        slower: "400ms",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
        smooth: "cubic-bezier(0.33, 1, 0.68, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s cubic-bezier(0.33, 1, 0.68, 1)",
        "slide-down": "slideDown 0.4s cubic-bezier(0.33, 1, 0.68, 1)",
        "scale-in": "scaleIn 0.2s cubic-bezier(0.33, 1, 0.68, 1)",
        shimmer: "shimmer 2s linear infinite",
        float: "float 6s ease-in-out infinite",
        glow: "glow 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "grid-dark": "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
        "grid-light": "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)",
        "shimmer": "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
      },
      backgroundSize: {
        "grid": "32px 32px",
      },
      maxWidth: {
        prose: "72ch",
        container: "1280px",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "40px",
      },
      typography: ({
        theme,
      }: {
        theme: (path: string) => string;
      }) => ({
        DEFAULT: {
          css: {
            color: "hsl(var(--foreground))",
            a: {
              color: "hsl(var(--primary))",
              textDecoration: "none",
              fontWeight: theme("fontWeight.medium"),
              '&:hover': {
                color: "hsl(var(--primary-foreground))",
                textDecoration: "underline",
              },
            },
            "h1, h2, h3, h4": {
              color: "hsl(var(--foreground))",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            },
            code: {
              backgroundColor: "hsl(var(--muted))",
              color: "hsl(var(--muted-foreground))",
              borderRadius: theme("borderRadius.sm"),
              padding: "0.125rem 0.375rem",
            },
            blockquote: {
              borderLeftColor: "hsl(var(--primary))",
              color: "hsl(var(--muted-foreground))",
            },
          },
        },
        invert: {
          css: {
            color: "hsl(var(--foreground))",
            blockquote: {
              borderLeftColor: "hsl(var(--primary))",
              color: "hsl(var(--muted-foreground))",
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
export default config;
