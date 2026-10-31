# Vercel deployment
Import `deeyooonn/Margal-Sport-Center-Website` and keep Root Directory at the repository root. The checked-in configuration selects Vite, `npm ci`, `npm run build`, and `dist`. Select Node.js 22.x. SPA rewrites support refreshing /book, /events, /profile, /login, and /signup.

No environment variables are needed for the portfolio demo. With Supabase variables absent, the existing application stores demo bookings locally. These are not real reservations. Production Supabase integration requires the variables in `.env.local.example`, database setup, and a separate authentication/data-access review.

After deployment, test a booking and refresh /book on a phone-sized screen. Copy the verified URL into the portfolio's `VITE_DEMO_MARGAL_URL` setting and redeploy the portfolio.

Reference: https://vercel.com/docs/frameworks/frontend/vite
