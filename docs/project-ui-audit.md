# Rider Project UI Audit

Date: 2026-06-21

## Inspection Scope

Inspected source areas:
- `package.json`, `.env.example`
- `src/routes/router.tsx`
- `src/layouts/*`
- `src/pages/*`
- `src/components/*`
- `src/store/useAppStore.ts`
- `src/types/domain.ts`
- `src/styles/globals.css`
- `supabase/migrations/*` inventory by presence, not applied

Build stack:
- React 18 + Vite
- React Router
- Zustand local/demo state
- Supabase client
- Tailwind CSS
- Leaflet / React Leaflet

## Role Inventory

| Role | Auth role | Shell | Demo login | Current status |
|---|---|---|---|---|
| Customer | `client` | `CustomerShell` | Yes | Broad flow exists; booking/roadside are staged; small placeholder actions remain. |
| Driver | `driver` | `DriverShell` | Yes | Demo workflow exists; some secondary actions need visible feedback. |
| Roadside operator | `roadside_operator` | `RoadsideOperatorShell` | Yes | Demo workflow exists; confirmation waits are represented; some dashboard buttons are simulated only. |
| Fleet manager | `fleet_manager` | `FleetManagerShell` | Yes | Separate transport/roadside route trees exist; drill-down/action buttons need feedback. |
| Admin | `admin` | `AdminShell` | No visible quick demo button found in `AuthPage` | Admin pages exist; approval actions are static before fixes. |

## Route Matrix

| Route | Role allowed | Page | Shell | Mobile bottom nav | Main CTA | Demo complete | Notes |
|---|---|---|---|---|---|---|---|
| `/auth`, `/auth/login`, `/auth/register` | public | `AuthPage` | none | no | login/register/demo buttons | Partial | Customer/driver/roadside/fleet demos exist; admin demo not visible. |
| `/auth/forgot-password` | public | `ForgotPasswordPage` | none | no | reset submit | Partial | Needs loading/success feedback audit. |
| `/onboarding` | public/auth | `OnboardingPage` | none | no | onboarding submit | Partial | Multi-step form exists. |
| `/` | any | `RoleBasedRedirect` | none | no | redirect | Complete | Uses profile role. |
| `/customer` | client | `CustomerHomePage` | `CustomerShell` | yes | service/search actions | Mostly | Splash, carousel, service cards, search exist. |
| `/customer/booking` | client | `BookingPage` | `CustomerShell` | yes | staged booking confirm | Mostly | Mobile staged; map-first offsets need consistency. |
| `/customer/booking/dropoff` | client | `BookingPage` | `CustomerShell` | yes | staged booking confirm | Mostly | Same as booking. |
| `/customer/roadside` | client | `RoadsidePage` | `CustomerShell` | yes | submit roadside | Mostly | Multi-step flow exists; safety/speed/confirm present. |
| `/customer/tracking`, `/customer/tracking/:id` | client | `TrackingPage` | `CustomerShell` | yes | rating/confirmation actions | Partial | Tracking panel exists; some actions are local/demo. |
| `/customer/profile` | client | `ProfilePage` | `CustomerShell` | yes | save/logout | Mostly | Editable profile and mobile logout exist. |
| `/customer/history` | client | `CustomerHistoryPage` | `CustomerShell` | yes | none | Partial | Demo list exists; needs empty state pattern. |
| `/customer/addresses` | client | `CustomerAddressesPage` | `CustomerShell` | yes | `Adaugă` | Incomplete | Add button has no action before fixes. |
| `/customer/payment-methods` | client | `CustomerPaymentMethodsPage` | `CustomerShell` | yes | `Adaugă` | Incomplete | Add button has no action before fixes. |
| `/driver` | driver | `DriverPage` | `DriverShell` | yes | workflow stage CTA | Mostly | Full demo state machine; secondary call feedback missing. |
| `/driver/rides` | driver | `DriverRidesPage` | `DriverShell` | yes | view ride | Mostly | Demo list present. |
| `/driver/ride/:id` | driver | `DriverRideDetailPage` | `DriverShell` | yes | workflow/map actions | Mostly | Map-first detail exists. |
| `/driver/earnings` | driver | `DriverEarningsPage` | `DriverShell` | yes | none | Partial | Demo ledger exists; empty state needed. |
| `/driver/vehicle` | driver | `DriverVehiclePage` | `DriverShell` | yes | save vehicle | Mostly | Editor exists. |
| `/driver/documents` | driver | `DriverDocumentsPage` | `DriverShell` | yes | upload docs | Partial | Needs feedback/empty/error audit. |
| `/driver/profile` | driver | `ProfilePage` | `DriverShell` | yes | save/logout | Mostly | Profile editor shared. |
| `/driver/pending` | driver | `DriverPendingPage` | `DriverShell` | yes | static buttons | Incomplete | Buttons appear feedback-less before fixes. |
| `/roadside-operator` | roadside_operator | `RoadsideOperatorDashboardPage` | `RoadsideOperatorShell` | yes | accept/advance request | Mostly | Demo flow exists; hardcoded bottom offsets risky. |
| `/roadside-operator/requests`, `/roadside-operator/request/:id` | roadside_operator | `RoadsideRequestsPage` | `RoadsideOperatorShell` | yes | navigate/accept | Partial | Accept button needs visible state. |
| `/roadside-operator/fleet` | roadside_operator | `RoadsideFleetPage` | `RoadsideOperatorShell` | yes | none | Partial | Informational page. |
| `/roadside-operator/vehicles` | roadside_operator | `RoadsideVehiclesPage` | `RoadsideOperatorShell` | yes | save vehicle | Mostly | Editor exists. |
| `/roadside-operator/documents` | roadside_operator | `RoadsideDocumentsPage` | `RoadsideOperatorShell` | yes | upload docs | Partial | Needs feedback/empty/error audit. |
| `/roadside-operator/profile` | roadside_operator | `ProfilePage` | `RoadsideOperatorShell` | yes | save/logout | Mostly | Profile editor shared. |
| `/roadside-operator/pending` | roadside_operator | `RoadsideOperatorPendingPage` | `RoadsideOperatorShell` | yes | static buttons | Incomplete | Buttons appear feedback-less before fixes. |
| `/fleet-manager` | fleet_manager | `FleetManagerHomePage` | `FleetManagerShell` | yes | open transport/roadside | Mostly | Selector page only. |
| `/fleet-manager/transport` | fleet_manager transport/both | `TransportFleetDashboardPage` | `FleetManagerShell` | yes | assign/approve/maintenance | Partial | Dashboard exists; action buttons need feedback. |
| `/fleet-manager/transport/vehicles` | fleet_manager transport/both | `TransportVehiclesPage` | `FleetManagerShell` | yes | maintenance | Partial | Needs demo state/feedback. |
| `/fleet-manager/transport/drivers` | fleet_manager transport/both | `TransportDriversPage` | `FleetManagerShell` | yes | view driver | Partial | Needs meaningful feedback/navigation. |
| `/fleet-manager/transport/rides` | fleet_manager transport/both | `TransportRidesPage` | `FleetManagerShell` | yes | assign driver | Partial | Needs demo state/feedback. |
| `/fleet-manager/transport/earnings` | fleet_manager transport/both | `TransportEarningsPage` | `FleetManagerShell` | yes | none | Mostly | Read-only analytics acceptable if no dead CTAs. |
| `/fleet-manager/transport/analytics` | fleet_manager transport/both | `TransportAnalyticsPage` | `FleetManagerShell` | yes | none | Mostly | Read-only analytics acceptable. |
| `/fleet-manager/roadside` | fleet_manager roadside/both | `RoadsideFleetDashboardPage` | `FleetManagerShell` | yes | escalate/resolve | Partial | Needs demo state/feedback. |
| `/fleet-manager/roadside/vehicles` | fleet_manager roadside/both | `RoadsideVehiclesPage` | `FleetManagerShell` | yes | none | Mostly | Read-only list. |
| `/fleet-manager/roadside/operators` | fleet_manager roadside/both | `RoadsideOperatorsPage` | `FleetManagerShell` | yes | contact | Partial | Needs feedback. |
| `/fleet-manager/roadside/requests` | fleet_manager roadside/both | `RoadsideRequestsPage` | `FleetManagerShell` | yes | view request | Partial | Needs detail feedback. |
| `/fleet-manager/roadside/fast-requests` | fleet_manager roadside/both | `RoadsideFastSlaPage` | `FleetManagerShell` | yes | view guarantee | Partial | Needs feedback/navigation. |
| `/fleet-manager/roadside/earnings` | fleet_manager roadside/both | `RoadsideEarningsPage` | `FleetManagerShell` | yes | none | Mostly | Read-only analytics acceptable. |
| `/fleet-manager/roadside/analytics` | fleet_manager roadside/both | `RoadsideAnalyticsPage` | `FleetManagerShell` | yes | none | Mostly | Read-only analytics acceptable. |
| `/fleet-manager/profile` | fleet_manager | `ProfilePage` | `FleetManagerShell` | yes | save/logout | Mostly | Profile role tile exists. |
| `/admin` and admin subroutes | admin | `AdminPage` / `AdminApprovalsPage` | `AdminShell` | yes | approval/settings actions | Partial | Static admin actions need demo mutations/feedback. |
| `/booking`, `/roadside`, `/tracking`, `/operator`, `/fleet`, `/profile` | redirect | `Navigate` / `ProfileRedirect` | none | no | redirect | Complete | Legacy redirects exist. |

## Button / Workflow Findings

Priority issues found before fixes:
- `CustomerAddressesPage`: `Adaugă` button has no `onClick` or destination.
- `CustomerPaymentMethodsPage`: `Adaugă` button has no `onClick` or destination.
- `AdminApprovalsPage`: approve/request docs/suspend/reject buttons have no visible state mutation.
- `AdminPage`: cards are static, but admin nav maps many management routes to same static dashboard.
- Fleet manager dashboard/action buttons such as Assign, View, Maintenance, Contact, Escalate, Resolve are mostly static before fixes.
- Driver active ride `Sună` button has no visible action before fixes.
- Roadside operator request `Acceptă` button in request list has no visible state before fixes.
- Pending pages contain static support/retry-style buttons before fixes.
- No global toast/feedback system found.

## Mobile / Map Layout Risks

- Global CSS has `--bottom-nav-height` but not all requested safe-area variables.
- Multiple map screens use hardcoded offsets such as `bottom-[calc(env(safe-area-inset-bottom)+16.5rem)]`, `5.25rem`, `5.5rem`.
- `MobileBottomSheet` uses its own fixed offset instead of a shared variable.
- `RoadsidePage`, `BookingPage`, `TrackingPage`, `DriverPage`, `DriverRideDetailPage`, and `RoadsideOperatorDashboardPage` are highest-risk map-first screens.
- Profile save bar and location picker confirm panel use bottom offsets that should align with nav height.

## Accessibility Findings

- Many icon buttons have aria labels, but audit should verify all after fixes.
- Static buttons without actions are accessibility and UX dead ends.
- Shared button component has focus-visible styles but lacks active/pressed feedback before fixes.
- Some small mobile labels are 11px in bottom nav; acceptable but should remain readable.

## Recommendations by Priority

1. Add lightweight feedback/toast system and wire all silent demo buttons.
2. Standardize mobile safe-area variables and bottom offsets.
3. Ensure map-first screens keep logout reachable through profile/bottom nav.
4. Add empty states for simple list screens.
5. Improve button active state and selected/pressed feedback globally.
6. Add CSS-only page transition wrapper if low risk.
