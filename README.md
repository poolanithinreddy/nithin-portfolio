## Nithin Reddy Poola — Portfolio

Production-grade portfolio with full-stack admin CMS, Next.js 14 App Router, Prisma + Supabase Postgres, NextAuth authentication, and Supabase Storage media management.

### Stack

- **Framework**: Next.js 14 (App Router, TypeScript strict mode, server components)
- **Database**: Prisma ORM + Supabase Postgres (posts, projects, user data)
- **Authentication**: NextAuth v4 with credentials provider + bcrypt password hashing
- **Storage**: Supabase Storage with signed upload URLs for media management
- **Styling**: Tailwind CSS with custom design system and dark mode support
- **Content**: Prisma-backed posts/projects with markdown rendering (ReactMarkdown) + legacy Contentlayer MDX fallback
- **Email**: Resend API with rate-limited contact endpoint
- **Forms**: React Hook Form + Zod validation in admin CMS
- **Tooling**: ESLint, TypeScript strict mode, Prisma migrations

### Key Features

- 🔐 **Admin Dashboard**: NextAuth-protected admin panel at \`/admin\` with posts, projects, and media management
- 📝 **Content Management**: Create/edit posts and projects with rich forms, slug generation, and real-time validation
- 🖼️ **Media Library**: Upload images to Supabase Storage, browse library, copy CDN URLs for posts/projects
- 🎨 **Dynamic Rendering**: Homepage pulls featured projects and latest posts from Postgres
- 📱 **Responsive Design**: Mobile-first UI with Apple-inspired aesthetics and GitHub-level clarity
- 🌙 **Dark Mode**: Complete theme support with \`next-themes\` integration

## Getting started

### 1. Install dependencies

\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

### 2. Set up environment variables

Copy \`.env.example\` to \`.env.local\` and configure:

\`\`\`bash
cp .env.example .env.local
\`\`\`

#### Required Environment Variables

| Name | Required | Description |
| ---- | -------- | ----------- |
| \`DATABASE_URL\` | **Yes** | PostgreSQL connection string. Format: \`postgresql://user:password@host:5432/db?schema=public\` |
| \`AUTH_SECRET\` or \`NEXTAUTH_SECRET\` | **Yes** | NextAuth session encryption secret. Generate with \`openssl rand -base64 32\`. |
| \`ADMIN_EMAIL\` | **Yes** | Admin login email address. |
| \`ADMIN_PASSWORD_HASH\` | **Yes** | Bcrypt hash of admin password. Generate with \`npx tsx scripts/hash-password.ts\`. |

#### Optional: Supabase Storage

| Name | Description |
| ---- | ----------- |
| \`NEXT_PUBLIC_SUPABASE_URL\` | Supabase project URL. Required for media uploads. |
| \`NEXT_PUBLIC_SUPABASE_ANON_KEY\` | Supabase anon public key. |
| \`SUPABASE_SERVICE_ROLE_KEY\` | Supabase service role key (server-side only). Required for signed uploads. |
| \`SUPABASE_STORAGE_BUCKET\` | Storage bucket name (default: \`portfolio-media\`). |

#### Optional: Email & Analytics

| Name | Description |
| ---- | ----------- |
| \`RESEND_API_KEY\` | Resend API key for contact form. |
| \`RESEND_FROM\` | From address (default: \`Portfolio Contact <onboarding@resend.dev>\`). |
| \`CONTACT_INBOX\` | Destination email (default: \`nithinreddypoola@gmail.com\`). |
| \`NEXT_PUBLIC_PLAUSIBLE_DOMAIN\` | Plausible Analytics domain. |

### 3. Generate admin password hash

\`\`\`bash
npx tsx scripts/hash-password.ts
\`\`\`

Add the generated hash to \`.env.local\` as \`ADMIN_PASSWORD_HASH\`.

### 4. Initialize the database

\`\`\`bash
npx prisma generate
npx prisma migrate dev --name init
\`\`\`

### 5. Start development server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)  
Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Admin CMS

Authenticate at \`/login\` to access:

- **/admin/posts** - Create/edit posts with markdown, cover images, publish toggles
- **/admin/projects** - Manage projects with tech stack, gallery, featured flags
- **/admin/media** - Upload to Supabase Storage and copy public URLs

## Commands

| Command | Description |
| ------- | ----------- |
| \`npm run dev\` | Start dev server |
| \`npm run build\` | Production build |
| \`npm run lint\` | Run ESLint |
| \`npm run typecheck\` | TypeScript check |
| \`npx tsx scripts/hash-password.ts\` | Generate admin password hash |
| \`npx prisma studio\` | Visual database editor |

## Deployment

Deploy to Vercel with these settings:

- Build: \`npm run build\`
- Install: \`npm install --legacy-peer-deps\`
- Node: 18.x or 20.x
- Add all environment variables

## License

MIT © Nithin Reddy Poola
