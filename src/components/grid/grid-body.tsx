import React, { memo, useMemo } from "react";
import { getDatesDiff } from "../../helpers/get-dates-diff";

import type { Distances, ViewMode } from "../../types";

export type GridBodyProps = {
  additionalLeftSpace: number;
  distances: Distances;
  ganttFullHeight: number;
  isUnknownDates: boolean;
  startDate: Date;
  rtl: boolean;
  viewMode: ViewMode;
};

const GridBodyInner: React.FC<GridBodyProps> = ({
  additionalLeftSpace,
  distances: { columnWidth },
  ganttFullHeight,
  isUnknownDates,
  rtl,
  startDate,
  viewMode,
}) => {
  const today = useMemo(() => {
    if (isUnknownDates) {
      return null;
    }

    const todayIndex = getDatesDiff(new Date(), startDate, viewMode);

    const tickX = todayIndex * columnWidth;

    const x = rtl ? tickX + columnWidth : tickX;

    return (
      <rect
        x={additionalLeftSpace + x}
        y={0}
        width={columnWidth}
        height={ganttFullHeight}
        fill={"var(--gantt-calendar-today-color)"}
      />
    );
  }, [
    additionalLeftSpace,
    columnWidth,
    ganttFullHeight,
    isUnknownDates,
    rtl,
    startDate,
    viewMode,
  ]);

  return (
    <g className="gridBody">
      <g className="today">{today}</g>
    </g>
  );
};

export const GridBody = memo(GridBodyInner);
