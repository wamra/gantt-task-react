import { BarMoveAction } from "./gantt-task-actions";
import { CriticalPath, Task } from "./public-types";

export type TaskId = string;


// comparison level -> critical path
export type CriticalPaths = Map<number, CriticalPath>;

export type ChangeInProgress = {
  action: BarMoveAction;
  additionalLeftSpace: number;
  additionalRightSpace: number;
  changedTask: Task;
  coordinates: TaskCoordinates;
  coordinatesDiff: number;
  initialCoordinates: TaskCoordinates;
  lastClientX: number;
  startX: number;
  task: Task;
  taskRootNode: Element;
  tsDiff: number;
};

export type TaskCoordinates = {
  /**
   * Width of inner svg wrapper
   */
  containerWidth: number;
  /**
   * Left border of inner svg wrapper relative to the root svg
   */
  containerX: number;
  /**
   * Left border relative to the wrapper svg
   */
  innerX1: number;
  /**
   * Right border relative to the wrapper svg
   */
  innerX2: number;
  /**
   * Top border of inner svg wrapper relative to the root svg
   */
  levelY: number;
  /**
   * Width of the progress bar
   */
  progressWidth: number;
  /**
   * Left border of the progress bar relative to the root svg
   */
  progressX: number;
  /**
   * Width of the task
   */
  width: number;
  /**
   * Left border of the task relative to the root svg
   */
  x1: number;
  /**
   * Right border of the task relative to the root svg
   */
  x2: number;
  /**
   * Top border of the task relative to the root svg
   */
  y: number;
};

/**
 * comparison level -> task id -> {
 *   x1: number;
 *   x2: number;
 *   y: number;
 * }
 */
export type MapTaskToCoordinates = Map<number, Map<string, TaskCoordinates>>;
