# ⚡ Quick Start Guide

Get Pudding mit Gabel running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or use a free cloud database)

## Step 1: Clone & Install

```bash
git clone https://github.com/Mic-R/puddingmitgabel.git
cd puddingmitgabel
npm install
```

## Step 2: Database Setup

### Option A: Local PostgreSQL

```bash
# Install PostgreSQL (if not already installed)
# macOS: brew install postgresql
# Ubuntu: sudo apt install postgresql

# Create database
createdb puddingmitgabel

# Set DATABASE_URL in .env
echo 'DATABASE_URL="postgresql://localhost:5432/puddingmitgabel"' > .env
```

### Option B: Free Cloud Database (Supabase)

1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project
3. Go to Settings → Database → Connection string
4. Copy the connection string
5. Create `.env` file:

```bash
cat > .env << EOF
DATABASE_URL="your-supabase-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
EOF
```

## Step 3: Initialize Database

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

This creates sample users:
- **Admin**: admin@puddingmitgabel.de / admin123
- **Organizer**: organizer@puddingmitgabel.de / organizer123

## Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Step 5: Test the App

1. **View Homepage**: http://localhost:3000
2. **Login as Admin**: 
   - Email: admin@puddingmitgabel.de
   - Password: admin123
3. **Access CMS**: http://localhost:3000/cms
4. **Create Event**: http://localhost:3000/events/create
5. **Approve Events**: Go to CMS → Pending Events

## Next Steps

- Change the default admin password!
- Create your own user account
- Read the full [README.md](README.md)
- Check out [DEPLOYMENT.md](DEPLOYMENT.md) for production setup

## Troubleshooting

### Database Connection Error

```bash
# Check if PostgreSQL is running
pg_isready

# Verify your DATABASE_URL
echo $DATABASE_URL
```

### Port Already in Use

```bash
# Run on different port
PORT=3001 npm run dev
```

### Prisma Errors

```bash
# Reset and regenerate
rm -rf node_modules/.prisma
npx prisma generate
```

## Common Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm start                  # Start production server

# Database
npx prisma studio          # Open database GUI
npx prisma db push         # Push schema changes
npx prisma generate        # Generate Prisma Client

# Maintenance
npm install                # Install dependencies
npm update                 # Update dependencies
```

## Need Help?

- Check the [README.md](README.md) for detailed documentation
- See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- Create an issue on GitHub

---

**Happy coding! 🥄🍮**
