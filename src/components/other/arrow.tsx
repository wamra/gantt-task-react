import React, {memo, useCallback, useMemo} from "react";

import {Distances, Task} from "../../types/public-types";
import {RelationMoveTarget} from "../../types/gantt-task-actions";
import {generateTrianglePoints} from "../../helpers/generate-triangle-points";
import {
  FixDependencyPosition,
  fixPositionContainerClass,
} from "./fix-dependency-position";

import styles from "./arrow.module.css";

type ArrowProps = {
  distances: Distances;
  taskFrom: Task;
  targetFrom: RelationMoveTarget;
  fromX1: number;
  fromX2: number;
  fromY: number;
  taskTo: Task;
  targetTo: RelationMoveTarget;
  toX1: number;
  toX2: number;
  toY: number;
  marginBetweenTasks?: number | null;
  fullRowHeight: number;
  taskHeight: number;
  isShowDependencyWarnings: boolean;
  isCritical: boolean;
  rtl: boolean;
  onArrowDoubleClick?: (taskFrom: Task, taskTo: Task) => void;
  handleFixDependency: (task: Task, delta: number) => void;
};

const ArrowInner: React.FC<ArrowProps> = (props) => {
  const {
    distances: {
      arrowIndent,
      dependencyFixWidth,
      dependencyFixHeight,
      dependencyFixIndent,
    },
    taskFrom,
    targetFrom,
    fromX1,
    fromX2,
    fromY,
    taskTo,
    targetTo,
    toX1,
    toX2,
    toY,
    marginBetweenTasks = undefined,
    fullRowHeight,
    taskHeight,
    isShowDependencyWarnings,
    isCritical,
    rtl,
    onArrowDoubleClick = undefined,
    handleFixDependency,
  } = props;
  const indexFrom = useMemo(
    () => Math.floor(fromY / fullRowHeight),
    [fromY, fullRowHeight]
  );
  const indexTo = useMemo(
    () => Math.floor(toY / fullRowHeight),
    [toY, fullRowHeight]
  );

  const onDoubleClick = useCallback(() => {
    if (onArrowDoubleClick) {
      onArrowDoubleClick(taskFrom, taskTo);
    }
  }, [taskFrom, taskTo, onArrowDoubleClick]);

  const [path, trianglePoints] = useMemo(
    () =>
      drownPathAndTriangle(
        indexFrom,
        fromX1,
        fromX2,
        fromY,
        (targetFrom === "startOfTask") !== rtl,
        indexTo,
        toX1,
        toX2,
        toY,
        (targetTo === "startOfTask") !== rtl,
        fullRowHeight,
        taskHeight,
        arrowIndent
      ),
    [
      indexFrom,
      fromX1,
      fromX2,
      fromY,
      targetFrom,
      indexTo,
      toX1,
      toX2,
      toY,
      targetTo,
      rtl,
      fullRowHeight,
      taskHeight,
      arrowIndent,
    ]
  );

  const taskFromFixerPosition = useMemo(() => {
    const isLeft = (targetFrom === "startOfTask") !== rtl;

    if (isLeft) {
      return fromX1 - dependencyFixIndent;
    }

    return fromX2 + dependencyFixIndent;
  }, [fromX1, fromX2, targetFrom, rtl, dependencyFixIndent]);

  const taskToFixerPosition = useMemo(() => {
    const isLeft = (targetTo === "startOfTask") !== rtl;

    if (isLeft) {
      return toX1 - dependencyFixIndent;
    }

    return toX2 + dependencyFixIndent;
  }, [toX1, toX2, targetTo, rtl, dependencyFixIndent]);

  const fixDependencyTaskFrom = useCallback(() => {
    if (typeof marginBetweenTasks !== "number") {
      return;
    }

    handleFixDependency(taskFrom, marginBetweenTasks);
  }, [taskFrom, handleFixDependency, marginBetweenTasks]);

  const fixDependencyTaskTo = useCallback(() => {
    if (typeof marginBetweenTasks !== "number") {
      return;
    }

    handleFixDependency(taskTo, -marginBetweenTasks);
  }, [taskTo, handleFixDependency, marginBetweenTasks]);

  const hasWarning = useMemo(
    () =>
      isShowDependencyWarnings &&
      typeof marginBetweenTasks === "number" &&
      marginBetweenTasks < 0,
    [marginBetweenTasks, isShowDependencyWarnings]
  );

  const color = useMemo(() => {
    if (isCritical) {
      return 'var(--gantt-arrow-critical-color)';
    }

    if (hasWarning) {
      return 'var(--gantt-arrow-warning-color)';
    }

    return 'var(--gantt-arrow-color)';
  }, [hasWarning, isCritical,]);

  return (
    <g className={fixPositionContainerClass} fill={color} stroke={color}>
      <g
        data-testid={`task-arrow-${targetFrom}-${taskFrom.name}-${targetTo}-${taskTo.name}`}
        className={`"arrow" ${styles.arrow_clickable}`}
        onDoubleClick={onDoubleClick}
      >
        {onArrowDoubleClick && <path d={path} className={styles.clickZone}/>}

        <path className={styles.mainPath} d={path}/>

        <polygon points={trianglePoints}/>
      </g>

      {hasWarning && (
        <>
          <FixDependencyPosition
            x={taskToFixerPosition}
            y={toY}
            dependencyFixIndent={dependencyFixIndent}
            isLeft={rtl}
            color={'var(--gantt-arrow-fix-color)'}
            width={dependencyFixWidth}
            height={dependencyFixHeight}
            handleFixPosition={fixDependencyTaskTo}
          />

          <FixDependencyPosition
            x={taskFromFixerPosition}
            y={fromY}
            dependencyFixIndent={dependencyFixIndent}
            isLeft={!rtl}
            color={'var(--gantt-arrow-fix-color)'}
            width={dependencyFixWidth}
            height={dependencyFixHeight}
            handleFixPosition={fixDependencyTaskFrom}
          />
        </>
      )}
    </g>
  );
};

export const Arrow = memo(ArrowInner);

const drownPathAndTriangle = (
  indexForm: number,
  fromX1: number,
  fromX2: number,
  fromY: number,
  isTaskFromLeftSide: boolean,
  indexTo: number,
  toX1: number,
  toX2: number,
  toY: number,
  isTaskToLeftSide: boolean,
  fullRowHeight: number,
  taskHeight: number,
  arrowIndent: number
) => {
  const isDownDirected = indexTo > indexForm;
  const horizontalDockingY = isDownDirected
    ? (indexForm + 1) * fullRowHeight
    : indexForm * fullRowHeight;

  const taskFromEndPositionX = isTaskFromLeftSide
    ? fromX1 - arrowIndent
    : fromX2 + arrowIndent;

  const taskToEndPositionX = isTaskToLeftSide
    ? toX1 - arrowIndent
    : toX2 + arrowIndent;
  const taskToEndPositionY = toY + taskHeight / 2;

  const path = `M ${isTaskFromLeftSide ? fromX1 : fromX2} ${
    fromY + taskHeight / 2
  }
  H ${taskFromEndPositionX}
  V ${horizontalDockingY}
  H ${taskToEndPositionX}
  V ${taskToEndPositionY}
  H ${isTaskToLeftSide ? toX1 : toX2}`;

  const trianglePoints = isTaskToLeftSide
    ? generateTrianglePoints(toX1, taskToEndPositionY, 5, false)
    : generateTrianglePoints(toX2, taskToEndPositionY, 5, true);

  return [path, trianglePoints];
};
