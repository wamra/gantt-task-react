import type { CSSProperties, RefObject } from "react";
import React, { memo, SyntheticEvent, useMemo } from "react";

import { GanttToday, GanttTodayProps } from "../gantt-today";
import { Calendar, CalendarProps } from "../calendar/calendar";
import { TaskGanttContent, TaskGanttContentProps } from "./task-gantt-content";
import styles from "./gantt.module.css";
import { GanttTaskBarActions } from "../../types";

export interface TaskGanttProps extends GanttTaskBarActions {
  barProps: TaskGanttContentProps;
  calendarProps: Omit<CalendarProps, "scrollRef">;
  fullRowHeight: number;
  fullSvgWidth: number;
  ganttFullHeight: number;
  ganttHeight: number;
  ganttSVGRef: RefObject<SVGSVGElement>;
  ganttTodayProps: GanttTodayProps;
  horizontalContainerRef: RefObject<HTMLDivElement>;
  onVerticalScrollbarScrollX: (event: SyntheticEvent<HTMLDivElement>) => void;
  verticalGanttContainerRef: RefObject<HTMLDivElement>;
}

const TaskGanttInner: React.FC<TaskGanttProps> = ({
  barProps,
  barProps: { additionalLeftSpace },
  calendarProps,
  fullRowHeight,
  fullSvgWidth,
  ganttFullHeight,
  ganttHeight,
  ganttSVGRef,
  ganttTodayProps,
  ganttTodayProps: {
    distances: { columnWidth, rowHeight, minimumRowDisplayed },
  },
  horizontalContainerRef,
  onVerticalScrollbarScrollX,
  verticalGanttContainerRef,
}) => {
  const containerStyle = useMemo<CSSProperties>(
    () => ({
      height: Math.max(ganttHeight, minimumRowDisplayed * rowHeight),
      width: fullSvgWidth,
    }),
    [ganttHeight, minimumRowDisplayed, rowHeight, fullSvgWidth]
  );

  const gridStyle = useMemo<CSSProperties>(
    () => ({
      height: Math.max(ganttFullHeight, minimumRowDisplayed * rowHeight),
      width: fullSvgWidth,
      backgroundSize: `${columnWidth}px ${fullRowHeight * 2}px`,
      backgroundPositionX: additionalLeftSpace || undefined,
      backgroundImage: [
        `linear-gradient(to right, #ebeff2 1px, transparent 2px)`,
        `linear-gradient(to bottom, transparent ${fullRowHeight}px, #f5f5f5 ${fullRowHeight}px)`,
      ].join(", "),
    }),
    [
      additionalLeftSpace,
      columnWidth,
      fullRowHeight,
      fullSvgWidth,
      ganttFullHeight,
      minimumRowDisplayed,
      rowHeight,
    ]
  );

  return (
    <div
      className={styles.ganttVerticalContainer}
      ref={verticalGanttContainerRef}
      onScroll={onVerticalScrollbarScrollX}
      dir="ltr"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={fullSvgWidth}
        height={calendarProps.distances.headerHeight}
        fontFamily={"var(--gantt-font-family)"}
      >
        <Calendar scrollRef={verticalGanttContainerRef} {...calendarProps} />
      </svg>

      <div
        ref={horizontalContainerRef}
        className={styles.horizontalContainer}
        style={containerStyle}
      >
        <div style={gridStyle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={fullSvgWidth}
            height={ganttFullHeight}
            fontFamily={"var(--gantt-font-family)"}
            ref={ganttSVGRef}
          >
            <GanttToday {...ganttTodayProps} />
            <TaskGanttContent {...barProps} />
          </svg>
        </div>
      </div>
    </div>
  );
};

export const TaskGantt = memo(TaskGanttInner);
