# Rider Button and Action Audit

Date: 2026-06-21

Legend:
- Works: action already navigates, mutates visible state, opens a real sheet/modal, or performs the workflow.
- Needs feedback: action exists but does not clearly tell the user what happened.
- Dead before fixes: visible interactive control has no meaningful behavior or visible result.

## Global / Layout

| File | Label | Roles/screens | Expected action | Current action | Demo status | Feedback/a11y/mobile |
|---|---|---|---|---|---|---|
| `RoleShellFrame.tsx` | logo/header | desktop role shells | go home | navigates home | Works | Hidden on map-first mobile by design. |
| `RoleShellFrame.tsx` | notification icon | desktop role shells | open profile/notifications | navigates profile | Works | aria-label says notifications, destination is profile; copy mismatch. |
| `RoleShellFrame.tsx` | logout icon | desktop role shells | logout | logs out and navigates auth | Works | Hidden on map-first mobile; profile logout covers mobile. |
| `RoleShellFrame.tsx` | bottom nav items | all role shells mobile | navigate | nav links | Works | Bottom nav fixed; collision risk with sheets. |

## Auth

| File | Label | Expected action | Current action | Demo status |
|---|---|---|---|---|
| `AuthPage.tsx` | Demo Client | login as client | sets demo profile and redirects | Works |
| `AuthPage.tsx` | Demo Șofer | login as driver | sets demo profile and redirects | Works |
| `AuthPage.tsx` | Demo Roadside | login as roadside operator | sets demo profile and redirects | Works |
| `AuthPage.tsx` | Demo Fleet Manager | login as fleet manager | sets demo profile and redirects | Works |
| `AuthPage.tsx` | Demo Admin | login as admin | not present | Gap |
| `LoginForm.tsx` | Google / OTP | auth alternative | depends on Supabase | Needs feedback when unavailable |

## Customer

| File | Label | Expected action | Current action | Demo status |
|---|---|---|---|---|
| `CustomerNotificationCarousel.tsx` | action chips | navigate to action path | calls action path | Works |
| `CustomerNotificationCarousel.tsx` | X | dismiss notification | persists dismissed id | Works |
| `CustomerServiceChoices.tsx` | Standard/Premium | start booking | sets draft/navigates | Works |
| `CustomerServiceChoices.tsx` | Tractare/Asistență | start roadside | sets draft/navigates | Works |
| `CustomerHomeSearchBar.tsx` | search pill | open booking/dropoff | navigates booking | Works |
| `CurrentLocationMapWidget.tsx` | Folosește locația curentă | open booking | calls handler | Works |
| `RecentLocationList.tsx` | recent item | open booking with destination | calls handler | Works |
| `CustomerAddressesPage.tsx` | Adaugă | add address | no action before fixes | Dead before fixes |
| `CustomerPaymentMethodsPage.tsx` | Adaugă | add payment method | no action before fixes | Dead before fixes |
| `BookingPage.tsx` | staged CTAs | location/service/payment/review | mutates local draft and navigates tracking | Works |
| `RoadsidePage.tsx` | staged CTAs | submit request and confirmations | mutates demo state | Works |
| `TrackingPage.tsx` | rating/confirmation buttons | submit demo rating/confirm | visible local effects | Mostly works |

## Driver

| File | Label | Expected action | Current action | Demo status |
|---|---|---|---|---|
| `DriverOfflineSheet.tsx` | Go online | start preflight/workflow | mutates workflow | Works |
| `DriverPreflightPanel.tsx` | Ready/offline | advance or leave flow | mutates workflow | Works |
| `DriverOfferCard.tsx` | Accept/Reject | accept/reject offer | mutates workflow | Works |
| `DriverActiveRideSheet.tsx` | primary stage CTA | en route/arrived/start/complete | mutates workflow | Works |
| `DriverActiveRideSheet.tsx` | Sună | call customer | no visible action before fixes | Dead before fixes |
| `DriverActiveRideSheet.tsx` | Navighează | open external maps | opens navigation | Works |
| `DriverCashSheet.tsx` | Cash collected | advance workflow | mutates workflow | Works |
| `DriverRatingSheet.tsx` | Submit rating | finish workflow | mutates workflow | Works |
| `DriverPendingPage.tsx` | support/retry style buttons | contact support / refresh status | likely static before fixes | Needs feedback |

## Roadside Operator

| File | Label | Expected action | Current action | Demo status |
|---|---|---|---|---|
| `RoadsideOperatorDashboardPage.tsx` | Online/offline | toggle availability | mutates state | Works |
| `RoadsideOperatorDashboardPage.tsx` | primary stage CTA | accept/en route/arrived/start/solved | mutates state | Works |
| `RoadsideOperatorDashboardPage.tsx` | demo customer confirmed buttons | resolve pending demo state | mutates state | Works |
| `RoadsideRequestsPage.tsx` | Navighează | external maps | opens navigation | Works |
| `RoadsideRequestsPage.tsx` | Acceptă | accept request | no visible state before fixes | Dead before fixes |
| `RoadsideOperatorPendingPage.tsx` | support/retry style buttons | support/retry | likely static before fixes | Needs feedback |

## Fleet Manager

| File | Label | Expected action | Current action | Demo status |
|---|---|---|---|---|
| `FleetManagerHomePage.tsx` | Deschide Transport/Roadside | navigate to dashboard | links real routes | Works |
| `FleetSectionNav.tsx` | dashboard chip nav | navigate subroutes | nav links | Works |
| transport dashboard/buttons | Assign driver, View live ride, Maintenance, Approve | demo state or feedback | mostly static before fixes | Needs feedback |
| transport subpages | View driver, Assign driver, Mark maintenance | route/modal/state/feedback | mostly static before fixes | Needs feedback |
| roadside dashboard/buttons | Assign operator, View request, SLA, Escalate, Resolve | route/modal/state/feedback | mostly static before fixes | Needs feedback |
| roadside subpages | Contact/View/SLA actions | route/modal/state/feedback | mostly static before fixes | Needs feedback |

## Admin

| File | Label | Expected action | Current action | Demo status |
|---|---|---|---|---|
| `AdminPage.tsx` | metric cards | drill into admin areas | static cards before fixes | Needs route or feedback |
| `AdminApprovalsPage.tsx` | Aprobă contul | update visible status | no action before fixes | Dead before fixes |
| `AdminApprovalsPage.tsx` | Cere documente suplimentare | update visible status | no action before fixes | Dead before fixes |
| `AdminApprovalsPage.tsx` | Suspendă | update visible status | no action before fixes | Dead before fixes |
| `AdminApprovalsPage.tsx` | Respinge documentul | update visible status | no action before fixes | Dead before fixes |

## Manual Search Findings

No exact matches found for:
- `onClick={() => {}}`
- `onClick={() => undefined}`
- `console.log(`
- `href="#"`

However, many `<Button>` elements have no `onClick`, `asChild`, or `type="submit"` in page context and need explicit demo behavior or conversion to links.
