# Vercel deployment
Import `deeyooonn/Margal-Sport-Center-Website` and keep Root Directory at the repository root. The checked-in configuration selects Vite, `npm ci`, `npm run build`, and `dist`. Select Node.js 22.x. SPA rewrites support refreshing /book, /events, /profile, /login, and /signup.

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` using the intended active Supabase project. These are compiled into the Vite bundle: redeploy after changes. Never use a service-role key in browser variables. At the 2026-11-03 audit, both production variables were absent.

Enable email/password authentication. Set Supabase Auth's Site URL to `https://margal-sports.vercel.app` and allow intended confirmation-return URLs on that origin. Verify existing `profiles` and `bookings` tables, the new-user profile trigger and row-level policies. Users must not grant themselves administrator roles, and availability reads must not expose other customers' private details.

Without service configuration, registration, sign-in and online reservations are unavailable. Public pages remain accessible. There is no local booking substitute.

Auth regression checks run with `node --test`. They cover initial-session failure, profile failure, repeated auth events, and late responses after sign-out using a controlled backend boundary. Set `CHROME_PATH` for a non-default Chrome installation. Run `npm run build` and `node node_modules/typescript/bin/tsc --noEmit` before release. These checks do not establish live Supabase authentication or persistence.

After deployment, test a booking and refresh /book on a phone-sized screen. Copy the verified URL into the portfolio's `VITE_DEMO_MARGAL_URL` setting and redeploy the portfolio.

Reference: https://vercel.com/docs/frameworks/frontend/vite
