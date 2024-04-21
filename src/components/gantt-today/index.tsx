import React, { memo, useMemo } from "react";
import { getDatesDiff } from "../../helpers/get-dates-diff";
import { Distances, ViewMode } from "../../types";
import styles from "./gantt-today.module.css";
import { getDaysInMonth } from "../../helpers/date-helper";

export type GanttTodayProps = {
  additionalLeftSpace: number;
  distances: Distances;
  ganttFullHeight: number;
  isUnknownDates: boolean;
  startDate: Date;
  rtl: boolean;
  viewMode: ViewMode;
};

const GanttTodayInner: React.FC<GanttTodayProps> = ({
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

    const today = new Date();
    const todayIndex = getDatesDiff(today, startDate, viewMode);

    const extraMultiplier = () => {
      switch (viewMode) {
        case ViewMode.Week: {
          const percent = today.getDay() / 7;
          return 1 + percent * 0.2;
        }
        case ViewMode.Month: {
          const dayInMonth = today.getDate();
          const maxDaysInMonth = getDaysInMonth(
            today.getMonth(),
            today.getFullYear()
          );
          const percent = dayInMonth / maxDaysInMonth;
          return 1 + percent * 0.5;
        }
        case ViewMode.Year: {
          const percent = today.getMonth() / 12;
          return  1 + (percent * 0.5);
        }
        default:
          return 1;
      }
    };

    const tickX = todayIndex * columnWidth * extraMultiplier();

    const x = rtl ? tickX + columnWidth : tickX;

    return (
      <>
        <rect
          x={additionalLeftSpace + x}
          y={0}
          width={2}
          height={ganttFullHeight}
          fill={"var(--gantt-calendar-today-color)"}
        />
        <circle
          className={styles.ganttTodayCircle}
          cx={x + 1}
          cy={6}
          r={6}
          fill={"var(--gantt-calendar-today-color)"}
        />
      </>
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

  return <g className="today">{today}</g>;
};

export const GanttToday = memo(GanttTodayInner);
