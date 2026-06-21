import { CreditCard, Gift, ShieldCheck, X } from "lucide-react";
import type { CustomerNotification } from "@/types/domain";

type CustomerNotificationCarouselProps = {
  notifications: CustomerNotification[];
  onDismiss: (id: string) => void;
  onAction?: (path: string) => void;
};

const notificationIcons = {
  promo: Gift,
  safety: ShieldCheck,
  payment: CreditCard,
  system: ShieldCheck
} satisfies Record<CustomerNotification["type"], typeof Gift>;

export function CustomerNotificationCarousel({
  notifications,
  onDismiss,
  onAction
}: CustomerNotificationCarouselProps) {
  if (notifications.length === 0) {
    return (
      <section className="flex min-h-16 items-center">
        <div className="glass-chip inline-flex min-h-11 items-center px-4 text-sm font-semibold text-muted-foreground">
          Totul este pregătit pentru următoarea cursă.
        </div>
      </section>
    );
  }

  return (
    <section
      className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto py-1"
      aria-label="Notificări client"
    >
      {notifications.map((notification) => {
        const Icon = notificationIcons[notification.type];

        return (
          <article
            key={notification.id}
            className="glass-panel flex min-h-16 w-[80vw] max-w-[420px] shrink-0 snap-start items-center gap-3 px-3 py-2"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{notification.title}</p>
              <p className="truncate text-xs text-muted-foreground">{notification.body}</p>
              {notification.actionLabel && notification.actionPath && (
                <button
                  type="button"
                  className="mt-1 text-xs font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => onAction?.(notification.actionPath!)}
                >
                  {notification.actionLabel}
                </button>
              )}
            </div>
            {notification.dismissible && (
              <button
                type="button"
                aria-label="Închide notificarea"
                onClick={() => onDismiss(notification.id)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </article>
        );
      })}
    </section>
  );
}
