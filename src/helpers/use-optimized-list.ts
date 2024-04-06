import { useEffect, useState } from "react";
import type { RefObject } from "react";

export type OptimizedListParams = [
  /**
   * start index
   */
  number,
  /**
   * end index
   */
  number,
  /**
   * is scrolled to start
   */
  boolean,
  /**
   * is scrolled to end
   */
  boolean,
  /**
   * client width/height of element
   */
  number,
];

const DELTA = 5;

const getStartAndEnd = (
  containerEl: Element | null,
  property: "scrollTop" | "scrollLeft",
  cellSize: number
): OptimizedListParams | null => {
  if (!containerEl) {
    return null;
  }

  const scrollValue = containerEl[property];
  const maxScrollValue =
    property === "scrollLeft"
      ? containerEl.scrollWidth
      : containerEl.scrollHeight;
  const fullValue =
    property === "scrollLeft"
      ? containerEl.clientWidth
      : containerEl.clientHeight;

  const firstIndex = Math.floor(scrollValue / cellSize);
  const lastIndex = Math.ceil((scrollValue + fullValue) / cellSize) - 1;

  const isStartOfScroll = scrollValue < DELTA;
  const isEndOfScroll = scrollValue + fullValue > maxScrollValue - DELTA;

  return [firstIndex, lastIndex, isStartOfScroll, isEndOfScroll, fullValue];
};

export const useOptimizedList = (
  containerRef: RefObject<Element>,
  property: "scrollTop" | "scrollLeft",
  cellSize: number
) => {
  const [indexes, setIndexes] = useState(() =>
    getStartAndEnd(containerRef.current, property, cellSize)
  );

  useEffect(() => {
    let rafId: number | null = null;

    let prevIndexes = indexes;

    const handler = () => {
      const nextIndexes = getStartAndEnd(
        containerRef.current,
        property,
        cellSize
      );

      const isChanged = prevIndexes
        ? nextIndexes
          ? nextIndexes.some(
              (value, index) => !prevIndexes || prevIndexes[index] !== value
            )
          : true
        : Boolean(nextIndexes);

      if (isChanged) {
        prevIndexes = nextIndexes;
        setIndexes(nextIndexes);
      }

      rafId = requestAnimationFrame(handler);
    };

    rafId = requestAnimationFrame(handler);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [containerRef, cellSize, indexes, property]);

  return indexes;
};
