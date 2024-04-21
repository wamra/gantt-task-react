import React, { memo, useCallback, useMemo } from "react";

import { Distances, RelationMoveTarget, Task } from "../../types";
import { generateTrianglePoints } from "../../helpers/generate-triangle-points";

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
  fullRowHeight: number;
  taskHeight: number;
  isCritical: boolean;
  rtl: boolean;
  onArrowDoubleClick?: (taskFrom: Task, taskTo: Task) => void;
};

const ArrowInner: React.FC<ArrowProps> = props => {
  const {
    distances: { arrowIndent },
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
    fullRowHeight,
    taskHeight,
    isCritical,
    rtl,
    onArrowDoubleClick = undefined,
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

  const color = useMemo(() => {
    if (isCritical) {
      return "var(--gantt-arrow-critical-color)";
    }

    return "var(--gantt-arrow-color)";
  }, [isCritical]);

  return (
    <g fill={color} stroke={color}>
      <g
        data-testid={`task-arrow-${targetFrom}-${taskFrom.name}-${targetTo}-${taskTo.name}`}
        className={`arrow ${styles.arrow_clickable}`}
        onDoubleClick={onDoubleClick}
      >
        {onArrowDoubleClick && <path d={path} className={styles.clickZone} />}

        <path className={styles.mainPath} d={path} />

        <polygon className={"polygon"} points={trianglePoints} />
      </g>
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
