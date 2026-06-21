import { useCallback, useEffect, useState } from "react";

export type ToastTone = "default" | "success" | "warning" | "error";

export type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastInput = {
  title: string;
  description?: string;
  tone?: ToastTone;
};

const TOAST_EVENT = "rider-toast";

export function showToast(input: ToastInput) {
  window.dispatchEvent(
    new CustomEvent<ToastMessage>(TOAST_EVENT, {
      detail: {
        id: crypto.randomUUID(),
        title: input.title,
        description: input.description,
        tone: input.tone || "default"
      }
    })
  );
}

export function useToast() {
  return {
    toast: showToast
  };
}

export function useToastMessages() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const toast = (event as CustomEvent<ToastMessage>).detail;
      setToasts((current) => [toast, ...current].slice(0, 3));

      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== toast.id));
      }, 4200);
    };

    window.addEventListener(TOAST_EVENT, handleToast);
    return () => window.removeEventListener(TOAST_EVENT, handleToast);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    dismiss
  };
}
