# Rider Mobile Overlap Audit

Date: 2026-06-21

This audit is textual. It is based on route/component inspection and known fixed/floating offsets. Browser screenshots were not captured before fixes.

## Viewports To Recheck After Fixes

Mobile:
- 320px
- 360px
- 375px
- 390px
- 414px
- 430px
- 768px

Desktop:
- 1024px
- 1280px
- 1440px

## Global Findings Before Fixes

- `--bottom-nav-height` exists, but `--mobile-sheet-gap`, `--safe-bottom`, `--safe-top`, and `--floating-bottom-offset` are missing.
- Multiple bottom sheets/floating panels use different hardcoded offsets.
- `MobileBottomSheet` uses `bottom-[calc(5.25rem+env(safe-area-inset-bottom))]` instead of a shared CSS variable.
- `RoleShellFrame` bottom nav uses fixed bottom positioning and safe-area padding.
- Map-first mobile screens hide desktop header, so logout depends on bottom nav/profile access.

## Critical Screens

| Screen | Mobile risk | Current notes | Priority |
|---|---|---|---|
| Customer booking | Bottom sheet/nav collision | Staged sheets use `MobileBottomSheet`; offset must align with nav. | High |
| Customer roadside | Bottom sheet/nav collision | Uses `bottom-[calc(env(safe-area-inset-bottom)+5.25rem)]`; should use shared variable. | High |
| Customer tracking | Bottom panel/nav collision | Uses same `5.25rem` style offset. | High |
| Driver dashboard | Active ride sheet/nav collision | Uses `5.5rem`; generally clears nav but not shared. | High |
| Driver ride detail | Active ride sheet/nav collision | Uses `5.5rem`; should align with shared variable. | High |
| Roadside operator dashboard | Very high collision risk | Uses `16.5rem` offsets for mobile panels/cash panel; may hide too much map or collide on 320px. | High |
| Location picker | Confirm panel/nav collision | Uses `5.25rem`; full-screen modal should either hide nav or use shared offset. | Medium |
| Profile save bar | Save bar/nav collision | Uses `5.75rem`; likely safe, should align with variable. | Medium |
| Fleet manager pages | Low overlap risk | Mostly normal document flow with bottom padding from shell. | Low |
| Admin pages | Low overlap risk | Normal document flow with bottom padding from shell. | Low |

## Width Notes

| Width | Expected risk before fixes |
|---|---|
| 320 | Highest risk: long labels, bottom sheets, roadside operator panels, map controls. |
| 360 | High risk for map-first stacked panels. |
| 375 | Common iPhone width; staged booking likely OK, roadside operator still risky. |
| 390 | Moderate risk; check bottom nav and sheet gap. |
| 414 | Moderate risk; check text clipping in fleet/admin cards. |
| 430 | Lower risk; still verify fixed panels. |
| 768 | Tablet transition; check mobile/desktop breakpoint behavior. |
| 1024 | Desktop shell appears; check map side panels. |
| 1280 | Expected stable. |
| 1440 | Expected stable; check overly wide panels. |

## Fix Requirements

- Define shared safe-area variables globally.
- Use `var(--floating-bottom-offset)` for mobile bottom sheets/floating panels.
- Avoid `16.5rem` mobile offsets unless explicitly required and documented.
- Ensure map controls do not sit on top of active fields or CTAs.
- Ensure bottom nav remains accessible and never covered.
- Ensure active input/autocomplete lists can scroll above the bottom nav.
