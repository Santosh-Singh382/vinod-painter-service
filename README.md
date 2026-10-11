# Vinod Painter Service

A premium, responsive React + Vite website for Vinod Painter Service, serving Barira, Terhagachh, Kishanganj, Bihar.

## Features
- Responsive landing page with premium forest-green and lime design
- Hindi-first bilingual interface with Hindi / English language toggle
- House interior/exterior painting and art/decorative painting services
- Project inspiration gallery (replace these illustrative images with real work photos)
- Enquiry form with WhatsApp handoff
- Floating WhatsApp contact shortcut
- Mobile navigation, accessible form labels, reduced-motion support
- SEO title and meta description

## Requirements
- Node.js 18+ (Node.js 20+ recommended)
- npm

## Run locally
```bash
npm install
cp .env.example .env
npm run dev
```
Open the local URL printed by Vite.

## Important: configure the real contact number
Open `.env` and replace the placeholder with the business's actual WhatsApp number in international format, digits only. For India, include country code `91` and then the mobile number, with no `+`, spaces, or dashes.

```env
VITE_WHATSAPP_NUMBER=91XXXXXXXXXX
VITE_PHONE_NUMBER=+91 XXXXX XXXXX
VITE_EMAIL=hello@example.com
```
- `VITE_WHATSAPP_NUMBER` is required for the WhatsApp buttons and enquiry form to open a direct chat.
- `VITE_PHONE_NUMBER` is optional; when set, it is shown as a contact detail.
- `VITE_EMAIL` is reserved for a future email contact feature.
- Never put private API keys or secrets in `VITE_*` variables; Vite exposes them to the browser.

Restart `npm run dev` after editing `.env`.

### If the WhatsApp number isn't configured
Buttons take visitors to the contact section, and the form displays a setup message instead of sending the enquiry. This is intentional to avoid sending enquiries to a fake number.

## Production build
```bash
npm run build
npm run preview
```
The production site is generated in `dist/`.

## Deploy
You can deploy the project to Vercel, Netlify, or any static host that supports Vite. Use `npm run build` as the build command and `dist` as the output directory. Add the same environment variables in the hosting dashboard before deploying.

## Before going live
1. Add the correct WhatsApp/mobile number to `.env` or your host's environment settings.
2. Replace the illustrative Unsplash gallery/hero photos with photos of actual completed jobs, with customer permission.
3. Verify the service area wording and spelling.
4. Test the WhatsApp enquiry flow on mobile.
5. Deploy and share the website URL with customers.

## Tech stack
React 18, Vite 6, plain CSS, Lucide React icons, Unsplash remote images, WhatsApp click-to-chat.
