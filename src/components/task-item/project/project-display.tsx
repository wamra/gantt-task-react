import React, { CSSProperties, useMemo } from "react";

import styles from "./project.module.css";

type ProjectDisplayProps = {
  barCornerRadius: number;
  isCritical: boolean;
  isSelected: boolean;
  hasChildren: boolean;
  taskHeight: number;
  taskHalfHeight: number;
  taskYOffset: number;
  progressWidth: number;
  /* progress start point */
  progressX: number;
  startMoveFullTask: (clientX: number) => void;
  taskName: string;
  width: number;
  x1: number;
  x2: number;
  customStyle?: CSSProperties;
};

export const ProjectDisplay: React.FC<ProjectDisplayProps> = ({
  barCornerRadius,
  taskName,
  taskHalfHeight,
  taskHeight,
  isSelected,
  isCritical,
  progressWidth,
  progressX,
  taskYOffset,
  width,
  x1,
  x2,
  startMoveFullTask,
  customStyle,
}) => {
  const barColor = useMemo(() => {
    if (isCritical) {
      if (isSelected) {
        return "var(--gantt-project-background-selected-critical-color)";
      }

      return "var(--gantt-project-background-critical-color)";
    }

    if (isSelected) {
      return "var(--gantt-project-background-selected-color)";
    }

    return "var(--gantt-project-background-color)";
  }, [isSelected, isCritical]);

  const processColor = useMemo(() => {
    if (isCritical) {
      if (isSelected) {
        return "var(--gantt-project-progress-selected-critical-color)";
      }

      return "var(--gantt-project-progress-critical-color)";
    }

    if (isSelected) {
      return "var(--gantt-project-progress-selected-color)";
    }

    return "var(--gantt-project-progress-color)";
  }, [isSelected, isCritical]);

  const projectLeftTriangle = [
    x1,
    taskYOffset + taskHeight / 2 - 1,
    x1,
    taskYOffset + taskHeight,
    x1 + 15,
    taskYOffset + taskHeight / 2 - 1,
  ].join(",");
  const projectRightTriangle = [
    x2,
    taskYOffset + taskHeight / 2 - 1,
    x2,
    taskYOffset + taskHeight,
    x2 - 15,
    taskYOffset + taskHeight / 2 - 1,
  ].join(",");

  return (
    <g
      style={customStyle}
      data-testid={`task-project-${taskName}`}
      onMouseDown={e => {
        startMoveFullTask(e.clientX);
      }}
      onTouchStart={e => {
        const firstTouch = e.touches[0];

        if (firstTouch) {
          startMoveFullTask(firstTouch.clientX);
        }
      }}
      tabIndex={0}
      className={styles.projectWrapper}
    >
      <rect
        fill={barColor}
        x={x1}
        width={width}
        y={taskYOffset}
        height={taskHeight}
        rx={barCornerRadius}
        ry={barCornerRadius}
        className={styles.projectBackground}
      />
      <rect
        x={progressX}
        width={progressWidth}
        y={taskYOffset}
        height={taskHeight}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={processColor}
      />
      <rect
        fill={barColor}
        x={x1}
        width={width}
        y={taskYOffset}
        height={taskHalfHeight}
        rx={barCornerRadius}
        ry={barCornerRadius}
        className={styles.projectTop}
      />
      <polygon
        className={styles.projectTop}
        points={projectLeftTriangle}
        fill={barColor}
      />
      <polygon
        className={styles.projectTop}
        points={projectRightTriangle}
        fill={barColor}
      />
    </g>
  );
};
