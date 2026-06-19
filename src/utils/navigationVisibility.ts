import type { RoleNavItem } from "@/layouts/RoleShellFrame";

export function shouldHideOnMobileBecauseInBottomNav(actionPath: string, bottomNavItems: RoleNavItem[]) {
  return bottomNavItems.slice(0, 5).some((item) => normalizePath(item.to) === normalizePath(actionPath));
}

function normalizePath(path: string) {
  return path.replace(/\/+$/, "");
}
