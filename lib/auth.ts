import bcrypt from "bcryptjs";
import type { AuthOptions, Session, User } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import { getServerSession } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

const adminEmail = process.env.ADMIN_EMAIL;
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

if (!adminEmail || !adminPasswordHash) {
  console.warn("ADMIN_EMAIL and ADMIN_PASSWORD_HASH must be set for admin login to function.");
}

if (!authSecret) {
  console.warn("AUTH_SECRET or NEXTAUTH_SECRET must be set for NextAuth to encrypt sessions.");
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
