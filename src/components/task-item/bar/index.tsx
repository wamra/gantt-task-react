import React, { useCallback } from "react";

import { getProgressPoint } from "../../../helpers/bar-helper";
import { BarDisplay } from "./bar-display";
import { BarDateHandle } from "./bar-date-handle";
import { BarProgressHandle } from "./bar-progress-handle";

import styles from "./bar.module.css";
import { ProjectDisplay } from "../project/project-display";
// import { BarContentSmall } from "./bar-content-small";
import { BarProps } from "./types";
import { BarRelationWrapper } from "../bar-relation";

export const Bar: React.FC<BarProps> = ({
  children: relationHandles,
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

  const renderBarDisplay = () => {
    if (task.type === "project") {
      return (
        <ProjectDisplay
          customStyle={task.style}
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
          isSelected={isSelected}
          isCritical={isCritical}
          hasChildren={hasChildren}
          startMoveFullTask={startMoveFullTask}
        />
      );
    } else {
      return (
        <BarDisplay
          customStyle={task.style}
          taskId={task.id}
          x={x1}
          y={taskYOffset}
          width={width}
          height={taskHeight}
          progressX={progressX}
          progressWidth={progressWidth}
          barCornerRadius={barCornerRadius}
          isSelected={isSelected}
          isCritical={isCritical}
          hasChildren={hasChildren}
          startMoveFullTask={startMoveFullTask}
        />
      );
    }
  };

 //  const isSmallContent = width < handleWidth * 2;

  return (
    <BarRelationWrapper className={styles.barWrapper}>
      {renderBarDisplay()}

      {/* left */}
      {isDateChangeable(task) && (
        <BarDateHandle
          className={styles.barHandle}
          dataTestId={`bar-date-handle-left-${task.id}`}
          barCornerRadius={barCornerRadius}
          height={handleHeight}
          startMove={startMoveStartOfTask}
          width={handleWidth}
          x={x1 + 1}
          y={taskYOffset + 1}
        />
      )}

      {/* right */}
      {isDateChangeable(task) && (
        <BarDateHandle
          className={styles.barHandle}
          dataTestId={`bar-date-handle-right-${task.id}`}
          barCornerRadius={barCornerRadius}
          height={handleHeight}
          startMove={startMoveEndOfTask}
          width={handleWidth}
          x={x2 - handleWidth - 1}
          y={taskYOffset + 1}
        />
      )}

      {relationHandles}

      {isProgressChangeable(task) && (
        <BarProgressHandle
          taskId={task.id}
          progressPoint={progressPoint}
          startMoveProgress={startMoveProgress}
        />
      )}
    </BarRelationWrapper>
  );

  // if (isSmallContent) {
  //   return <BarContentSmall {...props} onTaskEventStart={onTaskEventStart} />;
  // } else {
  //   return (
  //     <Bar
  //       {...props}
  //       onLeftRelationTriggerMouseDown={onLeftRelationTriggerMouseDown}
  //       onRightRelationTriggerMouseDown={onRightRelationTriggerMouseDown}
  //       onTaskEventStart={onTaskEventStart}
  //     >
  //       {relationHandles}
  //     </Bar>
  //   );
  // }
};
