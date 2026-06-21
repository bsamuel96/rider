import { createBrowserRouter, Navigate } from "react-router-dom";
import { FleetScopeGuard } from "@/components/auth/FleetScopeGuard";
import { ProfileRedirect } from "@/components/auth/ProfileRedirect";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleBasedRedirect } from "@/components/auth/RoleBasedRedirect";
import { AdminShell } from "@/layouts/AdminShell";
import { CustomerShell } from "@/layouts/CustomerShell";
import { DriverShell } from "@/layouts/DriverShell";
import { FleetManagerShell } from "@/layouts/FleetManagerShell";
import { RoadsideOperatorShell } from "@/layouts/RoadsideOperatorShell";
import { AdminApprovalsPage } from "@/pages/admin/AdminApprovalsPage";
import { AdminPage } from "@/pages/admin/AdminPage";
import { AuthPage } from "@/pages/auth/AuthPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { OnboardingPage } from "@/pages/auth/OnboardingPage";
import { BookingPage } from "@/pages/booking/BookingPage";
import { TrackingPage } from "@/pages/booking/TrackingPage";
import { CustomerAddressesPage } from "@/pages/customer/CustomerAddressesPage";
import { CustomerHomePage } from "@/pages/customer/CustomerHomePage";
import { CustomerHistoryPage } from "@/pages/customer/CustomerHistoryPage";
import { CustomerPaymentMethodsPage } from "@/pages/customer/CustomerPaymentMethodsPage";
import { DriverDocumentsPage } from "@/pages/driver/DriverDocumentsPage";
import { DriverEarningsPage } from "@/pages/driver/DriverEarningsPage";
import { DriverPage } from "@/pages/driver/DriverPage";
import { DriverPendingPage } from "@/pages/driver/DriverPendingPage";
import { DriverRideDetailPage } from "@/pages/driver/DriverRideDetailPage";
import { DriverRidesPage } from "@/pages/driver/DriverRidesPage";
import { DriverVehiclePage } from "@/pages/driver/DriverVehiclePage";
import { FleetManagerHomePage } from "@/pages/fleet-manager/FleetManagerHomePage";
import { RoadsideAnalyticsPage } from "@/pages/fleet-manager/roadside/RoadsideAnalyticsPage";
import { RoadsideEarningsPage } from "@/pages/fleet-manager/roadside/RoadsideEarningsPage";
import { RoadsideFastSlaPage } from "@/pages/fleet-manager/roadside/RoadsideFastSlaPage";
import { RoadsideFleetDashboardPage } from "@/pages/fleet-manager/roadside/RoadsideFleetDashboardPage";
import { RoadsideOperatorsPage } from "@/pages/fleet-manager/roadside/RoadsideOperatorsPage";
import { RoadsideRequestsPage as FleetRoadsideRequestsPage } from "@/pages/fleet-manager/roadside/RoadsideRequestsPage";
import { RoadsideVehiclesPage as FleetRoadsideVehiclesPage } from "@/pages/fleet-manager/roadside/RoadsideVehiclesPage";
import { TransportAnalyticsPage } from "@/pages/fleet-manager/transport/TransportAnalyticsPage";
import { TransportDriversPage } from "@/pages/fleet-manager/transport/TransportDriversPage";
import { TransportEarningsPage } from "@/pages/fleet-manager/transport/TransportEarningsPage";
import { TransportFleetDashboardPage } from "@/pages/fleet-manager/transport/TransportFleetDashboardPage";
import { TransportRidesPage } from "@/pages/fleet-manager/transport/TransportRidesPage";
import { TransportVehiclesPage } from "@/pages/fleet-manager/transport/TransportVehiclesPage";
import { ProfilePage } from "@/pages/profile/ProfilePage";
import { RoadsideOperatorDashboardPage } from "@/pages/roadside-operator/RoadsideOperatorDashboardPage";
import { RoadsideOperatorPendingPage } from "@/pages/roadside-operator/RoadsideOperatorPendingPage";
import { RoadsideDocumentsPage } from "@/pages/roadside-operator/RoadsideDocumentsPage";
import { RoadsideFleetPage } from "@/pages/roadside-operator/RoadsideFleetPage";
import { RoadsideRequestsPage } from "@/pages/roadside-operator/RoadsideRequestsPage";
import { RoadsideVehiclesPage } from "@/pages/roadside-operator/RoadsideVehiclesPage";
import { RoadsidePage } from "@/pages/roadside/RoadsidePage";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />
  },
  {
    path: "/auth/login",
    element: <AuthPage />
  },
  {
    path: "/auth/register",
    element: <AuthPage />
  },
  {
    path: "/auth/forgot-password",
    element: <ForgotPasswordPage />
  },
  {
    path: "/onboarding",
    element: <OnboardingPage />
  },
  {
    path: "/",
    element: <RoleBasedRedirect />
  },
  {
    path: "/customer",
    element: (
      <ProtectedRoute allowedRoles={["client"]}>
        <CustomerShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <CustomerHomePage /> },
      { path: "booking", element: <BookingPage /> },
      { path: "booking/dropoff", element: <BookingPage /> },
      { path: "roadside", element: <RoadsidePage /> },
      { path: "tracking/:id", element: <TrackingPage /> },
      { path: "tracking", element: <TrackingPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "history", element: <CustomerHistoryPage /> },
      { path: "addresses", element: <CustomerAddressesPage /> },
      { path: "payment-methods", element: <CustomerPaymentMethodsPage /> }
    ]
  },
  {
    path: "/driver",
    element: (
      <ProtectedRoute allowedRoles={["driver"]}>
        <DriverShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DriverPage /> },
      { path: "rides", element: <DriverRidesPage /> },
      { path: "ride/:id", element: <DriverRideDetailPage /> },
      { path: "earnings", element: <DriverEarningsPage /> },
      { path: "vehicle", element: <DriverVehiclePage /> },
      { path: "documents", element: <DriverDocumentsPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "pending", element: <DriverPendingPage /> }
    ]
  },
  {
    path: "/roadside-operator",
    element: (
      <ProtectedRoute allowedRoles={["roadside_operator"]}>
        <RoadsideOperatorShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <RoadsideOperatorDashboardPage /> },
      { path: "requests", element: <RoadsideRequestsPage /> },
      { path: "request/:id", element: <RoadsideRequestsPage /> },
      { path: "fleet", element: <RoadsideFleetPage /> },
      { path: "vehicles", element: <RoadsideVehiclesPage /> },
      { path: "documents", element: <RoadsideDocumentsPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "pending", element: <RoadsideOperatorPendingPage /> }
    ]
  },
  {
    path: "/fleet-manager",
    element: (
      <ProtectedRoute allowedRoles={["fleet_manager"]}>
        <FleetManagerShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <FleetManagerHomePage /> },
      {
        path: "transport",
        element: (
          <FleetScopeGuard scope="transport">
            <TransportFleetDashboardPage />
          </FleetScopeGuard>
        )
      },
      {
        path: "transport/vehicles",
        element: (
          <FleetScopeGuard scope="transport">
            <TransportVehiclesPage />
          </FleetScopeGuard>
        )
      },
      {
        path: "transport/drivers",
        element: (
          <FleetScopeGuard scope="transport">
            <TransportDriversPage />
          </FleetScopeGuard>
        )
      },
      {
        path: "transport/rides",
        element: (
          <FleetScopeGuard scope="transport">
            <TransportRidesPage />
          </FleetScopeGuard>
        )
      },
      {
        path: "transport/earnings",
        element: (
          <FleetScopeGuard scope="transport">
            <TransportEarningsPage />
          </FleetScopeGuard>
        )
      },
      {
        path: "transport/analytics",
        element: (
          <FleetScopeGuard scope="transport">
            <TransportAnalyticsPage />
          </FleetScopeGuard>
        )
      },
      {
        path: "roadside",
        element: (
          <FleetScopeGuard scope="roadside">
            <RoadsideFleetDashboardPage />
          </FleetScopeGuard>
        )
      },
      {
        path: "roadside/vehicles",
        element: (
          <FleetScopeGuard scope="roadside">
            <FleetRoadsideVehiclesPage />
          </FleetScopeGuard>
        )
      },
      {
        path: "roadside/operators",
        element: (
          <FleetScopeGuard scope="roadside">
            <RoadsideOperatorsPage />
          </FleetScopeGuard>
        )
      },
      {
        path: "roadside/requests",
        element: (
          <FleetScopeGuard scope="roadside">
            <FleetRoadsideRequestsPage />
          </FleetScopeGuard>
        )
      },
      {
        path: "roadside/fast-requests",
        element: (
          <FleetScopeGuard scope="roadside">
            <RoadsideFastSlaPage />
          </FleetScopeGuard>
        )
      },
      {
        path: "roadside/earnings",
        element: (
          <FleetScopeGuard scope="roadside">
            <RoadsideEarningsPage />
          </FleetScopeGuard>
        )
      },
      {
        path: "roadside/analytics",
        element: (
          <FleetScopeGuard scope="roadside">
            <RoadsideAnalyticsPage />
          </FleetScopeGuard>
        )
      },
      { path: "profile", element: <ProfilePage /> }
    ]
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminPage /> },
      { path: "users", element: <AdminPage /> },
      { path: "drivers", element: <AdminApprovalsPage /> },
      { path: "roadside-operators", element: <AdminApprovalsPage /> },
      { path: "vehicles", element: <AdminPage /> },
      { path: "bookings", element: <AdminPage /> },
      { path: "roadside-requests", element: <AdminPage /> },
      { path: "approvals", element: <AdminApprovalsPage /> },
      { path: "settings", element: <AdminPage /> }
    ]
  },
  { path: "/booking", element: <Navigate to="/customer/booking" replace /> },
  { path: "/roadside", element: <Navigate to="/customer/roadside" replace /> },
  { path: "/tracking", element: <Navigate to="/customer/tracking" replace /> },
  { path: "/operator", element: <Navigate to="/roadside-operator" replace /> },
  { path: "/fleet", element: <Navigate to="/fleet-manager" replace /> },
  { path: "/profile", element: <ProfileRedirect /> },
  { path: "*", element: <Navigate to="/" replace /> }
]);
