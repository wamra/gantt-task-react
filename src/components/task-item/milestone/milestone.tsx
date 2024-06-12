import React, { useMemo } from "react";

import stylesRelationHandle from "../bar/bar-relation-handle.module.css";

import type { TaskItemProps } from "../task-item";
import type { BarMoveAction } from "../../../types/gantt-task-actions";

import styles from "./milestone.module.css";

export const Milestone: React.FC<
  TaskItemProps & {
    onTaskEventStart: (action: BarMoveAction, clientX: number) => void;
  }
> = ({
  children: relationhandles,
  task,
  taskYOffset,
  distances: { barCornerRadius },
  taskHeight,
  onTaskEventStart,
  isSelected,
  isCritical,
  colorStyles,
  x1,
}) => {
  const rotatedHeight = taskHeight / 1.414;

  const transform = `rotate(45 ${x1 + rotatedHeight * 0.356} 
    ${taskYOffset + rotatedHeight * 0.85})`;

  const barColor = useMemo(() => {
    if (isCritical) {
      if (isSelected) {
        return colorStyles.milestoneBackgroundSelectedCriticalColor;
      }

      return colorStyles.milestoneBackgroundCriticalColor;
    }

    if (isSelected) {
      return colorStyles.milestoneBackgroundSelectedColor;
    }

    return colorStyles.milestoneBackgroundColor;
  }, [isSelected, isCritical, colorStyles]);

  return (
    <g
      tabIndex={0}
      className={`${styles.milestoneWrapper} ${stylesRelationHandle.barRelationHandleWrapper}`}
    >
      <rect
        data-testid={`task-milestone-${task.name}`}
        fill={barColor}
        x={x1}
        width={rotatedHeight}
        y={taskYOffset}
        height={rotatedHeight}
        rx={barCornerRadius}
        ry={barCornerRadius}
        transform={transform}
        className={styles.milestoneBackground}
        onMouseDown={e => {
          onTaskEventStart("move", e.clientX);
        }}
        onTouchStart={e => {
          const firstTouch = e.touches[0];

          if (firstTouch) {
            onTaskEventStart("move", firstTouch.clientX);
          }
        }}
      />

      {relationhandles}
    </g>
  );
};
