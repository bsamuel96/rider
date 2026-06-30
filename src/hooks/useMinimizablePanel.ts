import { useCallback, useRef, useState } from "react";

export type PanelState = "expanded" | "half" | "collapsed" | "minimized" | "closed";

const panelOrder: PanelState[] = ["expanded", "half", "collapsed", "minimized"];

type UseMinimizablePanelOptions = {
  initialState?: PanelState;
  dismissible?: boolean;
};

type DragEndOptions = {
  downwardState?: PanelState;
  upwardState?: PanelState;
};

export function useMinimizablePanel({ initialState = "half", dismissible = false }: UseMinimizablePanelOptions = {}) {
  const [state, setState] = useState<PanelState>(initialState);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
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
    setDragOffset(0);
    setIsDragging(true);
  }, []);

  const onDragMove = useCallback((clientY: number) => {
    if (dragStartY.current === null) {
      return;
    }

    const deltaY = clientY - dragStartY.current;
    const limitedOffset = Math.max(-72, Math.min(deltaY, 320));
    setDragOffset(limitedOffset);
  }, []);

  const onDragCancel = useCallback(() => {
    dragStartY.current = null;
    setDragOffset(0);
    setIsDragging(false);
  }, []);

  const onDragEnd = useCallback(
    (clientY: number, options: DragEndOptions = {}) => {
      if (dragStartY.current === null) {
        return null;
      }

      const deltaY = clientY - dragStartY.current;
      dragStartY.current = null;
      setDragOffset(0);
      setIsDragging(false);

      if (Math.abs(deltaY) < 32) {
        return null;
      }

      const forcedState = deltaY > 0 ? options.downwardState : options.upwardState;

      if (forcedState) {
        updateState(forcedState);
        return forcedState;
      }

      if (state === "closed") {
        reopen();
        return previousOpenState.current;
      }

      const currentIndex = panelOrder.indexOf(state);
      const nextIndex = deltaY > 0 ? Math.min(panelOrder.length - 1, currentIndex + 1) : Math.max(0, currentIndex - 1);
      const nextState = panelOrder[nextIndex];
      updateState(nextState);
      return nextState;
    },
    [reopen, state, updateState]
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
    dragOffset,
    isDragging,
    onDragStart,
    onDragMove,
    onDragCancel,
    onDragEnd,
    dismissible
  };
}
