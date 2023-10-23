import React, { useRef, useEffect } from "react";
import { GridProps, Grid } from "../grid/grid";
import { CalendarProps, Calendar } from "../calendar/calendar";
import { TaskGanttContentProps, TaskGanttContent } from "./task-gantt-content";
import styles from "./gantt.module.css";
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import { TaskContextualPaletteProps, Task } from "../../types/public-types";

export type TaskGanttProps = {
  gridProps: GridProps;
  calendarProps: CalendarProps;
  barProps: TaskGanttContentProps;
  ganttHeight: number;
  scrollY: number;
  scrollX: number;
};
export const TaskGantt: React.FC<TaskGanttProps> = ({
  gridProps,
  calendarProps,
  barProps,
  ganttHeight,
  scrollY,
  scrollX,
}) => {
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const verticalGanttContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  useEffect(() => {
    if (verticalGanttContainerRef.current) {
      verticalGanttContainerRef.current.scrollLeft = scrollX;
    }
  }, [scrollX]);

  // Manage the contextual palette
  const [anchorEl, setAnchorEl] = React.useState<null | SVGElement>(null);
  const open = Boolean(anchorEl);
  const onClickTask: (
    task: Task,
    event: React.MouseEvent<SVGElement>
  ) => void = (task, event) => {
    setAnchorEl(event.currentTarget);
    barProps.onClickTask(task, event);
  };
  const newBarProps = {
    ...barProps,
    onClickTask,
    svg: ganttSVGRef,
  };
  const onClose = () => {
    setAnchorEl(null);
  };

  const selectedTask: Task | undefined = newBarProps.selectedTask;

  let contextualPalette:
    | React.FunctionComponentElement<TaskContextualPaletteProps>
    | undefined = undefined;
  if (newBarProps.ContextualPalette && selectedTask) {
    contextualPalette = React.createElement(newBarProps.ContextualPalette, {
      selectedTask,
      onClose,
    });
  }

  return (
    <div
      className={styles.ganttVerticalContainer}
      ref={verticalGanttContainerRef}
      dir="ltr"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={gridProps.svgWidth}
        height={calendarProps.headerHeight}
        fontFamily={barProps.fontFamily}
      >
        <Calendar {...calendarProps} />
      </svg>
      <div
        ref={horizontalContainerRef}
        className={styles.horizontalContainer}
        style={
          ganttHeight
            ? { height: ganttHeight, width: gridProps.svgWidth }
            : { width: gridProps.svgWidth }
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={gridProps.svgWidth}
          height={barProps.rowHeight * barProps.tasks.length}
          fontFamily={barProps.fontFamily}
          ref={ganttSVGRef}
        >
          <Grid {...gridProps} />
          <TaskGanttContent {...newBarProps} />
        </svg>
      </div>
      {barProps.ContextualPalette && (
        <Popper
          key={`contextual-palette`}
          open={open}
          anchorEl={anchorEl}
          transition
          disablePortal
        >
          <Paper>{contextualPalette}</Paper>
        </Popper>
      )}
    </div>
  );
};
