type ChatUnreadBadgeProps = {
  count?: number;
};

export function ChatUnreadBadge({ count = 0 }: ChatUnreadBadgeProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-bold text-primary-foreground">
      {count > 9 ? "9+" : count}
    </span>
  );
}
