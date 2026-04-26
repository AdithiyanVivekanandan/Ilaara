# Update - 26 Apr 2026

## Highlights
- Replaced checkout payment flow with WhatsApp order submission.
- Persisted order records in Supabase before redirecting to WhatsApp.
- Added secure developer dashboard route with `DEV_EMAIL` access control.
- Hardened admin/dev auth and request guards in `src/proxy.ts`.
- Added site-wide theme customization controls for primary, secondary, and tertiary palettes.
- Improved responsive admin layout and mobile-first `AdminLayout` rendering.
- Added utility CSS classes for brand colors and dark mode-compatible theming.

## Files changed
- `src/app/checkout/page.tsx`
- `src/app/api/checkout/route.ts`
- `src/app/admin/customize/page.tsx`
- `src/components/ThemeProvider.tsx`
- `src/app/globals.css`
- `src/proxy.ts`

## Notes
- Theme settings are now exposed through the admin customization panel and injected as CSS variables.
- WhatsApp order submission uses `CLIENT_WHATSAPP_NUMBER` from environment variables.
- Admin UI now includes color palette suggestions and live accent customization.
