import React, { ReactNode, useMemo } from "react";
import { GridBody, GridBodyProps } from "./grid-body";
import { ViewMode } from "../../types/public-types";
import { differenceInDays } from "date-fns";

export type GridProps = GridBodyProps;
export const Grid: React.FC<GridProps> = props => {
  const {
    viewMode,
    isUnknownDates,
    startColumnIndex,
    endColumnIndex,
    additionalLeftSpace,
    columnWidth,
    getDate,
    checkIsHoliday,
    holidayBackgroundColor,
    minTaskDate,
  } = props;

  const viewModesForDetectHolidays = new Set([
    ViewMode.Day,
    ViewMode.HalfDay,
    ViewMode.QuarterDay,
    ViewMode.Hour,
  ]);

  const displayHoliday = (date: Date, minTaskDate: Date) => {
    if (isUnknownDates) {
      const daysDiff = differenceInDays(date, minTaskDate);
      const rest = daysDiff % 7;

      if (daysDiff >= 0) {
        return rest === 5 || rest === 6;
      }

      return rest === -1 || rest === -2;
    }

    return checkIsHoliday(date, "start");
  };

  const renderedHolidays = useMemo(() => {
    const res: ReactNode[] = [];
    if (viewModesForDetectHolidays.has(viewMode)) {
      for (let i = startColumnIndex; i <= endColumnIndex; ++i) {
        const date = getDate(i);

        if (displayHoliday(date, minTaskDate)) {
          res.push(
            <rect
              height="100%"
              width={columnWidth}
              x={additionalLeftSpace + i * columnWidth}
              y={0}
              fill={holidayBackgroundColor}
              key={i}
            />
          );
        }
      }
    }

    return res;
  }, [
    viewMode,
    additionalLeftSpace,
    checkIsHoliday,
    columnWidth,
    startColumnIndex,
    endColumnIndex,
    getDate,
    holidayBackgroundColor,
  ]);

  return (
    <g className="grid">
      {renderedHolidays}
      <GridBody {...props} />
    </g>
  );
};
