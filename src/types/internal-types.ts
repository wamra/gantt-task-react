import {
  ChildByLevelMap,
  DateSetup,
  Distances,
  RelationMoveTarget,
  Task,
  TaskBarMoveAction,
  TaskOrEmpty,
} from "./common-types";
import { CSSProperties, MouseEvent, RefObject } from "react";
import { OptimizedListParams } from "../helpers/use-optimized-list";
import {
  AllowReorderTask,
  Column,
  GanttRenderIconsProps,
  InsertTaskPosition,
} from "./public-types";

export interface ExpandedDependent {
  containerHeight: number;
  containerY: number;
  innerFromY: number;
  innerToY: number;
  marginBetweenTasks: number | null;
  dependent: Task;
  dependentTarget: RelationMoveTarget;
  ownTarget: RelationMoveTarget;
}

// comparison level -> critical path
export type CriticalPaths = Map<number, CriticalPath>;

export type ChangeInProgress = {
  action: TaskBarMoveAction;
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

export interface ExpandedDependency {
  containerHeight: number;
  containerY: number;
  innerFromY: number;
  innerToY: number;
  marginBetweenTasks: number | null;
  ownTarget: RelationMoveTarget;
  source: Task;
  sourceTarget: RelationMoveTarget;
}

/**
 * comparison level -> task id -> {
 *   x1: number;
 *   x2: number;
 *   y: number;
 * }
 */
export type MapTaskToCoordinates = Map<number, Map<string, TaskCoordinates>>;

// comparison level -> task id -> index in array of tasks
export type TaskToGlobalIndexMap = Map<number, Map<string, number>>;

// comparison level -> task id -> index of the row containing the task
export type TaskToRowIndexMap = Map<number, Map<string, number>>;

// comparison level -> index of the row containing the task -> task id
export type RowIndexToTaskMap = Map<number, Map<number, TaskOrEmpty>>;

// global row index (tasks at different comparison levels have different indexes) -> the task
export type GlobalRowIndexToTaskMap = Map<number, TaskOrEmpty>;

// comparison level -> task id -> the task
export type TaskMapByLevel = Map<number, Map<string, TaskOrEmpty>>;

// comparison level -> task id -> depth of nesting and task number in format like `1.2.1.1.3`
export type MapTaskToNestedIndex = Map<number, Map<string, [number, string]>>;

// comparison level -> task id -> expanded dependencies
export type DependencyMap = Map<number, Map<string, ExpandedDependency[]>>;

// comparison level -> task id -> expanded dependents
export type DependentMap = Map<number, Map<string, ExpandedDependent[]>>;

// comparison level -> task id -> dependency id -> difference in milliseconds between edges of dependency
export type DependencyMargins = Map<number, Map<string, Map<string, number>>>;

export type CriticalPath = {
  tasks: Set<string>;
  dependencies: Map<string, Set<string>>;
};

export interface TaskListTableProps {
  ganttRef: RefObject<HTMLDivElement>;
  getTableRowProps: (task: TaskOrEmpty, index: number) => TaskListTableRowProps;
  canMoveTasks: boolean;
  allowMoveTask: AllowReorderTask;
  childTasksMap: ChildByLevelMap;
  columns: readonly Column[];
  cutIdsMirror: Readonly<Record<string, true>>;
  dateSetup: DateSetup;
  dependencyMap: DependencyMap;
  distances: Distances;
  fullRowHeight: number;
  ganttFullHeight: number;
  getTaskCurrentState: (task: Task) => Task;
  handleAddTask: (task: Task) => void;
  handleDeleteTasks: (task: TaskOrEmpty[]) => void;
  handleEditTask: (task: TaskOrEmpty) => void;
  handleMoveTaskBefore: (target: TaskOrEmpty, taskForMove: TaskOrEmpty) => void;
  handleMoveTaskAfter: (target: TaskOrEmpty, taskForMove: TaskOrEmpty) => void;
  handleMoveTasksInside: (parent: Task, childs: readonly TaskOrEmpty[]) => void;
  handleOpenContextMenu: (
    task: TaskOrEmpty,
    clientX: number,
    clientY: number
  ) => void;
  icons?: Partial<GanttRenderIconsProps>;
  isShowTaskNumbers: boolean;
  mapTaskToNestedIndex: MapTaskToNestedIndex;
  onClick: (task: TaskOrEmpty) => void;
  onExpanderClick: (task: Task) => void;
  renderedIndexes: OptimizedListParams | null;
  scrollToTask: (task: Task) => void;
  selectTaskOnMouseDown: (taskId: string, event: MouseEvent) => void;
  selectedIdsMirror: Readonly<Record<string, true>>;
  taskListWidth: number;
  tasks: readonly TaskOrEmpty[];
}

export type TaskListTableRowProps = {
  columns: readonly Column[];
  dateSetup: DateSetup;
  dependencyMap: DependencyMap;
  depth: number;
  distances: Distances;
  fullRowHeight: number;
  getTaskCurrentState: (task: Task) => Task;
  handleAddTask: (task: Task) => void;
  handleDeleteTasks: (task: TaskOrEmpty[]) => void;
  handleEditTask: (task: TaskOrEmpty) => void;
  // eslint-disable-next-line
  moveHandleProps?: any;
  moveOverPosition?: InsertTaskPosition;
  handleOpenContextMenu: (
    task: TaskOrEmpty,
    clientX: number,
    clientY: number
  ) => void;
  hasChildren: boolean;
  icons?: Partial<GanttRenderIconsProps>;
  indexStr: string;
  isDragging?: boolean;
  isOverlay?: boolean;
  isClosed: boolean;
  isCut: boolean;
  isEven: boolean;
  isSelected: boolean;
  isShowTaskNumbers: boolean;
  onClick: (task: TaskOrEmpty) => void;
  onExpanderClick: (task: Task) => void;
  scrollToTask: (task: Task) => void;
  selectTaskOnMouseDown: (taskId: string, event: MouseEvent) => void;
  style?: CSSProperties;
  task: TaskOrEmpty;
};

export interface TaskListHeaderProps {
  headerHeight: number;
  columns: readonly Column[];
  canMoveTasks: boolean;
  canResizeColumns: boolean;
  onColumnResizeStart: (columnIndex: number, clientX: number) => void;
}

export type MinAndMaxChildsOfTask = [
  [
    /**
     * First min
     */
    Task | null,
    /**
     * Second min
     */
    Task | null,
  ],
  [
    /**
     * First max
     */
    Task | null,
    /**
     * Second max
     */
    Task | null,
  ],
];

// comparison level -> task id -> [[first min, second min], [first max, second max]]
export type MinAndMaxChildsMap = Map<
  number,
  Map<string, MinAndMaxChildsOfTask>
>;
