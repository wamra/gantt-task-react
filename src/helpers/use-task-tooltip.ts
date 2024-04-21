import { useCallback, useEffect, useMemo, useState } from "react";

import { autoUpdate, flip, offset, shift } from "@floating-ui/dom";
import {
  useDismiss,
  useFloating,
  useFocus,
  useInteractions,
  useRole,
} from "@floating-ui/react";

import type { ChangeInProgress, Task } from "../types";

export const useTaskTooltip = (changeInProgress: ChangeInProgress | null) => {
  const [hoverTooltipTask, setHoverTooltipTask] = useState<Task | null>(null);
  const [hoverTooltipEl, setHoverTooltipEl] = useState<Element | null>(null);

  const tooltipTask = useMemo(() => {
    if (changeInProgress) {
      return changeInProgress.changedTask;
    }

    return hoverTooltipTask;
  }, [changeInProgress, hoverTooltipTask]);

  const tooltipEl = useMemo(() => {
    if (changeInProgress) {
      return changeInProgress.taskRootNode;
    }

    return hoverTooltipEl;
  }, [changeInProgress, hoverTooltipEl]);

  const {
    x,
    y,
    strategy,
    refs: { setFloating, setReference },
    context,
  } = useFloating({
    open: Boolean(tooltipTask),
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    focus,
    dismiss,
    role,
  ]);

  useEffect(() => {
    if (!tooltipTask) {
      return undefined;
    }

    let updateId: number | null = null;

    const update = () => {
      context.update();

      updateId = requestAnimationFrame(update);
    };

    updateId = requestAnimationFrame(update);

    return () => {
      if (updateId) {
        cancelAnimationFrame(updateId);
      }
    };
  }, [context, tooltipTask]);

  const onChangeTooltipTask = useCallback(
    (nextTask: Task | null, element: Element | null) => {
      setHoverTooltipTask(nextTask);
      setHoverTooltipEl(element);
    },
    []
  );

  useEffect(() => {
    setReference(tooltipEl);
  }, [setReference, tooltipEl]);

  return {
    tooltipTask,
    tooltipX: x,
    tooltipY: y,
    tooltipStrategy: strategy,
    setFloatingRef: setFloating,
    getReferenceProps,
    getFloatingProps,
    onChangeTooltipTask,
  };
};
