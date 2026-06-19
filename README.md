# Rider

Rider este o bază React + Supabase pentru mobilitate urbană și asistență rutieră. Include fluxuri pentru client, șofer, operator roadside și admin, plus hartă OpenStreetMap/Leaflet, Nominatim autocomplete, dark/light/system theme, PWA și structură Supabase.

## Stack

- React, TypeScript, Vite
- React Router, TanStack Query, Zustand
- TailwindCSS, componente locale în stil shadcn/ui
- React Hook Form, Zod
- Supabase Auth, Database, Realtime, Storage-ready, Edge Functions
- OpenStreetMap, Nominatim, Leaflet

## Rulare locală

```bash
npm install
npm run dev
```

Copiază `.env.example` în `.env` și completează `VITE_SUPABASE_URL` și `VITE_SUPABASE_ANON_KEY` când legi proiectul la Supabase. Fără aceste valori, aplicația rulează în modul demo local.

## Rute

- `/auth` autentificare email/parolă, Google OAuth și OTP SMS
- `/onboarding` profil și adrese favorite
- `/` dashboard client
- `/booking` comandă cursă sau serviciu premium/tractare
- `/roadside` intervenție rutieră
- `/tracking` tracking realtime
- `/driver` spațiu șofer
- `/operator` dispecerat roadside
- `/admin` panou administrare

## Supabase

Structura cerută este în `supabase/`:

- `migrations/001_users.sql` ... `008_rls.sql`
- `seed/users.sql`, `vehicles.sql`, `settings.sql`
- `functions/assign-driver`, `calculate-price`, `send-notification`, `roadside-dispatch`
- `types/database.types.ts`
