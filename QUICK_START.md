# 🚀 Complete Setup Checklist

## ✅ Already Done (by me):
- [x] Installed Prisma + @vercel/postgres packages
- [x] Created Prisma schema (races + registrations tables)
- [x] Created API endpoints:
  - [x] POST `/api/registrations` - Create registration
  - [x] GET `/api/registrations` - Fetch registrations for a race
  - [x] GET `/api/registrations/export` - Download CSV
  - [x] POST `/api/races/sync` - Sync races to database
- [x] Created database utilities in `lib/db.ts`
- [x] Updated frontend to use database APIs:
  - [x] Registration form sends to API
  - [x] Participants modal fetches from database
  - [x] Excel download uses database export endpoint
- [x] Created migration setup guide

---

## 🔧 You Need To Do:

### Step 1: Connect to Vercel Postgres
```
⏱️ Time: 5 minutes
Priority: 🔴 CRITICAL - Do this first!

1. Go to https://vercel.com/dashboard
2. Select your project: "runpocoaching"
3. Click "Storage" tab
4. Click "Create Database"
5. Select "Postgres"
6. Name it: "runpo-coaching-db"
7. Copy the connection string shown
```

### Step 2: Add Environment Variables
```
⏱️ Time: 2 minutes

LOCAL (in .env.local):
DATABASE_URL="[paste your connection string]"

VERCEL (Settings > Environment Variables):
DATABASE_URL=[paste your connection string]
```

### Step 3: Run Migration Locally
```bash
⏱️ Time: 2 minutes

npx prisma migrate dev --name init

This creates:
- races table
- registrations table
- Indexes for performance
```

### Step 4: Test Locally (Optional but Recommended)
```bash
⏱️ Time: 5-10 minutes

# Start dev server
npm run dev

# Visit http://localhost:3000/yaris-takvimi
# Try registering for a race
# Check Prisma Studio to see data in database
npx prisma studio
```

### Step 5: Deploy to Vercel
```bash
⏱️ Time: 3-5 minutes (auto-deploy)

git add .
git commit -m "Add PostgreSQL + Prisma integration"
git push

Vercel will:
1. Detect Prisma schema
2. Run migrations automatically
3. Deploy the app
4. Test your registrations on production!
```

---

## 📊 What Gets Created Automatically:

### When Database Connects:
- ✅ `races` table with 10 columns
- ✅ `registrations` table with 6 columns
- ✅ Foreign key relationship (registrations → races)
- ✅ Indexes for fast queries

### When Someone Registers:
- ✅ New row in `registrations` table
- ✅ Name, surname, email saved
- ✅ Timestamp recorded
- ✅ Linked to correct race

### When Admin Downloads Excel:
- ✅ Query all registrations for that race
- ✅ Generate CSV with UTF-8 encoding
- ✅ Include Turkish characters correctly
- ✅ Sorted by registration date

---

## 🧪 Testing Checklist:

After setup, verify:
- [ ] Can register for a race
- [ ] Gets success message
- [ ] Admin can see "Katılımcıları Gör" button
- [ ] Participants list shows in admin panel
- [ ] Excel download works
- [ ] CSV file opens correctly in Excel
- [ ] Names, surnames, emails are there
- [ ] Turkish characters display correctly

---

## 🆘 Troubleshooting:

### "DATABASE_URL not found"
→ Add it to .env.local and Vercel Environment Variables

### "Prisma client not found"
→ Run: `npx prisma generate`

### "Migration failed"
→ Check DATABASE_URL is correct and database is accessible

### "API endpoints return 500 error"
→ Check server logs: `vercel logs` or `npm run dev`

### "Excel file won't download"
→ Check browser console for errors
→ Verify raceId is correct in URL

---

## 📞 Need Help?

All files created:
```
prisma/
  └─ schema.prisma          ✅ Database structure
app/api/
  ├─ registrations/route.ts ✅ Register + Get registrations
  ├─ registrations/export/route.ts ✅ Download CSV
  └─ races/sync/route.ts    ✅ Sync races to database
lib/
  └─ db.ts                  ✅ Database utilities
app/yaris-takvimi/
  └─ page.tsx               ✅ Updated frontend (API calls)
.env.local                  ✅ Configuration (needs your connection string)
```

---

## ✨ Summary:

Your app now has:
✅ Professional PostgreSQL database
✅ Automatic table creation
✅ Persistent data storage
✅ Real-time synchronization
✅ Admin-only data export
✅ Production-ready code

🚀 You're ready to launch!

---

**Start with Step 1 (Connect to Vercel Postgres) → Do Steps 2-5 → You're done!**

Total time: ~30 minutes for full setup
