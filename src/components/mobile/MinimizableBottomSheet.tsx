import { ChevronDown, ChevronUp, Minus, X } from "lucide-react";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { useMinimizablePanel, type PanelState } from "@/hooks/useMinimizablePanel";
import { cn } from "@/utils/cn";

type MinimizableBottomSheetProps = {
  title: string;
  description?: string;
  children: ReactNode;
  compactContent?: ReactNode;
  minimizedLabel?: string;
  initialState?: PanelState;
  dismissible?: boolean;
  dragDownToMinimize?: boolean;
  showControls?: boolean;
  className?: string;
  contentClassName?: string;
  onStateChange?: (state: PanelState) => void;
};

const stateClasses: Record<Exclude<PanelState, "closed">, string> = {
  expanded: "h-[min(76svh,720px)]",
  half: "h-[46svh]",
  collapsed: "h-[154px]",
  minimized: "h-12"
};

export function MinimizableBottomSheet({
  title,
  description,
  children,
  compactContent,
  minimizedLabel,
  initialState = "half",
  dismissible = false,
  dragDownToMinimize = false,
  showControls = true,
  className,
  contentClassName,
  onStateChange
}: MinimizableBottomSheetProps) {
  const panel = useMinimizablePanel({ initialState, dismissible });
  const suppressNextClick = useRef(false);

  const setState = (nextState: PanelState) => {
    panel.setState(nextState);
    onStateChange?.(nextState);
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    suppressNextClick.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
    panel.onDragStart(event.clientY);
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    const nextState = panel.onDragEnd(event.clientY, {
      downwardState: dragDownToMinimize ? "minimized" : undefined
    });

    if (!nextState) {
      return;
    }

    suppressNextClick.current = true;
    onStateChange?.(nextState);
  };

  const handlePointerCancel = () => {
    panel.onDragCancel();
  };

  if (panel.state === "closed") {
    return null;
  }

  if (panel.state === "minimized") {
    return (
      <button
        type="button"
        onClick={() => setState("half")}
        className={cn(
          "fixed inset-x-4 bottom-[calc(var(--floating-bottom-offset)+0.25rem)] z-[650] mx-auto flex min-h-11 max-w-sm items-center justify-center gap-2 rounded-full border border-border/60 bg-background/90 px-4 text-sm font-semibold shadow-map-control backdrop-blur-xl transition-transform motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:left-5 md:right-auto md:mx-0 md:w-[360px]",
          className
        )}
        aria-label={`Redeschide panoul ${title}`}
      >
        {showControls && <ChevronUp className="h-4 w-4 text-primary" aria-hidden="true" />}
        <span className="min-w-0 truncate">{minimizedLabel || title}</span>
      </button>
    );
  }

  return (
    <section
      className={cn(
        "fixed inset-x-0 bottom-[var(--floating-bottom-offset)] z-[640] mx-auto flex max-w-xl flex-col overflow-hidden rounded-t-[2rem] border border-border/60 bg-background/90 shadow-floating backdrop-blur-2xl transition-[height,transform] duration-200 motion-reduce:transition-none md:left-5 md:right-auto md:w-[420px] md:rounded-2xl",
        stateClasses[panel.state],
        className
      )}
      aria-label={title}
    >
      <div
        className="shrink-0 touch-none select-none rounded-t-[2rem] bg-background/75 px-4 pt-2 backdrop-blur-xl md:rounded-t-2xl"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              if (suppressNextClick.current) {
                suppressNextClick.current = false;
                return;
              }

              setState(panel.state === "expanded" ? "collapsed" : "expanded");
            }}
            className="flex min-h-10 flex-1 cursor-grab flex-col items-center justify-center gap-1 active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Comută panoul ${title}`}
          >
            <span className="h-1.5 w-12 rounded-full bg-muted-foreground/30" aria-hidden="true" />
            <span className="sr-only">{title}</span>
          </button>
          {showControls && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setState("minimized")}
                className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Minimizează panoul"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              {dismissible && (
                <button
                  type="button"
                  onClick={() => setState("closed")}
                  className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Închide panoul"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-start justify-between gap-3 pb-3">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">{title}</h2>
            {description && panel.state !== "collapsed" && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
          </div>
          {showControls && (
            <button
              type="button"
              onClick={() => setState(panel.state === "expanded" ? "half" : "expanded")}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={panel.state === "expanded" ? "Micșorează panoul" : "Extinde panoul"}
            >
              {panel.state === "expanded" ? (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </div>

      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] overscroll-contain",
          contentClassName
        )}
      >
        {panel.state === "collapsed" && compactContent ? compactContent : children}
      </div>
    </section>
  );
}
