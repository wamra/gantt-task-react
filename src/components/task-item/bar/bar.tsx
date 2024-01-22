import React, { useCallback } from "react";

import { getProgressPoint } from "../../../helpers/bar-helper";
import { BarDisplay } from "./bar-display";
import { BarDateHandle } from "./bar-date-handle";
import { BarRelationHandle } from "./bar-relation-handle";
import { BarProgressHandle } from "./bar-progress-handle";
import type { TaskItemProps } from "../task-item";
import type { BarMoveAction } from "../../../types/gantt-task-actions";

import styles from "./bar.module.css";
import stylesRelationHandle from "./bar-relation-handle.module.css";

export const Bar: React.FC<
  TaskItemProps & {
    onLeftRelationTriggerMouseDown: () => void;
    onRightRelationTriggerMouseDown: () => void;
    onTaskEventStart: (action: BarMoveAction, clientX: number) => void;
  }
> = ({
  colorStyles,

  distances: {
    barCornerRadius,
    handleWidth,
    relationCircleOffset,
    relationCircleRadius,
  },

  hasChildren,
  isCritical,
  isDateChangeable,
  isProgressChangeable,
  isRelationChangeable,
  isRelationDrawMode,
  isSelected,
  onLeftRelationTriggerMouseDown,
  onRightRelationTriggerMouseDown,
  onTaskEventStart,
  progressWidth,
  progressX,
  rtl,
  taskHalfHeight,
  taskHeight,
  taskYOffset,
  width,
  x1,
  x2,
}) => {
  const canChangeDates = isDateChangeable && !hasChildren;

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

  return (
    <g
      className={`${styles.barWrapper} ${stylesRelationHandle.barRelationHandleWrapper}`}
      tabIndex={0}
    >
      <BarDisplay
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

      {/* left */}
      {canChangeDates && (
        <BarDateHandle
          barCornerRadius={barCornerRadius}
          height={handleHeight}
          startMove={startMoveStartOfTask}
          width={handleWidth}
          x={x1 + 1}
          y={taskYOffset + 1}
        />
      )}

      {/* right */}
      {canChangeDates && (
        <BarDateHandle
          barCornerRadius={barCornerRadius}
          height={handleHeight}
          startMove={startMoveEndOfTask}
          width={handleWidth}
          x={x2 - handleWidth - 1}
          y={taskYOffset + 1}
        />
      )}

      {/* left */}
      {isRelationChangeable && (
        <BarRelationHandle
          isRelationDrawMode={isRelationDrawMode}
          radius={relationCircleRadius}
          startDrawRelation={onLeftRelationTriggerMouseDown}
          x={x1 - relationCircleOffset}
          y={taskYOffset + taskHalfHeight}
        />
      )}

      {/* right */}
      {isRelationChangeable && (
        <BarRelationHandle
          isRelationDrawMode={isRelationDrawMode}
          radius={relationCircleRadius}
          startDrawRelation={onRightRelationTriggerMouseDown}
          x={x2 + relationCircleOffset}
          y={taskYOffset + taskHalfHeight}
        />
      )}

      {isProgressChangeable && (
        <BarProgressHandle
          progressPoint={progressPoint}
          startMoveProgress={startMoveProgress}
        />
      )}
    </g>
  );
};
