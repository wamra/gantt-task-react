import React from "react";
import type {
  ReactNode,
} from "react";

import styles from "./calendar.module.css";

type TopPartOfCalendarProps = {
  value: ReactNode | null;
  x1Line: number;
  y1Line: number;
  y2Line: number;
  xText: number;
  yText: number;
};

export const TopPartOfCalendar: React.FC<TopPartOfCalendarProps> = ({
  value,
  x1Line,
  y1Line,
  y2Line,
  xText,
  yText,
}) => {
  return (
    <g className="calendarTop">
      <line
        x1={x1Line}
        y1={y1Line}
        x2={x1Line}
        y2={y2Line}
        className={styles.calendarTopTick}
      />

      {value !== null && (
        <text
          y={yText - 4}
          x={xText}
          className={styles.calendarTopText}
        >
          {value}
        </text>
      )}
    </g>
  );
};
