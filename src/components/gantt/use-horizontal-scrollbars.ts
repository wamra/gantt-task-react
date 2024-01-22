import { useCallback, useRef, useState } from "react";
import type { RefObject, SyntheticEvent } from "react";

import { SCROLL_STEP } from "../../constants";

export const useHorizontalScrollbars = (): [
  RefObject<HTMLDivElement>,
  number,
  (nextScrollX: number) => void,
  (event: SyntheticEvent<HTMLDivElement>) => void,
  () => void,
  () => void
] => {
  const [scrollX, setScrollX] = useState(0);

  const verticalGanttContainerRef = useRef<HTMLDivElement>(null);

  const isLockedRef = useRef(false);

  const setScrollXProgrammatically = useCallback((nextScrollX: number) => {
    const scrollEl = verticalGanttContainerRef.current;

    if (!scrollEl) {
      return;
    }

    isLockedRef.current = true;

    if (verticalGanttContainerRef.current) {
      verticalGanttContainerRef.current.scrollLeft = nextScrollX;
    }

    setScrollX(scrollEl.scrollLeft);

    setTimeout(() => {
      isLockedRef.current = false;
    }, 300);
  }, []);

  const onVerticalScrollbarScrollX = useCallback(
    (event: SyntheticEvent<HTMLDivElement>) => {
      if (isLockedRef.current) {
        return;
      }

      const nextScrollX = event.currentTarget.scrollLeft;

      if (verticalGanttContainerRef.current) {
        verticalGanttContainerRef.current.scrollLeft = nextScrollX;
      }

      setScrollX(nextScrollX);
    },
    []
  );

  const scrollToLeftStep = useCallback(() => {
    setScrollXProgrammatically(scrollX - SCROLL_STEP);
  }, [setScrollXProgrammatically, scrollX]);

  const scrollToRightStep = useCallback(() => {
    setScrollXProgrammatically(scrollX + SCROLL_STEP);
  }, [setScrollXProgrammatically, scrollX]);

  return [
    verticalGanttContainerRef,
    scrollX,
    setScrollXProgrammatically,
    onVerticalScrollbarScrollX,
    scrollToLeftStep,
    scrollToRightStep,
  ];
};
