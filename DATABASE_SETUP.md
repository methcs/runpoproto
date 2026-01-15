# Database Setup Guide - Vercel Postgres + Prisma

## ✅ Completed Steps:
- ✓ Installed Prisma and @vercel/postgres packages
- ✓ Created Prisma schema (races and registrations tables)
- ✓ Created API endpoints for registrations
- ✓ Created race sync endpoint
- ✓ Created CSV export endpoint

## 📋 Next Steps You Need To Do:

### Step 1: Connect to Vercel Postgres
1. Go to your Vercel Dashboard: https://vercel.com
2. Select your project: **runpocoaching**
3. Go to **Storage** tab
4. Click **Create Database** → Select **Postgres**
5. Name it: `runpo-coaching-db`
6. Copy the `POSTGRES_PRISMA_URL` connection string

### Step 2: Add Environment Variables
1. In Vercel Dashboard, go to **Settings** → **Environment Variables**
2. Add this variable:
   ```
   Name: DATABASE_URL
   Value: [Paste your POSTGRES_PRISMA_URL]
   ```
3. Also update your local `.env.local`:
   ```
   DATABASE_URL="[Your POSTGRES_PRISMA_URL]"
   ```

### Step 3: Run Database Migration
Run this command locally:
```bash
npx prisma migrate dev --name init
```

This will:
- Create the database tables
- Generate Prisma client

### Step 4: Generate Prisma Client
```bash
npx prisma generate
```

### Step 5: Deploy to Vercel
```bash
git add .
git commit -m "Add Prisma database setup"
git push
```

Verma will automatically run the migration on deploy.

## 🔧 How It Works Now:

### When a user registers:
1. User fills in Name, Surname, Email
2. Frontend calls `/api/registrations` endpoint
3. Registration is saved to PostgreSQL database
4. Confirmation message shown to user

### When admin wants to download Excel:
1. Admin logs in
2. Clicks "Katılımcıları Gör" (View Participants)
3. Data is fetched from database
4. Click "Excel İndir" generates CSV from database
5. File downloads with all registrations

### When a new race is created:
1. Race is added to initialRaces
2. A sync function automatically sends it to database
3. Database automatically tracks all registrations for that race

## 🚀 Database Tables Created:

### races table:
- id, externalId, title, date, location, distance, category, description, websiteUrl, registrationUrl, createdAt, updatedAt

### registrations table:
- id, raceId, name, surname, email, registrationDate, createdAt

Data is automatically linked between them!

## 📝 Questions?
If you need help with any step, let me know!
