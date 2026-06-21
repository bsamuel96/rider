import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { ToastViewport } from "@/components/ui/toast";
import { queryClient } from "@/app/query-client";
import { router } from "@/routes/router";
import { useTheme } from "@/hooks/useTheme";

export function Providers() {
  useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard>
        <RouterProvider router={router} />
      </AuthGuard>
      <ToastViewport />
    </QueryClientProvider>
  );
}
