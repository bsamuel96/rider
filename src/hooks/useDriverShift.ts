import { useCallback, useEffect, useState } from "react";
import type { DriverEarningsLedgerEntry, DriverShiftSummary, PaymentMethod } from "@/types/domain";

const SHIFT_STORAGE_KEY = "rider-demo-driver-shift";
const LEDGER_STORAGE_KEY = "rider-demo-driver-ledger";
const DEMO_DRIVER_ID = "demo-driver";

type CompletedRideInput = {
  bookingId: string;
  label: string;
  amount: number;
  paymentMethod: PaymentMethod;
};

const defaultShift = (): DriverShiftSummary => ({
  id: "demo-shift",
  driverId: DEMO_DRIVER_ID,
  startedAt: new Date().toISOString(),
  onlineMinutes: 0,
  completedRides: 0,
  grossEarnings: 0,
  cashCollected: 0,
  cardEarnings: 0,
  currency: "RON"
});

function readStorage<T>(key: string, fallback: T): T {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

export function useDriverShift() {
  const [summary, setSummary] = useState<DriverShiftSummary>(() => readStorage(SHIFT_STORAGE_KEY, defaultShift()));
  const [ledger, setLedger] = useState<DriverEarningsLedgerEntry[]>(() =>
    readStorage<DriverEarningsLedgerEntry[]>(LEDGER_STORAGE_KEY, [])
  );

  useEffect(() => {
    localStorage.setItem(SHIFT_STORAGE_KEY, JSON.stringify(summary));
  }, [summary]);

  useEffect(() => {
    localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(ledger));
  }, [ledger]);

  const recordCompletedRide = useCallback((ride: CompletedRideInput) => {
    const entry: DriverEarningsLedgerEntry = {
      id: `ledger-${ride.bookingId}-${Date.now()}`,
      bookingId: ride.bookingId,
      label: ride.label,
      amount: ride.amount,
      paymentMethod: ride.paymentMethod,
      createdAt: new Date().toISOString()
    };

    setLedger((current) => [entry, ...current].slice(0, 25));
    setSummary((current) => ({
      ...current,
      completedRides: current.completedRides + 1,
      grossEarnings: current.grossEarnings + ride.amount,
      cashCollected: current.cashCollected + (ride.paymentMethod === "cash" ? ride.amount : 0),
      cardEarnings: current.cardEarnings + (ride.paymentMethod === "card" ? ride.amount : 0)
    }));
  }, []);

  const addOnlineMinute = useCallback(() => {
    setSummary((current) => ({
      ...current,
      onlineMinutes: current.onlineMinutes + 1
    }));
  }, []);

  return {
    summary,
    ledger,
    todayEarnings: summary.grossEarnings,
    recordCompletedRide,
    addOnlineMinute
  };
}
