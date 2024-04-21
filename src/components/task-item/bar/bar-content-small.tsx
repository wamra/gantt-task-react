import React, { useCallback, useMemo } from "react";

import { getProgressPoint } from "../../../helpers/bar-helper";
import { BarDisplay } from "./bar-display";
import { BarProgressHandle } from "./bar-progress-handle";
import type { TaskItemProps } from "../task-item";
import type { BarMoveAction } from "../../../types";

import styles from "./bar.module.css";

export const BarContentSmall: React.FC<
  TaskItemProps & {
    onTaskEventStart: (action: BarMoveAction, clientX: number) => void;
  }
> = ({
  distances: { barCornerRadius, handleWidth },
  hasChildren,
  progressWidth,
  progressX,
  taskYOffset,
  taskHeight,
  isProgressChangeable,
  onTaskEventStart,
  isSelected,
  isCritical,
  x1,
  task,
}) => {
  const progressPoint = useMemo(
    () => getProgressPoint(progressWidth + x1, taskYOffset, taskHeight),
    [progressWidth, taskHeight, taskYOffset, x1]
  );

  const startMoveFullTask = useCallback(
    (clientX: number) => {
      onTaskEventStart("move", clientX);
    },
    [onTaskEventStart]
  );

  const startMoveProgress = useCallback(
    (clientX: number) => {
      onTaskEventStart("progress", clientX);
    },
    [onTaskEventStart]
  );

  return (
    <g className={styles.barWrapper} tabIndex={0}>
      <BarDisplay
        customStyle={task.style}
        taskId={task.id}
        barCornerRadius={barCornerRadius}
        hasChildren={hasChildren}
        height={taskHeight}
        isCritical={isCritical}
        isSelected={isSelected}
        progressWidth={progressWidth}
        progressX={progressX}
        startMoveFullTask={startMoveFullTask}
        width={handleWidth * 2}
        x={x1}
        y={taskYOffset}
      />

      <g className="handleGroup">
        {isProgressChangeable(task) && (
          <BarProgressHandle
            taskId={task.id}
            progressPoint={progressPoint}
            startMoveProgress={startMoveProgress}
          />
        )}
      </g>
    </g>
  );
};
