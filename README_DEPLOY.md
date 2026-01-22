## Vercel production deploy (safe migrations)

This project is set up so that Prisma migrations are applied only during deploy when you explicitly enable them on Vercel. Follow these steps to deploy safely without touching production data accidentally.

1) Make sure migration files are committed
- On your development machine create migrations (locally):
  - `npx prisma migrate dev --name descriptive_name --create-only`
  - Inspect `prisma/migrations/<timestamp>_descriptive_name/migration.sql`
  - Commit and push changes

2) Configure Vercel environment variables
- In your Vercel project settings add the following environment variables for the Production environment:
  - `DATABASE_URL` – your production Postgres connection string
  - `JWT_SECRET` – JWT secret used for auth
  - `ADMIN_PASSWORD` – admin password
  - `APPLY_MIGRATIONS_ON_DEPLOY` = `1` (enable migrations during deploy)

3) Build command
- The repo `package.json` uses this build command:
  - `node scripts/deploy-migrations.js && prisma generate && next build`
- The `deploy-migrations.js` script only runs `npx prisma migrate deploy` when `APPLY_MIGRATIONS_ON_DEPLOY` is set and when in production/VERCEL.

4) Deploy
- Push your changes to GitHub. Vercel will build, run the migration deploy step (only if enabled), and then build the app.

5) Notes & safety
- If you prefer to trigger migrations manually, leave `APPLY_MIGRATIONS_ON_DEPLOY` unset and use the admin endpoint `/api/admin/ensure-db` (protected with `ADMIN_PASSWORD`) after verifying the migration SQL.
- Keep migration files in Git — they are the source of truth.
- Always backup production data if you plan destructive changes.

If you want, I can add a GitHub Action that runs `prisma migrate status` with your production `DATABASE_URL` after deploy to verify migrations applied successfully.