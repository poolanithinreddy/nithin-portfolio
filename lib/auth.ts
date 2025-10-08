import bcrypt from "bcryptjs";
import type { AuthOptions, Session, User } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import { getServerSession } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

function normalizeEnvValue(value?: string) {
  if (!value) return undefined;
  const trimmed = value.trim();
  // Remove wrapping single or double quotes that may be accidentally included
  // when copying values into hosting provider dashboards.
  return trimmed.replace(/^['"]+|['"]+$/g, "");
}

const adminEmail = normalizeEnvValue(process.env.ADMIN_EMAIL);
const adminPasswordHash = normalizeEnvValue(process.env.ADMIN_PASSWORD_HASH);

const rawAuthSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
const normalizedAuthSecret = normalizeEnvValue(rawAuthSecret);
const isAuthSecretConfigured = Boolean(normalizedAuthSecret);
const authSecret =
  normalizedAuthSecret ??
  // Provide a deterministic fallback so local builds do not fail even if the secret isn't configured.
  // This must be overridden in production via environment variables.
  "fallback-nextauth-secret-change-me";

if (!adminEmail || !adminPasswordHash) {
  console.warn("ADMIN_EMAIL and ADMIN_PASSWORD_HASH must be set for admin login to function.");
}

if (!isAuthSecretConfigured) {
  const guidance = "AUTH_SECRET or NEXTAUTH_SECRET must be configured to sign NextAuth JWTs.";
  if (process.env.NODE_ENV === "production") {
    throw new Error(`${guidance} Update your deployment environment to include a 32+ character random secret (no quotes).`);
  }
  console.warn(`${guidance} Using a fallback secret for local development only.`);
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: authSecret,
  providers: [
    Credentials({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !adminEmail || !adminPasswordHash) {
          return null;
        }

        const emailMatches = credentials.email.trim().toLowerCase() === adminEmail.trim().toLowerCase();
        if (!emailMatches) {
          return null;
        }

        const passwordValid = await bcrypt.compare(credentials.password, adminPasswordHash);
        if (!passwordValid) {
          return null;
        }

        return {
          id: "admin",
          email: adminEmail,
          name: "Admin",
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | AdapterUser | null }) {
      const tokenWithEmail = token as JWT & { email?: string | null };
      const candidate = user as (User | AdapterUser | null) | undefined;
      if (candidate?.email) {
        tokenWithEmail.email = candidate.email;
      }
      return tokenWithEmail;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      const tokenWithEmail = token as JWT & { email?: string | null };
      if (tokenWithEmail.email) {
        session.user = {
          ...session.user,
          email: tokenWithEmail.email,
        };
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};

export function getServerAuthSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}
