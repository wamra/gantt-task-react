import { useCallback, useEffect, useState } from "react";
import type { RefObject } from "react";

import { checkIsDescendant } from "../../helpers/check-is-descendant";
import { getRelationCircleByCoordinates } from "../../helpers/get-relation-circle-by-coordinates";
import {
  getMapTaskToCoordinatesOnLevel,
  getTaskCoordinates,
} from "../../helpers/get-task-coordinates";
import { GanttRelationEvent } from "../../types/gantt-task-actions";
import {
  Distances,
  MapTaskToCoordinates,
  TaskToGlobalIndexMap,
  OnRelationChange,
  Task,
  TaskMapByLevel,
  TaskOrEmpty,
  DateExtremity,
} from "../../types/public-types";

type UseCreateRelationParams = {
  distances: Distances;
  ganttSVGRef: RefObject<SVGSVGElement>;
  mapTaskToCoordinates: MapTaskToCoordinates;
  mapTaskToGlobalIndex: TaskToGlobalIndexMap;
  onRelationChange?: OnRelationChange;
  rtl: boolean;
  taskHalfHeight: number;
  tasksMap: TaskMapByLevel;
  visibleTasks: readonly TaskOrEmpty[];
};

export const useCreateRelation = ({
  distances: { relationCircleOffset, relationCircleRadius },

  ganttSVGRef,
  mapTaskToCoordinates,
  mapTaskToGlobalIndex,
  onRelationChange,
  rtl,
  taskHalfHeight,
  tasksMap,
  visibleTasks,
}: UseCreateRelationParams): [
  GanttRelationEvent | null,
  (extremity: DateExtremity, task: Task) => void
] => {
  const [ganttRelationEvent, setGanttRelationEvent] =
    useState<GanttRelationEvent | null>(null);

  /**
   * Method is Start point of start draw relation
   */
  const handleBarRelationStart = useCallback(
    (extremity: DateExtremity, task: Task) => {
      const coordinates = getTaskCoordinates(task, mapTaskToCoordinates);
      const startX =
        (extremity === "startOfTask") !== rtl
          ? coordinates.x1 - 10
          : coordinates.x2 + 10;
      const startY = coordinates.y + taskHalfHeight;

      setGanttRelationEvent({
        extremity,
        task,
        startX,
        startY,
        endX: startX,
        endY: startY,
      });
    },
    [taskHalfHeight, mapTaskToCoordinates, rtl]
  );

  const startRelationExtremity = ganttRelationEvent?.extremity;
  const startRelationTask = ganttRelationEvent?.task;

  /**
   * Drag arrow
   */
  useEffect(() => {
    if (!onRelationChange || !startRelationExtremity || !startRelationTask) {
      return undefined;
    }

    const svgNode = ganttSVGRef.current;

    if (!svgNode) {
      return undefined;
    }

    const point = svgNode.createSVGPoint();

    const handleMove = (clientX: number, clientY: number) => {
      point.x = clientX;
      point.y = clientY;

      const ctm = svgNode.getScreenCTM();

      if (!ctm) {
        return;
      }

      const svgP = point.matrixTransform(ctm.inverse());

      setGanttRelationEvent(prevValue => {
        if (!prevValue) {
          return null;
        }

        return {
          ...prevValue,
          endX: svgP.x,
          endY: svgP.y,
        };
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;

      handleMove(clientX, clientY);
    };

    let lastTouch: Touch | null = null;

    const handleTouchMove = (event: TouchEvent) => {
      const firstTouch = event.touches[0];

      if (firstTouch) {
        const { clientX, clientY } = firstTouch;
        lastTouch = firstTouch;

        handleMove(clientX, clientY);
      }
    };

    const handleEnd = (clientX: number, clientY: number) => {
      point.x = clientX;
      point.y = clientY;

      const ctm = svgNode.getScreenCTM();

      if (!ctm) {
        return;
      }

      const svgP = point.matrixTransform(ctm.inverse());

      const endExtremityRelationCircle = getRelationCircleByCoordinates(
        svgP,
        visibleTasks,
        taskHalfHeight,
        relationCircleOffset,
        relationCircleRadius,
        rtl,
        getMapTaskToCoordinatesOnLevel(startRelationTask, mapTaskToCoordinates)
      );

      if (endExtremityRelationCircle) {
        const [endRelationTask, endRelationExtremity] =
          endExtremityRelationCircle;

        const { comparisonLevel: startComparisonLevel = 1 } = startRelationTask;

        const { comparisonLevel: endComparisonLevel = 1 } = endRelationTask;

        if (startComparisonLevel === endComparisonLevel) {
          const indexesOnLevel = mapTaskToGlobalIndex.get(startComparisonLevel);

          if (!indexesOnLevel) {
            throw new Error(
              `Indexes are not found for level ${startComparisonLevel}`
            );
          }

          const startIndex = indexesOnLevel.get(startRelationTask.id);

          if (typeof startIndex !== "number") {
            throw new Error(
              `Index is not found for task ${startRelationTask.id}`
            );
          }

          const endIndex = indexesOnLevel.get(endRelationTask.id);

          if (typeof endIndex !== "number") {
            throw new Error(
              `Index is not found for task ${endRelationTask.id}`
            );
          }

          const isOneDescendant =
            checkIsDescendant(startRelationTask, endRelationTask, tasksMap) ||
            checkIsDescendant(endRelationTask, startRelationTask, tasksMap);

          onRelationChange(
            [startRelationTask, startRelationExtremity, startIndex],
            [endRelationTask, endRelationExtremity, endIndex],
            isOneDescendant
          );
        }
      }

      setGanttRelationEvent(null);
    };

    const handleMouseUp = (event: MouseEvent) => {
      const { clientX, clientY } = event;

      handleEnd(clientX, clientY);
    };

    const handleTouchEnd = () => {
      if (lastTouch) {
        const { clientX, clientY } = lastTouch;

        handleEnd(clientX, clientY);
      }
    };

    svgNode.addEventListener("mousemove", handleMouseMove);
    svgNode.addEventListener("touchmove", handleTouchMove);
    svgNode.addEventListener("mouseup", handleMouseUp);
    svgNode.addEventListener("touchend", handleTouchEnd);

    return () => {
      svgNode.removeEventListener("mousemove", handleMouseMove);
      svgNode.removeEventListener("touchmove", handleTouchMove);
      svgNode.removeEventListener("mouseup", handleMouseUp);
      svgNode.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    ganttSVGRef,
    rtl,
    startRelationExtremity,
    startRelationTask,
    setGanttRelationEvent,
    mapTaskToCoordinates,
    visibleTasks,
    tasksMap,
    taskHalfHeight,
    relationCircleOffset,
    relationCircleRadius,
    onRelationChange,
  ]);

  return [ganttRelationEvent, handleBarRelationStart];
};
