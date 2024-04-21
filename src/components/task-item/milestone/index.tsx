import React, { PropsWithChildren, useMemo } from "react";

import type { TaskItemProps } from "../task-item";
import type { TaskBarMoveAction } from "../../../types";

import styles from "./milestone.module.css";
import { BarRelationWrapper } from "../bar-relation";

export const Milestone: React.FC<
  TaskItemProps & {
    onLeftRelationTriggerMouseDown: () => void;
    onRightRelationTriggerMouseDown: () => void;
    onTaskEventStart: (action: TaskBarMoveAction, clientX: number) => void;
  } & PropsWithChildren
> = ({
  children: relationHandles,
  task,
  taskYOffset,
  distances: { barCornerRadius },
  taskHeight,
  onTaskEventStart,
  isSelected,
  isCritical,
  x1,
}) => {
  const rotatedHeight = taskHeight / 1.414;

  const transform = `rotate(45 ${x1 + rotatedHeight * 0.356}
    ${taskYOffset + rotatedHeight * 0.85})`;

  const barColor = useMemo(() => {
    if (isCritical) {
      if (isSelected) {
        return "var(--gantt-milestone-background-selected-critical-color)";
      }

      return "var(--gantt-milestone-background-critical-color)";
    }

    if (isSelected) {
      return "var(--gantt-milestone-background-selected-color)";
    }

    return "var(--gantt-milestone-background-color)";
  }, [isSelected, isCritical]);

  return (
    <BarRelationWrapper className={styles.milestoneWrapper}>
      <rect
        data-testid={`task-milestone-${task.id}`}
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
      {relationHandles}
    </BarRelationWrapper>
  );
};
