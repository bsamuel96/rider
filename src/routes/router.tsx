import { createBrowserRouter, Navigate } from "react-router-dom";
import { ChatRedirect } from "@/components/auth/ChatRedirect";
import { FleetScopeGuard } from "@/components/auth/FleetScopeGuard";
import { ProfileRedirect } from "@/components/auth/ProfileRedirect";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleBasedRedirect } from "@/components/auth/RoleBasedRedirect";
import { SupportRedirect } from "@/components/auth/SupportRedirect";
import { AdminShell } from "@/layouts/AdminShell";
import { CustomerShell } from "@/layouts/CustomerShell";
import { DriverShell } from "@/layouts/DriverShell";
import { FleetManagerShell } from "@/layouts/FleetManagerShell";
import { RoadsideOperatorShell } from "@/layouts/RoadsideOperatorShell";
import { AdminApprovalsPage } from "@/pages/admin/AdminApprovalsPage";
import { AdminPage } from "@/pages/admin/AdminPage";
import { AdminSupportPage } from "@/pages/admin/AdminSupportPage";
import { AuthPage } from "@/pages/auth/AuthPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { OnboardingPage } from "@/pages/auth/OnboardingPage";
import { BookingPage } from "@/pages/booking/BookingPage";
import { TrackingPage } from "@/pages/booking/TrackingPage";
import { ChatPage } from "@/pages/chat/ChatPage";
import { CustomerAddressesPage } from "@/pages/customer/CustomerAddressesPage";
import { CustomerHomePage } from "@/pages/customer/CustomerHomePage";
import { CustomerHistoryPage } from "@/pages/customer/CustomerHistoryPage";
import { CustomerPaymentMethodsPage } from "@/pages/customer/CustomerPaymentMethodsPage";
import { DriverDocumentsPage } from "@/pages/driver/DriverDocumentsPage";
import { DriverAcceptanceRatePage } from "@/pages/driver/DriverAcceptanceRatePage";
import { DriverActivityPage } from "@/pages/driver/DriverActivityPage";
import { DriverCampaignsPage } from "@/pages/driver/DriverCampaignsPage";
import { DriverEarningsPage } from "@/pages/driver/DriverEarningsPage";
import { DriverGuideCenterPage } from "@/pages/driver/DriverGuideCenterPage";
import { DriverMenuPage } from "@/pages/driver/DriverMenuPage";
import { DriverPage } from "@/pages/driver/DriverPage";
import { DriverPassengerScorePage } from "@/pages/driver/DriverPassengerScorePage";
import { DriverPendingPage } from "@/pages/driver/DriverPendingPage";
import { DriverPortalPage } from "@/pages/driver/DriverPortalPage";
import { DriverPrivacyPage } from "@/pages/driver/DriverPrivacyPage";
import { DriverRatingPage } from "@/pages/driver/DriverRatingPage";
import { DriverRideDetailPage } from "@/pages/driver/DriverRideDetailPage";
import { DriverRidesPage } from "@/pages/driver/DriverRidesPage";
import { DriverSafetyPage } from "@/pages/driver/DriverSafetyPage";
import { DriverScheduledRidesPage } from "@/pages/driver/DriverScheduledRidesPage";
import { DriverScorePage } from "@/pages/driver/DriverScorePage";
import { DriverSettingsPage } from "@/pages/driver/DriverSettingsPage";
import { DriverSupportPage } from "@/pages/driver/DriverSupportPage";
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
import { NewSupportTicketPage } from "@/pages/support/NewSupportTicketPage";
import { SupportPage } from "@/pages/support/SupportPage";
import { SupportTicketPage } from "@/pages/support/SupportTicketPage";

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
      { path: "payment-methods", element: <CustomerPaymentMethodsPage /> },
      { path: "chat/:threadId", element: <ChatPage /> },
      { path: "support", element: <SupportPage /> },
      { path: "support/new", element: <NewSupportTicketPage /> },
      { path: "support/:ticketId", element: <SupportTicketPage /> }
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
      { path: "menu", element: <DriverMenuPage /> },
      { path: "activity", element: <DriverActivityPage /> },
      { path: "rides", element: <DriverRidesPage /> },
      { path: "ride/:id", element: <DriverRideDetailPage /> },
      { path: "earnings", element: <DriverEarningsPage /> },
      { path: "campaigns", element: <DriverCampaignsPage /> },
      { path: "campaigns/:id", element: <DriverCampaignsPage /> },
      { path: "scheduled", element: <DriverScheduledRidesPage /> },
      { path: "settings", element: <DriverSettingsPage /> },
      { path: "portal", element: <DriverPortalPage /> },
      { path: "privacy", element: <DriverPrivacyPage /> },
      { path: "score", element: <DriverScorePage /> },
      { path: "rating", element: <DriverRatingPage /> },
      { path: "acceptance-rate", element: <DriverAcceptanceRatePage /> },
      { path: "passenger-score", element: <DriverPassengerScorePage /> },
      { path: "safety", element: <DriverSafetyPage /> },
      { path: "vehicle", element: <DriverVehiclePage /> },
      { path: "documents", element: <DriverDocumentsPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "pending", element: <DriverPendingPage /> },
      { path: "chat/:threadId", element: <ChatPage /> },
      { path: "support", element: <DriverSupportPage /> },
      { path: "support/cases", element: <DriverSupportPage /> },
      { path: "support/cases/:caseId", element: <DriverSupportPage /> },
      { path: "support/messages", element: <DriverSupportPage /> },
      { path: "support/guides", element: <DriverGuideCenterPage /> },
      { path: "support/guides/:slug", element: <DriverGuideCenterPage /> },
      { path: "support/new", element: <NewSupportTicketPage /> },
      { path: "support/:ticketId", element: <SupportTicketPage /> }
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
      { path: "pending", element: <RoadsideOperatorPendingPage /> },
      { path: "chat/:threadId", element: <ChatPage /> },
      { path: "support", element: <SupportPage /> },
      { path: "support/new", element: <NewSupportTicketPage /> },
      { path: "support/:ticketId", element: <SupportTicketPage /> }
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
      { path: "profile", element: <ProfilePage /> },
      { path: "support", element: <SupportPage /> },
      { path: "support/new", element: <NewSupportTicketPage /> },
      { path: "support/:ticketId", element: <SupportTicketPage /> }
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
      { path: "support", element: <AdminSupportPage /> },
      { path: "support/:ticketId", element: <SupportTicketPage /> },
      { path: "settings", element: <AdminPage /> }
    ]
  },
  { path: "/booking", element: <Navigate to="/customer/booking" replace /> },
  { path: "/roadside", element: <Navigate to="/customer/roadside" replace /> },
  { path: "/tracking", element: <Navigate to="/customer/tracking" replace /> },
  { path: "/operator", element: <Navigate to="/roadside-operator" replace /> },
  { path: "/fleet", element: <Navigate to="/fleet-manager" replace /> },
  { path: "/profile", element: <ProfileRedirect /> },
  { path: "/support", element: <SupportRedirect /> },
  { path: "/chat", element: <ChatRedirect /> },
  { path: "*", element: <Navigate to="/" replace /> }
]);
