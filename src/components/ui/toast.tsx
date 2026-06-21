import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";
import { useToastMessages, type ToastTone } from "@/hooks/useToast";
import { cn } from "@/utils/cn";

const toneStyles: Record<ToastTone, string> = {
  default: "border-border/70 bg-background/94 text-foreground",
  success: "border-primary/30 bg-primary/12 text-foreground",
  warning: "border-amber-500/30 bg-amber-500/12 text-foreground",
  error: "border-destructive/30 bg-destructive/12 text-foreground"
};

const toneIcons = {
  default: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  error: XCircle
};

export function ToastViewport() {
  const { toasts, dismiss } = useToastMessages();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-x-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-[900] mx-auto flex max-w-md flex-col gap-2 md:bottom-5 md:right-5 md:top-auto md:mx-0">
      {toasts.map((toast) => {
        const Icon = toneIcons[toast.tone];

        return (
          <section
            key={toast.id}
            className={cn(
              "pointer-events-auto rounded-2xl border p-3 shadow-floating backdrop-blur-2xl transition-all duration-150",
              toneStyles[toast.tone]
            )}
            role="status"
            aria-live={toast.tone === "error" ? "assertive" : "polite"}
          >
            <div className="flex gap-3">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description && <p className="mt-1 text-xs text-muted-foreground">{toast.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Închide mesajul"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
}
