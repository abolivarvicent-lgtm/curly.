# Curl Diary — PWA

A wash-day journal for curly hair, built as an installable web app (PWA).
No app-store fees, no review process — people visit a link and can add it
to their home screen like a real app.

## Get it live (free, ~10 minutes)

1. **Create a free [Vercel](https://vercel.com) account** (sign in with GitHub is easiest).
2. **Put this project on GitHub**: create a new repo and push this folder to it.
   (Or, on Vercel, choose "Add New Project" → drag-and-drop this whole
   folder — no GitHub required for a quick test.)
3. **Import the repo in Vercel** and click Deploy. It auto-detects Vite —
   no config needed.
4. You'll get a live URL like `curl-diary.vercel.app`. That's it — live on
   the internet, free.
5. Optional: buy a domain (~£8–12/year from somewhere like Namecheap or
   Cloudflare) and point it at the Vercel project for a proper `.com`.

## Installing it like an app

Once it's live, open the URL on a phone:
- **iPhone (Safari)**: Share button → "Add to Home Screen"
- **Android (Chrome)**: menu (⋮) → "Install app" / "Add to Home Screen"

It'll open full-screen with its own icon, no browser bar — indistinguishable
from a "real" app to most people.

## Important limitation right now: local storage only

This build saves data with the browser's `localStorage`, which means:
- Entries stay **on that one device/browser** — no accounts, no syncing
  between phone and laptop.
- Clearing browser data/cache wipes the diary.
- This is fine for testing the idea and getting real feedback.

**When you're ready for real accounts** (people sign up, log in anywhere,
data is safe even if they lose their phone), swap `src/storage.js` for a
real backend. [Supabase](https://supabase.com) is the easiest free option —
it gives you auth + a database with a generous free tier, and the change is
mostly confined to that one file since everything else calls
`storage.get/set/delete`.

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## What's in here

- `src/App.jsx` — the whole app (onboarding, daily log, diary, profile)
- `src/storage.js` — the persistence layer (swap this for a real backend later)
- `public/manifest.json` + `public/sw.js` — what makes it installable/offline
- `public/icon-*.png` — app icons
