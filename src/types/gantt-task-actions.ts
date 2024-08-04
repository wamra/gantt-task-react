import { Task, DateExtremity } from "./public-types";

export type GanttRelationEvent = {
  extremity: DateExtremity;
  task: Task;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};
