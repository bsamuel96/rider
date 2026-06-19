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

## Rute și portaluri

- `/auth`, `/auth/login`, `/auth/register`, `/auth/forgot-password`
- `/onboarding` profil și adrese favorite
- `/customer`, `/customer/booking`, `/customer/roadside`, `/customer/tracking/:id`, `/customer/profile`
- `/driver`, `/driver/rides`, `/driver/earnings`, `/driver/vehicle`, `/driver/documents`, `/driver/pending`
- `/roadside-operator`, `/roadside-operator/requests`, `/roadside-operator/fleet`, `/roadside-operator/vehicles`, `/roadside-operator/documents`, `/roadside-operator/pending`
- `/admin`, `/admin/users`, `/admin/drivers`, `/admin/roadside-operators`, `/admin/approvals`, `/admin/settings`

Legacy redirects:

- `/booking` -> `/customer/booking`
- `/roadside` -> `/customer/roadside`
- `/operator` -> `/roadside-operator`
- `/profile` -> profilul portalului curent

## Supabase

Structura cerută este în `supabase/`:

- `migrations/001_users.sql` ... `013_role_based_rls.sql`
- `seed/users.sql`, `vehicles.sql`, `settings.sql`
- `functions/assign-driver`, `calculate-price`, `send-notification`, `roadside-dispatch`
- `types/database.types.ts`

Migrațiile `009`-`013` adaugă auth pe roluri, `driver_profiles`, `roadside_operator_profiles`, documente, audit login, storage buckets și RLS dedicat.

## Configurare Supabase

1. Rulează migrațiile din `supabase/migrations`.
2. Creează bucketurile `user-documents` și `vehicle-images` dacă nu folosești migrația `012`.
3. Configurează Supabase Auth Email/Password.
4. Configurează Google OAuth doar dacă vrei butonul Google activ în producție.
5. Creează adminul manual în Supabase sau printr-un seed securizat.
6. Completează `.env` pe baza `.env.example`.
