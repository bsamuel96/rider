export function ChatTypingIndicator() {
  return (
    <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/70" />
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/70 [animation-delay:120ms]" />
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/70 [animation-delay:240ms]" />
      scrie...
    </div>
  );
}
