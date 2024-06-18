import {
  RelationMoveTarget,
  Task,
  TaskCoordinates,
  TaskOrEmpty,
} from "../types/public-types";
import { getCoordinatesOnLevel } from "./get-task-coordinates";

export const getRelationCircleByCoordinates = (
  svgP: DOMPoint,
  tasks: readonly TaskOrEmpty[],
  taskHalfHeight: number,
  relationCircleOffset: number,
  relationCircleRadius: number,
  rtl: boolean,
  mapTaskToCoordinatesOnLevel: Map<string, TaskCoordinates>
): [Task, RelationMoveTarget] | null => {
  const { x, y } = svgP;

  for (let i = 0, l = tasks.length; i < l; ++i) {
    const task = tasks[i];

    if (task.type !== "empty") {
      const taskCoordinates = getCoordinatesOnLevel(
        task.id,
        mapTaskToCoordinatesOnLevel
      );

      if (
        y >= taskCoordinates.y + taskHalfHeight - relationCircleRadius &&
        y <= taskCoordinates.y + taskHalfHeight + relationCircleRadius
      ) {
        if (
          x >=
            taskCoordinates.x1 - relationCircleOffset - relationCircleRadius &&
          x <= taskCoordinates.x1 - relationCircleOffset + relationCircleRadius
        ) {
          return [task, rtl ? "endOfTask" : "startOfTask"];
        }

        if (
          x >=
            taskCoordinates.x2 + relationCircleOffset - relationCircleRadius &&
          x <= taskCoordinates.x2 + relationCircleOffset + relationCircleRadius
        ) {
          return [task, rtl ? "startOfTask" : "endOfTask"];
        }
      }
    }
  }

  return null;
};
