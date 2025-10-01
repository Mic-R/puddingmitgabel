#!/bin/bash

# Pudding mit Gabel - Setup Script
# This script helps you get started quickly

set -e

echo "🥄 Pudding mit Gabel - Setup Script"
echo "===================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping .env creation"
    else
        cp .env.example .env
        echo "✅ .env file created from template"
    fi
else
    cp .env.example .env
    echo "✅ .env file created from template"
fi

echo ""
echo "📝 Please configure your .env file with:"
echo "   - DATABASE_URL (PostgreSQL connection string)"
echo "   - NEXTAUTH_SECRET (run: openssl rand -base64 32)"
echo "   - Azure credentials (optional for development)"
echo ""
read -p "Press Enter when you've configured .env..."

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️  Setting up database..."
echo "   Generating Prisma Client..."
npx prisma generate

echo "   Pushing database schema..."
npx prisma db push

echo "   Seeding database..."
npx prisma db seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the development server, run:"
echo "   npm run dev"
echo ""
echo "📚 Default credentials:"
echo "   Admin: admin@puddingmitgabel.de / admin123"
echo "   Organizer: organizer@puddingmitgabel.de / organizer123"
echo ""
echo "⚠️  Remember to change these passwords in production!"
echo ""
echo "Happy coding! 🥄🍮"
