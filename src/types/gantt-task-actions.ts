import { RelationMoveTarget, Task } from "./common-types";

export type GanttRelationEvent = {
  target: RelationMoveTarget;
  task: Task;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};
