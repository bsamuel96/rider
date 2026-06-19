import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "@/layouts/AppShell";
import { AuthPage } from "@/pages/auth/AuthPage";
import { OnboardingPage } from "@/pages/auth/OnboardingPage";
import { AdminPage } from "@/pages/admin/AdminPage";
import { BookingPage } from "@/pages/booking/BookingPage";
import { TrackingPage } from "@/pages/booking/TrackingPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { DriverPage } from "@/pages/driver/DriverPage";
import { OperatorPage } from "@/pages/operator/OperatorPage";
import { ProfilePage } from "@/pages/profile/ProfilePage";
import { RoadsidePage } from "@/pages/roadside/RoadsidePage";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />
  },
  {
    path: "/onboarding",
    element: <OnboardingPage />
  },
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: "booking",
        element: <BookingPage />
      },
      {
        path: "tracking",
        element: <TrackingPage />
      },
      {
        path: "roadside",
        element: <RoadsidePage />
      },
      {
        path: "profile",
        element: <ProfilePage />
      },
      {
        path: "driver",
        element: <DriverPage />
      },
      {
        path: "operator",
        element: <OperatorPage />
      },
      {
        path: "admin",
        element: <AdminPage />
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);
