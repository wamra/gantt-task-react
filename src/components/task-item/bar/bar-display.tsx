import React, { useMemo } from "react";

import { ColorStyles } from "../../../types/public-types";

import style from "./bar.module.css";

type BarDisplayProps = {
  barCornerRadius: number;
  isCritical: boolean;
  isSelected: boolean;
  hasChildren: boolean;
  height: number;
  progressWidth: number;
  /* progress start point */
  progressX: number;
  startMoveFullTask: (clientX: number) => void;
  styles: ColorStyles;
  taskId: string;
  width: number;
  x: number;
  y: number;
};

export const BarDisplay: React.FC<BarDisplayProps> = ({
  taskId,
  barCornerRadius,
  isCritical,
  isSelected,
  hasChildren,
  height,
  progressWidth,
  progressX,
  startMoveFullTask,
  styles,
  width,
  x,
  y,
}) => {
  const processColor = useMemo(() => {
    if (isCritical) {
      if (hasChildren) {
        if (isSelected) {
          return styles.groupProgressSelectedCriticalColor;
        }

        return styles.groupProgressCriticalColor;
      }

      if (isSelected) {
        return styles.barProgressSelectedCriticalColor;
      }

      return styles.barProgressCriticalColor;
    }

    if (hasChildren) {
      if (isSelected) {
        return styles.groupProgressSelectedColor;
      }

      return styles.groupProgressColor;
    }

    if (isSelected) {
      return styles.barProgressSelectedColor;
    }

    return styles.barProgressColor;
  }, [isSelected, isCritical, hasChildren, styles]);

  const barColor = useMemo(() => {
    if (isCritical) {
      if (hasChildren) {
        if (isSelected) {
          return styles.groupBackgroundSelectedCriticalColor;
        }

        return styles.groupBackgroundCriticalColor;
      }

      if (isSelected) {
        return styles.barBackgroundSelectedCriticalColor;
      }

      return styles.barBackgroundCriticalColor;
    }

    if (hasChildren) {
      if (isSelected) {
        return styles.groupBackgroundSelectedColor;
      }

      return styles.groupBackgroundColor;
    }

    if (isSelected) {
      return styles.barBackgroundSelectedColor;
    }

    return styles.barBackgroundColor;
  }, [isSelected, isCritical, hasChildren, styles]);

  return (
    <g
      data-testid={`Task-Bar-${taskId}`}
      onMouseDown={e => {
        startMoveFullTask(e.clientX);
      }}
      onTouchStart={e => {
        const firstTouch = e.touches[0];

        if (firstTouch) {
          startMoveFullTask(firstTouch.clientX);
        }
      }}
    >
      <rect
        x={x}
        width={width}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={barColor}
        className={style.barBackground}
      />
      <rect
        x={progressX}
        width={progressWidth}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={processColor}
      />
    </g>
  );
};
