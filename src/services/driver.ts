import { isSupabaseConfigured, supabase } from "@/services/supabase";
import type {
  Coordinates,
  DriverAvailability,
  DriverEarningsLedgerEntry,
  DriverShiftSummary,
  DriverWorkflowStatus,
  PaymentMethod
} from "@/types/domain";
import type { Database } from "@/types/database";
import type { Json } from "@/types/json";

type DriverAvailabilityInput = {
  driverId: string;
  status: DriverWorkflowStatus;
  online: boolean;
  currentLocation?: Coordinates;
  shiftStartedAt?: string;
};

type DriverEventInput = {
  driverId: string;
  bookingId?: string;
  eventType: string;
  metadata?: Json;
};

export async function upsertDriverAvailability(input: DriverAvailabilityInput) {
  if (!isSupabaseConfigured) {
    return null;
  }

  const { data, error } = await supabase
    .from("driver_availability")
    .upsert({
      driver_id: input.driverId,
      online: input.online,
      workflow_status: input.status,
      lat: input.currentLocation?.lat ?? null,
      lng: input.currentLocation?.lng ?? null,
      shift_started_at: input.shiftStartedAt ?? null,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapAvailability(data);
}

export async function updateDriverWorkflowStatus(
  bookingId: string,
  status: DriverWorkflowStatus,
  updates: { cashCollectedAt?: string; notes?: string; cancellationReason?: string } = {}
) {
  if (!isSupabaseConfigured) {
    return null;
  }

  const timestamp = new Date().toISOString();
  const workflowUpdates: Database["public"]["Tables"]["bookings"]["Update"] = {
    driver_workflow_status: status
  };

  if (status === "offer_accepted") {
    workflowUpdates.accepted_at = timestamp;
  }

  if (status === "en_route_to_pickup") {
    workflowUpdates.driver_en_route_at = timestamp;
  }

  if (status === "arrived_at_pickup") {
    workflowUpdates.arrived_at = timestamp;
  }

  if (status === "trip_started") {
    workflowUpdates.trip_started_at = timestamp;
  }

  if (status === "trip_completed") {
    workflowUpdates.completed_at = timestamp;
  }

  if (status === "cash_collected") {
    workflowUpdates.cash_collected_at = updates.cashCollectedAt ?? timestamp;
  }

  if (status === "available" && updates.cancellationReason) {
    workflowUpdates.cancelled_at = timestamp;
    workflowUpdates.cancellation_reason = updates.cancellationReason;
  }

  if (updates.notes) {
    workflowUpdates.driver_notes = updates.notes;
  }

  const { error } = await supabase.from("bookings").update(workflowUpdates).eq("id", bookingId);

  if (error) {
    throw error;
  }

  return true;
}

export async function respondToDriverOffer(offerId: string, status: "accepted" | "rejected" | "expired") {
  if (!isSupabaseConfigured) {
    return null;
  }

  const { error } = await supabase
    .from("driver_ride_offers")
    .update({
      status,
      responded_at: new Date().toISOString()
    })
    .eq("id", offerId);

  if (error) {
    throw error;
  }

  return true;
}

export async function markDriverCashCollected(driverId: string, bookingId: string, amount: number) {
  if (!isSupabaseConfigured) {
    return null;
  }

  const timestamp = new Date().toISOString();

  const { error: bookingError } = await supabase
    .from("bookings")
    .update({
      cash_status: "collected",
      cash_collected_at: timestamp,
      driver_workflow_status: "cash_collected"
    })
    .eq("id", bookingId);

  if (bookingError) {
    throw bookingError;
  }

  const { error: ledgerError } = await supabase.from("driver_earnings_ledger").insert({
    driver_id: driverId,
    booking_id: bookingId,
    amount,
    payment_method: "cash",
    entry_type: "fare",
    notes: "Cash încasat de șofer"
  });

  if (ledgerError) {
    throw ledgerError;
  }

  return true;
}

export async function createDriverEvent(input: DriverEventInput) {
  if (!isSupabaseConfigured) {
    return null;
  }

  const { error } = await supabase.from("driver_events").insert({
    driver_id: input.driverId,
    booking_id: input.bookingId,
    event_type: input.eventType,
    metadata: input.metadata
  });

  if (error) {
    throw error;
  }

  return true;
}

export async function startDriverShift(driverId: string) {
  if (!isSupabaseConfigured) {
    return null;
  }

  const { data, error } = await supabase
    .from("driver_shift_sessions")
    .insert({ driver_id: driverId })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapShift(data);
}

export async function endDriverShift(shiftId: string, summary: Partial<DriverShiftSummary>) {
  if (!isSupabaseConfigured) {
    return null;
  }

  const { data, error } = await supabase
    .from("driver_shift_sessions")
    .update({
      ended_at: new Date().toISOString(),
      online_minutes: summary.onlineMinutes,
      completed_rides: summary.completedRides,
      gross_earnings: summary.grossEarnings,
      cash_collected: summary.cashCollected,
      card_earnings: summary.cardEarnings
    })
    .eq("id", shiftId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapShift(data);
}

export async function fetchDriverEarningsLedger(driverId: string): Promise<DriverEarningsLedgerEntry[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  const { data, error } = await supabase
    .from("driver_earnings_ledger")
    .select()
    .eq("driver_id", driverId)
    .order("created_at", { ascending: false })
    .limit(25);

  if (error) {
    throw error;
  }

  return data.map((entry) => ({
    id: entry.id,
    bookingId: entry.booking_id ?? undefined,
    label: entry.notes ?? "Cursă finalizată",
    amount: Number(entry.amount),
    paymentMethod: entry.payment_method as PaymentMethod,
    createdAt: entry.created_at
  }));
}

function mapAvailability(row: {
  driver_id: string;
  online: boolean;
  workflow_status: string;
  lat: number | null;
  lng: number | null;
  shift_started_at: string | null;
  updated_at: string;
}): DriverAvailability {
  return {
    driverId: row.driver_id,
    online: row.online,
    status: row.workflow_status as DriverWorkflowStatus,
    currentLocation:
      row.lat !== null && row.lng !== null
        ? {
            lat: Number(row.lat),
            lng: Number(row.lng)
          }
        : undefined,
    shiftStartedAt: row.shift_started_at ?? undefined,
    updatedAt: row.updated_at
  };
}

function mapShift(row: {
  id: string;
  driver_id: string;
  started_at: string;
  ended_at: string | null;
  online_minutes: number;
  completed_rides: number;
  gross_earnings: number;
  cash_collected: number;
  card_earnings: number;
  currency: string;
}): DriverShiftSummary {
  return {
    id: row.id,
    driverId: row.driver_id,
    startedAt: row.started_at,
    endedAt: row.ended_at ?? undefined,
    onlineMinutes: row.online_minutes,
    completedRides: row.completed_rides,
    grossEarnings: Number(row.gross_earnings),
    cashCollected: Number(row.cash_collected),
    cardEarnings: Number(row.card_earnings),
    currency: "RON"
  };
}
