import React, { useCallback } from "react";
import stylesRelationHandle from "./bar-relation-handle.module.css";
import { BarDisplay } from "./bar-display";
import type { TaskItemProps } from "../task-item";
import type { BarMoveAction } from "../../../types/gantt-task-actions";

import styles from "./bar.module.css";
import { BarDateHandle } from "./bar-date-handle";

export const BarSmall: React.FC<
  TaskItemProps & {
    onTaskEventStart: (action: BarMoveAction, clientX: number) => void;
  }
> = ({
  children: relationhandles,
  colorStyles,
  distances: { barCornerRadius, handleWidth },
  hasChildren,
  isSelected,
  isCritical,
  isDateChangeable,
  onTaskEventStart,
  progressWidth,
  progressX,
  taskYOffset,
  task,
  taskHeight,
  x1,
}) => {
  const startMoveFullTask = useCallback(
    (clientX: number) => {
      onTaskEventStart("move", clientX);
    },
    [onTaskEventStart]
  );

  const startMoveEndOfTask = useCallback(
    (clientX: number) => {
      onTaskEventStart("end", clientX);
    },
    [onTaskEventStart]
  );

  return (
    <g
      className={`${styles.barWrapper} ${stylesRelationHandle.barRelationHandleWrapper}`}
      tabIndex={0}
    >
      <BarDisplay
        taskName={task.name}
        barCornerRadius={barCornerRadius}
        hasChildren={hasChildren}
        height={taskHeight}
        isCritical={isCritical}
        isSelected={isSelected}
        progressWidth={progressWidth}
        progressX={progressX}
        startMoveFullTask={startMoveFullTask}
        styles={colorStyles}
        width={handleWidth * 2}
        x={x1}
        y={taskYOffset}
      />

      {/* right */}
      {isDateChangeable && (
        <BarDateHandle
          dataTestid={`task-date-handle-right-${task.name}`}
          barCornerRadius={barCornerRadius}
          height={taskHeight - 2}
          startMove={startMoveEndOfTask}
          width={handleWidth}
          x={x1 + handleWidth}
          y={taskYOffset + 1}
        />
      )}

      {relationhandles}
    </g>
  );
};
