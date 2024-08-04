import React, { useCallback } from "react";

import { getProgressPoint } from "../../../helpers/bar-helper";
import { BarDisplay } from "./bar-display";
import { BarDateHandle } from "./bar-date-handle";
import { BarProgressHandle } from "./bar-progress-handle";
import type { TaskItemProps } from "../task-item";

import styles from "./bar.module.css";
import stylesRelationHandle from "./bar-relation-handle.module.css";
import { ProjectDisplay } from "../project/project-display";
import { BarMoveAction } from "../../../types/public-types";

export const Bar: React.FC<
  TaskItemProps & {
    onTaskEventStart: (action: BarMoveAction, clientX: number) => void;
  }
> = ({
  children: relationhandles,
  colorStyles,

  distances: { barCornerRadius, handleWidth },
  hasChildren,
  isCritical,
  isDateChangeable,
  isProgressChangeable,
  isSelected,
  onTaskEventStart,
  progressWidth,
  progressX,
  rtl,
  task,
  taskHalfHeight,
  taskHeight,
  taskYOffset,
  width,
  x1,
  x2,
}) => {
  const startMoveFullTask = useCallback(
    (clientX: number) => {
      onTaskEventStart("move", clientX);
    },
    [onTaskEventStart]
  );

  const startMoveStartOfTask = useCallback(
    (clientX: number) => {
      onTaskEventStart("start", clientX);
    },
    [onTaskEventStart]
  );

  const startMoveEndOfTask = useCallback(
    (clientX: number) => {
      onTaskEventStart("end", clientX);
    },
    [onTaskEventStart]
  );

  const startMoveProgress = useCallback(
    (clientX: number) => {
      onTaskEventStart("progress", clientX);
    },
    [onTaskEventStart]
  );

  const progressPoint = getProgressPoint(
    +!rtl * progressWidth + progressX,
    taskYOffset,
    taskHeight
  );
  const handleHeight = taskHeight - 2;

  let barDisplay = null;
  if (task.type === "project") {
    barDisplay = (
      <ProjectDisplay
        taskName={task.name}
        x1={x1}
        x2={x2}
        taskYOffset={taskYOffset}
        width={width}
        taskHeight={taskHeight}
        taskHalfHeight={taskHalfHeight}
        progressX={progressX}
        progressWidth={progressWidth}
        barCornerRadius={barCornerRadius}
        colorStyles={colorStyles}
        isSelected={isSelected}
        isCritical={isCritical}
        hasChildren={hasChildren}
        startMoveFullTask={startMoveFullTask}
      />
    );
  } else {
    barDisplay = (
      <BarDisplay
        taskName={task.name}
        x={x1}
        y={taskYOffset}
        width={width}
        height={taskHeight}
        progressX={progressX}
        progressWidth={progressWidth}
        barCornerRadius={barCornerRadius}
        styles={colorStyles}
        isSelected={isSelected}
        isCritical={isCritical}
        hasChildren={hasChildren}
        startMoveFullTask={startMoveFullTask}
      />
    );
  }

  return (
    <g
      className={`${styles.barWrapper} ${stylesRelationHandle.barRelationHandleWrapper}`}
      tabIndex={0}
    >
      {barDisplay}

      {/* left */}
      {isDateChangeable && (
        <BarDateHandle
          dataTestid={`task-date-handle-left-${task.name}`}
          barCornerRadius={barCornerRadius}
          height={handleHeight}
          startMove={startMoveStartOfTask}
          width={handleWidth}
          x={x1 + 1}
          y={taskYOffset + 1}
        />
      )}

      {/* right */}
      {isDateChangeable && (
        <BarDateHandle
          dataTestid={`task-date-handle-right-${task.name}`}
          barCornerRadius={barCornerRadius}
          height={handleHeight}
          startMove={startMoveEndOfTask}
          width={handleWidth}
          x={x2 - handleWidth - 1}
          y={taskYOffset + 1}
        />
      )}

      {relationhandles}

      {isProgressChangeable && (
        <BarProgressHandle
          taskName={task.name}
          progressPoint={progressPoint}
          startMoveProgress={startMoveProgress}
        />
      )}
    </g>
  );
};
