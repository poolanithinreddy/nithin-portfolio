#!/bin/bash

# Portfolio Environment Setup Helper Script
# This script helps you set up your environment variables interactively

echo "🚀 Portfolio Environment Setup"
echo "================================"
echo ""

# Check if .env.local already exists
if [ -f .env.local ]; then
    echo "⚠️  Warning: .env.local already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 1
    fi
fi

# Copy template
cp .env.local.template .env.local

echo "✅ Created .env.local from template"
echo ""

# Generate ADMIN_SECRET
echo "🔐 Generating ADMIN_SECRET..."
ADMIN_SECRET=$(openssl rand -base64 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
sed -i.bak "s|change-this-to-a-random-32-character-string|$ADMIN_SECRET|g" .env.local
rm .env.local.bak 2>/dev/null
echo "✅ Generated random ADMIN_SECRET"
echo ""

# Instructions
echo "📋 Next Steps:"
echo "================================"
echo ""
echo "1. Sign up for services:"
echo "   • Supabase: https://supabase.com (FREE)"
echo "   • Resend: https://resend.com (FREE tier available)"
echo ""
echo "2. Get your credentials:"
echo "   • Supabase → Settings → Database → Connection String"
echo "   • Supabase → Settings → API → Copy all keys"
echo "   • Supabase → Storage → Create bucket: portfolio-media"
echo "   • Resend → API Keys → Create new key"
echo ""
echo "3. Edit .env.local and fill in:"
echo "   • DATABASE_URL"
echo "   • RESEND_API_KEY"
echo "   • SUPABASE_SERVICE_ROLE_KEY"
echo "   • NEXT_PUBLIC_SUPABASE_URL"
echo "   • NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "4. Set up database:"
echo "   npm install"
echo "   npx prisma generate"
echo "   npx prisma db push"
echo ""
echo "5. Start development server:"
echo "   npm run dev"
echo ""
echo "📖 For detailed instructions, see ENV_SETUP_GUIDE.md"
echo ""
echo "✅ Setup template created! Now edit .env.local with your credentials."
