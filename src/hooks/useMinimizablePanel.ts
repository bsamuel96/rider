import { useCallback, useRef, useState } from "react";

export type PanelState = "expanded" | "half" | "collapsed" | "minimized" | "closed";

const panelOrder: PanelState[] = ["expanded", "half", "collapsed", "minimized"];

type UseMinimizablePanelOptions = {
  initialState?: PanelState;
  dismissible?: boolean;
};

export function useMinimizablePanel({ initialState = "half", dismissible = false }: UseMinimizablePanelOptions = {}) {
  const [state, setState] = useState<PanelState>(initialState);
  const previousOpenState = useRef<Exclude<PanelState, "closed">>(initialState === "closed" ? "half" : initialState);
  const dragStartY = useRef<number | null>(null);

  const updateState = useCallback((nextState: PanelState) => {
    setState(nextState);
    if (nextState !== "closed") {
      previousOpenState.current = nextState;
    }
  }, []);

  const expand = useCallback(() => updateState("expanded"), [updateState]);
  const half = useCallback(() => updateState("half"), [updateState]);
  const collapse = useCallback(() => updateState("collapsed"), [updateState]);
  const minimize = useCallback(() => updateState("minimized"), [updateState]);
  const close = useCallback(() => {
    if (dismissible) {
      updateState("closed");
    }
  }, [dismissible, updateState]);
  const reopen = useCallback(() => updateState(previousOpenState.current === "minimized" ? "half" : previousOpenState.current), [updateState]);

  const step = useCallback(
    (direction: "up" | "down") => {
      if (state === "closed") {
        reopen();
        return;
      }

      const currentIndex = panelOrder.indexOf(state);
      const nextIndex = direction === "down" ? Math.min(panelOrder.length - 1, currentIndex + 1) : Math.max(0, currentIndex - 1);
      updateState(panelOrder[nextIndex]);
    },
    [reopen, state, updateState]
  );

  const toggle = useCallback(() => {
    if (state === "closed" || state === "minimized" || state === "collapsed") {
      updateState("half");
      return;
    }

    updateState("collapsed");
  }, [state, updateState]);

  const onDragStart = useCallback((clientY: number) => {
    dragStartY.current = clientY;
  }, []);

  const onDragEnd = useCallback(
    (clientY: number) => {
      if (dragStartY.current === null) {
        return;
      }

      const deltaY = clientY - dragStartY.current;
      dragStartY.current = null;

      if (Math.abs(deltaY) < 32) {
        return;
      }

      step(deltaY > 0 ? "down" : "up");
    },
    [step]
  );

  return {
    state,
    setState: updateState,
    expand,
    half,
    collapse,
    minimize,
    close,
    reopen,
    toggle,
    step,
    onDragStart,
    onDragEnd,
    dismissible
  };
}
