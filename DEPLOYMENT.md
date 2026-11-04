# Vercel deployment
Import `deeyooonn/Margal-Sport-Center-Website` and keep Root Directory at the repository root. The checked-in configuration selects Vite, `npm ci`, `npm run build`, and `dist`. Select Node.js 22.x. SPA rewrites support refreshing /book, /events, /profile, /login, and /signup.

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` using the intended active Supabase project. These are compiled into the Vite bundle: redeploy after changes. Never use a service-role key in browser variables. Production and preview variables were configured on 2026-11-03.

The original Margal project `veqfvhvxzpqskvquqjza` remains inactive and untouched: Supabase rejected restoration because the account already has two active free projects. Margal now shares the restored Client Scrapper project `wmqsqvupaaodvcvekryg`, using separate `profiles`, `bookings` and `booking_slots` tables. Previous Margal accounts and bookings have not been migrated. New accounts receive an ordinary user profile; administrator privileges require an explicit operator change.

`supabase/migrations/001_accounts_and_reservations.sql` has been applied. It enforces ownership, protects roles, computes rates on the server, prevents overlapping hourly reservations with a unique constraint, and exposes availability through `get_booked_slots` without disclosing other customers' contact information. The LeadHunter leads table remains accessible only to the server role.

Enable email/password authentication. Set Supabase Auth's Site URL to `https://margal-sports.vercel.app` and allow intended confirmation-return URLs on that origin. Verify existing `profiles` and `bookings` tables, the new-user profile trigger and row-level policies. Users must not grant themselves administrator roles, and availability reads must not expose other customers' private details.

Email/password and new signups are enabled. At the user's explicit request, email confirmation is disabled so signup creates an immediate session without a custom SMTP sender. Password-reset and email-change delivery still need a custom sender for reliable public use.

The user explicitly approved temporary production integration accounts and bookings. All nine checks passed through public signup, password login and actual database APIs: automatic ordinary profiles, protected roles, server-side pricing, private bookings, sanitized availability, overlap rejection, ownership on cancellation, slot reuse after cancellation, and anonymous access restrictions. Temporary accounts/bookings were deleted, and read-only counts confirmed no temporary users, reservations or slots remain. These checks do not establish the admin interface's unrelated editing actions.

Without service configuration, registration, sign-in and online reservations are unavailable. Public pages remain accessible. There is no local booking substitute.

Auth regression checks run with `node --test`. They cover initial-session failure, profile failure, repeated auth events, and late responses after sign-out using a controlled backend boundary. Set `CHROME_PATH` for a non-default Chrome installation. Run `npm run build` and `node node_modules/typescript/bin/tsc --noEmit` before release. These checks do not establish live Supabase authentication or persistence.

After deployment, test a booking and refresh /book on a phone-sized screen. Copy the verified URL into the portfolio's `VITE_DEMO_MARGAL_URL` setting and redeploy the portfolio.

Reference: https://vercel.com/docs/frameworks/frontend/vite
