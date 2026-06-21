import { useAppStore } from "@/store/useAppStore";
import type { PaymentMethod } from "@/types/domain";

export function usePaymentState() {
  const bookingDraft = useAppStore((state) => state.bookingDraft);
  const profile = useAppStore((state) => state.profile);
  const preferredPaymentMethod = useAppStore((state) => state.preferredPaymentMethod);
  const updateBookingDraft = useAppStore((state) => state.updateBookingDraft);
  const paymentMethod = bookingDraft.paymentMethod || profile?.preferredPaymentMethod || preferredPaymentMethod || "cash";
  const fareEstimate = bookingDraft.fareEstimate || bookingDraft.price || 42;

  const setPaymentMethod = (method: PaymentMethod) => {
    updateBookingDraft({
      paymentMethod: method,
      cashRequired: method === "cash",
      cashStatus: method === "cash" ? "pending_collection" : "not_required",
      currency: "RON",
      fareEstimate
    });
  };

  const togglePaymentMethod = () => {
    setPaymentMethod(paymentMethod === "cash" ? "card" : "cash");
  };

  const markCashCollected = () => {
    updateBookingDraft({ cashStatus: "collected" });
  };

  return {
    paymentMethod,
    cashStatus: bookingDraft.cashStatus || (paymentMethod === "cash" ? "pending_collection" : "not_required"),
    fareEstimate,
    currency: bookingDraft.currency || "RON",
    isCash: paymentMethod === "cash",
    isCard: paymentMethod === "card",
    setPaymentMethod,
    togglePaymentMethod,
    markCashCollected
  };
}
