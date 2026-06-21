# Rider Demo Workflow Audit

Date: 2026-06-21

## Demo Login Inventory

| Demo role | Button visible | Redirect target | Status before fixes |
|---|---:|---|---|
| Customer | Yes | `/customer` | Works |
| Driver | Yes | `/driver` | Works |
| Roadside Operator | Yes | `/roadside-operator` | Works |
| Fleet Manager | Yes | `/fleet-manager` | Works |
| Admin | No | `/admin` expected | Gap |

## Customer Workflow

| Step | Status before fixes | Notes |
|---|---|---|
| Splash once/session | Works | Uses role splash/session storage. |
| Home | Works | Carousel, greeting, service cards. |
| Dismiss notifications | Works | LocalStorage persistence. |
| Standard/Premium ride | Works | Opens booking with draft. |
| Tow/Roadside | Works | Opens roadside flow. |
| Search destination | Works | Address search present. |
| Drop pin | Works | Location picker present. |
| Current location | Works | Locate controls present; permission errors visible. |
| Payment selection | Works | Payment selector used in booking/profile. |
| Confirm ride | Works | Navigates tracking demo. |
| Tracking/rating | Partial | Demo state present; feedback needs audit. |
| History | Partial | Static demo list; empty state missing. |
| Addresses/payment methods | Incomplete | Add buttons dead before fixes. |
| Profile/payment/logout | Works | Shared profile editor. |

## Driver Workflow

| Step | Status before fixes | Notes |
|---|---|---|
| Splash once/session | Works | Role splash. |
| Go online/preflight | Works | Demo workflow state machine. |
| Receive/accept/reject offer | Works | Offer sheet. |
| Navigate to customer/destination | Works | External navigation button. |
| Mark en route/arrived/start/complete | Works | Primary action state machine. |
| Cash collection | Works | Cash sheet. |
| Rate customer | Works | Rating sheet. |
| Return available | Works | State machine. |
| Rides/earnings/vehicle/profile | Mostly | Vehicle/profile strong; list pages need empty/feedback polish. |
| Secondary call/cancel | Partial | Cancel works; call button needs feedback. |

## Roadside Operator Workflow

| Step | Status before fixes | Notes |
|---|---|---|
| Splash once/session | Works | Role splash. |
| Go online/offline | Works | Toggle. |
| Request appears | Works | Dashboard state. |
| Speed tier/guarantee | Partial | Customer/fleet pages show tier; operator dashboard should surface more clearly. |
| Accept/navigate/arrived | Works | Dashboard primary action and navigation. |
| Wait customer confirmation | Works | Pending state visible. |
| Start/solve/complete | Mostly | Demo confirm buttons exist; list Accept button needs feedback. |
| Dispute demo state | Partial | Customer roadside can dispute; operator handling mostly visual. |
| Vehicle/profile/logout | Works | Vehicle editor/profile exist. |

## Fleet Manager Workflow

| Step | Status before fixes | Notes |
|---|---|---|
| Splash once/session | Works | Role splash on home selector. |
| Home selector | Works | Transport/Roadside cards route correctly. |
| Transport dashboard/subroutes | Mostly | Separate route tree exists. |
| Roadside dashboard/subroutes | Mostly | Separate route tree exists. |
| Transport/Roadside not mixed | Works | Separate demo data/services/pages. |
| Drill-down buttons | Partial | Many buttons need demo feedback/navigation. |
| Profile/logout | Works | Shared profile editor. |

## Admin Workflow

| Step | Status before fixes | Notes |
|---|---|---|
| Demo login | Missing | No admin quick demo button found. |
| Dashboard | Works | Static metrics. |
| Users/vehicles/bookings/requests/settings | Partial | Routes map to generic static admin page. |
| Approvals | Partial | Page exists but action buttons static before fixes. |
| Logout | Works if logged in | Shell logout and profile redirect. |

## Highest Priority Demo Fixes

1. Add Demo Admin login.
2. Add visible feedback/state mutation to admin approvals.
3. Add visible feedback to static customer address/payment buttons.
4. Add visible feedback to fleet action buttons.
5. Add visible feedback to driver call and roadside request accept actions.
