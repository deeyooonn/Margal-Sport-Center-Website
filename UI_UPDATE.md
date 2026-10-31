# UI update — 2026-10-31

This pass updates the landing page, header, menu, footer, and route layout. It uses the existing navy/red brand colors, a lightweight SVG court illustration, direct rate links, and a shorter page. The menu uses a native dialog with keyboard focus containment, Escape dismissal, and focus restoration. Light/dark themes remain available. Booking, events, profile, and authentication features retain their existing logic.

## Verification

- `npm run build` passed. Vite still reports its existing large-chunk warning; the main bundle decreased from approximately 634 KB to 620 KB before gzip.
- `node_modules/.bin/tsc --noEmit` passed.
- Chrome checks passed for the landing page at 320, 390, 768, 1024, and 1440 pixels, and the booking, events, profile, login, and signup pages at 320, 390, 768, and 1440 pixels, with no horizontal page overflow.
- Menu navigation, dialog focus, Escape/focus return, theme switching, and a local demo booking on an available future date passed. No uncaught browser exceptions were captured.
- Desktop and mobile screenshots were visually reviewed. Tests used Chrome emulation, not physical devices or Safari.

## Scope and next steps

No dependencies were added. Production Supabase authentication/database behavior was not exercised. The existing local demo booking mode was used for browser verification. The other application pages received shared navigation/footer changes but are not fully redesigned in this pass. Hosting configuration and production deployment remain separate work.
