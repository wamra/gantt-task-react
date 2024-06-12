import React, { memo, SyntheticEvent, useMemo } from "react";
import type { CSSProperties, RefObject } from "react";

import { GridProps, Grid } from "../grid/grid";
import { CalendarProps, Calendar } from "../calendar/calendar";
import { TaskGanttContentProps, TaskGanttContent } from "./task-gantt-content";
import styles from "./gantt.module.css";
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import { TaskContextualPaletteProps, Task } from "../../types/public-types";
import ClickAwayListener from "@material-ui/core/ClickAwayListener/ClickAwayListener";

export type TaskGanttProps = {
  barProps: TaskGanttContentProps;
  calendarProps: CalendarProps;
  fullRowHeight: number;
  fullSvgWidth: number;
  ganttFullHeight: number;
  ganttSVGRef: RefObject<SVGSVGElement>;
  gridProps: GridProps;
  ganttTaskContentRef: RefObject<HTMLDivElement>;
  onVerticalScrollbarScrollX: (event: SyntheticEvent<HTMLDivElement>) => void;
  ganttTaskRootRef: RefObject<HTMLDivElement>;
  onScrollGanttContentVertically: (
    event: SyntheticEvent<HTMLDivElement>
  ) => void;
};

const TaskGanttInner: React.FC<TaskGanttProps> = ({
  barProps,
  barProps: { additionalLeftSpace },

  calendarProps,
  fullRowHeight,
  fullSvgWidth,
  ganttFullHeight,
  ganttSVGRef,
  gridProps,
  gridProps: {
    distances: { columnWidth, rowHeight, minimumRowDisplayed },
  },
  ganttTaskContentRef,
  onVerticalScrollbarScrollX,
  ganttTaskRootRef,
  onScrollGanttContentVertically: onScrollVertically,
}) => {
  const containerStyle: CSSProperties = {
    // In order to see the vertical scrollbar of the gantt content,
    // we resize dynamically the width of the gantt content
    height: Math.max(ganttFullHeight, minimumRowDisplayed * rowHeight),
    width: ganttTaskRootRef?.current
      ? ganttTaskRootRef.current.clientWidth +
        ganttTaskRootRef.current.scrollLeft
      : fullSvgWidth,
  };

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
    ]
  );

  // Manage the contextual palette
  const [anchorEl, setAnchorEl] = React.useState<null | SVGElement>(null);
  const [selectedTask, setSelectedTask] = React.useState<Task>(null);
  const open = Boolean(anchorEl);
  const onClickTask: (
    task: Task,
    event: React.MouseEvent<SVGElement>
  ) => void = (task, event) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
    barProps.onClick(task, event);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  let contextualPalette:
    | React.FunctionComponentElement<TaskContextualPaletteProps>
    | undefined = undefined;
  if (barProps.ContextualPalette && selectedTask) {
    contextualPalette = React.createElement(barProps.ContextualPalette, {
      selectedTask,
      onClose,
    });
  } else {
    contextualPalette = <div></div>;
  }

  const onClickAway = (e: React.MouseEvent<Document, MouseEvent>) => {
    const svgElement = e.target as SVGElement;
    if (svgElement) {
      const keepPalette =
        svgElement.ownerSVGElement?.classList.contains("TaskItemClassName");
      // In a better world the contextual palette should be defined in TaskItem component but ClickAwayListener and Popper uses div that are not displayed in svg
      // So in order to let the palette open when clicking on another task, this checks if the user clicked on another task
      if (!keepPalette) {
        setAnchorEl(null);
        setSelectedTask(null);
      }
    }
  };

  return (
    <div
      className={styles.ganttTaskRoot}
      ref={ganttTaskRootRef}
      onScroll={onVerticalScrollbarScrollX}
      dir="ltr"
    >
      <Calendar {...calendarProps} />

      <div
        ref={ganttTaskContentRef}
        className={styles.ganttTaskContent}
        style={containerStyle}
        onScroll={onScrollVertically}
      >
        <div style={gridStyle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={fullSvgWidth}
            height={ganttFullHeight}
            fontFamily={barProps.fontFamily}
            ref={ganttSVGRef}
          >
            <Grid {...gridProps} />
            <TaskGanttContent {...barProps} onClick={onClickTask} />
          </svg>
        </div>
        {barProps.ContextualPalette && open && (
          <ClickAwayListener onClickAway={onClickAway}>
            <Popper
              key={`contextual-palette`}
              open={open}
              anchorEl={anchorEl}
              transition
              disablePortal
              placement="top"
            >
              <Paper>{contextualPalette}</Paper>
            </Popper>
          </ClickAwayListener>
        )}
      </div>
    </div>
  );
};

export const TaskGantt = memo(TaskGanttInner);
