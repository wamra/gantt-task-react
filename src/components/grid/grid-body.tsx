import React, { memo, useMemo } from "react";
import { getDatesDiff } from "../../helpers/get-dates-diff";

import type { DateExtremity, ViewMode } from "../../types/public-types";

export type GridBodyProps = {
  additionalLeftSpace: number;
  columnWidth: number;
  ganttFullHeight: number;
  isUnknownDates: boolean;
  startDate: Date;
  todayColor: string;
  holidayBackgroundColor: string;
  rtl: boolean;
  viewMode: ViewMode;
  startColumnIndex: number;
  endColumnIndex: number;
  checkIsHoliday: (date: Date, dateExtremity: DateExtremity) => boolean;
  getDate: (index: number) => Date;
  minTaskDate: Date;
};

const GridBodyInner: React.FC<GridBodyProps> = ({
  additionalLeftSpace,
  columnWidth,
  ganttFullHeight,
  isUnknownDates,
  todayColor,
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
        fill={todayColor}
      />
    );
  }, [
    additionalLeftSpace,
    columnWidth,
    ganttFullHeight,
    isUnknownDates,
    rtl,
    startDate,
    todayColor,
    viewMode,
  ]);

  return (
    <g className="gridBody">
      <g className="today">{today}</g>
    </g>
  );
};

export const GridBody = memo(GridBodyInner);
