import React, { useMemo } from "react";

import styles from "./project.module.css";
import { ColorStyles } from "../../../types/public-types";

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
  colorStyles: ColorStyles;
  width: number;
  x1: number;
  x2: number;
};

export const ProjectDisplay: React.FC<ProjectDisplayProps> = ({
  barCornerRadius,

  taskHalfHeight,
  taskHeight,
  isSelected,
  isCritical,
  colorStyles,
  progressWidth,
  progressX,
  taskYOffset,
  width,
  x1,
  x2,
  startMoveFullTask,
}) => {
  const barColor = useMemo(() => {
    if (isCritical) {
      if (isSelected) {
        return colorStyles.projectBackgroundSelectedCriticalColor;
      }

      return colorStyles.projectBackgroundCriticalColor;
    }

    if (isSelected) {
      return colorStyles.projectBackgroundSelectedColor;
    }

    return colorStyles.projectBackgroundColor;
  }, [isSelected, isCritical, colorStyles]);

  const processColor = useMemo(() => {
    if (isCritical) {
      if (isSelected) {
        return colorStyles.projectProgressSelectedCriticalColor;
      }

      return colorStyles.projectProgressCriticalColor;
    }

    if (isSelected) {
      return colorStyles.projectProgressSelectedColor;
    }

    return colorStyles.projectProgressColor;
  }, [isSelected, isCritical, colorStyles]);

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
