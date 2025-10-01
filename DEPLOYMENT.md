# 🚀 Deployment Guide - Pudding mit Gabel

This guide provides step-by-step instructions for deploying the Pudding mit Gabel application to production.

## Prerequisites

- [ ] PostgreSQL database (Vercel Postgres, Supabase, Railway, etc.)
- [ ] Azure Cognitive Services account (for Content Moderation)
- [ ] Git repository access
- [ ] Deployment platform account (Vercel recommended)

## 1. Database Setup

### Option A: Vercel Postgres (Recommended for Vercel deployments)

1. Go to your Vercel project
2. Navigate to Storage → Create Database
3. Select Postgres
4. Copy the connection string

### Option B: Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Project Settings → Database
4. Copy the connection string (use Pooler for better performance)

### Option C: Railway

1. Create account at [railway.app](https://railway.app)
2. New Project → Provision PostgreSQL
3. Copy the connection string

## 2. Azure Content Moderator Setup

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a Resource → AI + Machine Learning → Content Moderator
3. Select your subscription and resource group
4. Choose region and pricing tier (F0 is free tier)
5. After creation, go to Keys and Endpoint
6. Copy Key 1 and Endpoint URL

**Note:** For development, the app will work without Azure configuration (comments auto-approved).

## 3. Environment Variables

Set these environment variables in your deployment platform:

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-a-strong-random-string-here"

# Azure Content Moderator
AZURE_CONTENT_MODERATOR_KEY="your-azure-key-here"
AZURE_CONTENT_MODERATOR_ENDPOINT="https://your-region.api.cognitive.microsoft.com/"
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## 4. Vercel Deployment (Recommended)

### Via Vercel Dashboard

1. **Import Repository**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Select the repository

2. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

3. **Environment Variables**
   - Add all environment variables from section 3
   - Click "Deploy"

4. **Setup Database**
   ```bash
   # After first deployment, run these commands locally:
   npm install -g vercel
   vercel login
   vercel link
   
   # Pull production env variables
   vercel env pull .env.production
   
   # Run Prisma commands against production DB
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Verify Deployment**
   - Visit your deployment URL
   - Test registration and login
   - Create a test event

### Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 5. Other Platforms

### Netlify

1. Connect your repository
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add environment variables
4. Deploy
5. Run Prisma migrations manually via CLI

### Railway

1. New Project → Deploy from GitHub
2. Select repository
3. Add environment variables
4. Add PostgreSQL plugin
5. Deploy
6. Run Prisma migrations in Railway CLI

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t puddingmitgabel .
docker run -p 3000:3000 --env-file .env puddingmitgabel
```

## 6. Post-Deployment Steps

### 1. Initialize Database

```bash
# Connect to your database and run:
npx prisma db push
npx prisma db seed
```

This creates:
- Admin user: `admin@puddingmitgabel.de` / `admin123`
- Organizer user: `organizer@puddingmitgabel.de` / `organizer123`
- Sample event

**⚠️ IMPORTANT: Change these default passwords immediately!**

### 2. Create Your Admin Account

Instead of using the seeded admin, create your own:

1. Register normally at `/auth/register`
2. Connect to your database
3. Run this SQL:
   ```sql
   UPDATE "User" SET role = 'ADMIN', "isOrganizer" = true 
   WHERE email = 'your-email@example.com';
   ```

### 3. Test Everything

- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] Login works
- [ ] Event creation works
- [ ] CMS dashboard accessible
- [ ] Event approval works (as admin)
- [ ] Comment posting works
- [ ] Comments appear after approval

## 7. Monitoring & Maintenance

### Database Management

Use Prisma Studio to view and manage data:
```bash
npx prisma studio
```

### Logs

- **Vercel**: Dashboard → Logs
- **Railway**: Project → Deployments → Logs
- **Netlify**: Site → Functions

### Backups

Set up regular database backups:
- **Vercel Postgres**: Automatic backups included
- **Supabase**: Configure in Dashboard → Database → Backups
- **Railway**: Manual backups via CLI

## 8. Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Database Connection Issues

- Check connection string format
- Ensure `?sslmode=require` for secure connections
- Verify database is running and accessible
- Check firewall rules

### Authentication Issues

- Verify `NEXTAUTH_URL` matches your domain (including https://)
- Ensure `NEXTAUTH_SECRET` is set
- Check browser cookies are enabled

### Content Moderation Not Working

- Verify Azure credentials are correct
- Check Azure subscription is active
- Review Azure service quotas
- App works without Azure (auto-approves comments)

## 9. Security Checklist

- [ ] Changed default admin password
- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] Database uses SSL connection
- [ ] Environment variables are not in source code
- [ ] `.env` files are in `.gitignore`
- [ ] CORS configured correctly (Next.js handles this)
- [ ] Rate limiting considered (add if needed)

## 10. Performance Optimization

### Enable Prisma Connection Pooling

Add to DATABASE_URL:
```
?connection_limit=10&pool_timeout=20
```

### Enable Next.js Caching

Already configured in the app, but ensure:
- Static pages are cached
- API routes use appropriate cache headers
- Images are optimized

### CDN Setup

Vercel automatically provides CDN. For other platforms:
- Configure Cloudflare
- Use platform's CDN features

## 11. Scaling

### Database

- Monitor connection pool usage
- Consider read replicas for high traffic
- Enable query logging and optimize slow queries

### Application

- Vercel automatically scales
- For other platforms, configure auto-scaling
- Monitor response times and error rates

## Support

For issues:
1. Check logs first
2. Review this deployment guide
3. Check the main README.md
4. Create an issue on GitHub

---

**Happy Deploying! 🥄🍮**
