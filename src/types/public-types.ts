import type { ComponentType, MouseEvent, ReactNode } from "react";

import type { Locale as DateLocale } from "date-fns";

import type { BarMoveAction, RelationMoveTarget } from "./gantt-task-actions";
import { OptimizedListParams } from "../helpers/use-optimized-list";

export enum ViewMode {
  Hour = "Hour",
  QuarterDay = "Quarter Day",
  HalfDay = "Half Day",
  Day = "Day",
  /** ISO-8601 week */
  Week = "Week",
  Month = "Month",
  Year = "Year",
}

export interface DateSetup {
  dateFormats: DateFormats;
  dateLocale: DateLocale;
  isUnknownDates: boolean;
  preStepsCount: number;
  viewMode: ViewMode;
}

export type RenderTopHeader = (
  date: Date,
  viewMode: ViewMode,
  dateSetup: DateSetup
) => ReactNode;

export type RenderBottomHeader = (
  date: Date,
  viewMode: ViewMode,
  dateSetup: DateSetup,
  index: number,
  isUnknownDates: boolean
) => ReactNode;

export interface Dependency {
  sourceId: string;
  sourceTarget: RelationMoveTarget;
  ownTarget: RelationMoveTarget;
}

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

export interface ColorStyles {
  arrowColor: string;
  arrowCriticalColor: string;
  arrowWarningColor: string;
  barProgressColor: string;
  barProgressCriticalColor: string;
  barProgressSelectedColor: string;
  barProgressSelectedCriticalColor: string;
  barBackgroundColor: string;
  barBackgroundCriticalColor: string;
  barBackgroundSelectedColor: string;
  barBackgroundSelectedCriticalColor: string;
  groupProgressColor: string;
  groupProgressCriticalColor: string;
  groupProgressSelectedColor: string;
  groupProgressSelectedCriticalColor: string;
  groupBackgroundColor: string;
  groupBackgroundCriticalColor: string;
  groupBackgroundSelectedColor: string;
  groupBackgroundSelectedCriticalColor: string;
  projectProgressColor: string;
  projectProgressCriticalColor: string;
  projectProgressSelectedColor: string;
  projectProgressSelectedCriticalColor: string;
  projectBackgroundColor: string;
  projectBackgroundCriticalColor: string;
  projectBackgroundSelectedColor: string;
  projectBackgroundSelectedCriticalColor: string;
  milestoneBackgroundColor: string;
  milestoneBackgroundCriticalColor: string;
  milestoneBackgroundSelectedColor: string;
  milestoneBackgroundSelectedCriticalColor: string;
  evenTaskBackgroundColor: string;
  holidayBackgroundColor: string;
  taskDragColor: string;
  selectedTaskBackgroundColor: string;
  todayColor: string;
  contextMenuBoxShadow: string;
  contextMenuBgColor: string;
  contextMenuTextColor: string;
}

/**
 * date-fns formats
 */
export interface DateFormats {
  dateColumnFormat: string;
  dayBottomHeaderFormat: string;
  dayTopHeaderFormat: string;
  hourBottomHeaderFormat: string;
  monthBottomHeaderFormat: string;
  monthTopHeaderFormat: string;
}

export interface Distances {
  actionColumnWidth: number;
  arrowIndent: number;
  barCornerRadius: number;
  /**
   * How many of row width can be taken by task.
   * From 0 to 100
   */
  barFill: number;
  columnWidth: number;
  contextMenuIconWidth: number;
  contextMenuOptionHeight: number;
  contextMenuSidePadding: number;
  dateCellWidth: number;
  dependenciesCellWidth: number;
  dependencyFixHeight: number;
  dependencyFixIndent: number;
  dependencyFixWidth: number;
  expandIconWidth: number;
  handleWidth: number;
  headerHeight: number;
  ganttHeight: number;
  minimumRowDisplayed: number;
  nestedTaskNameOffset: number;
  relationCircleOffset: number;
  relationCircleRadius: number;
  rowHeight: number;
  tableWidth?: number;
  taskWarningOffset: number;
  titleCellWidth: number;
}

export type TaskType = "task" | "milestone" | "project";

export interface Task {
  id: string;
  type: TaskType;
  name: string;
  start: Date;
  end: Date;
  /**
   * From 0 to 100
   */
  progress: number;
  assignees?: string[];
  styles?: Partial<ColorStyles>;
  isDisabled?: boolean;
  isRelationDisabled?: boolean;
  /**
   * Project or task
   */
  parent?: string;
  dependencies?: Dependency[];
  hideChildren?: boolean;
  displayOrder?: number;
  comparisonLevel?: number;
}

export interface EmptyTask {
  id: string;
  type: "empty";
  name: string;
  parent?: string;
  comparisonLevel?: number;
  displayOrder?: number;
  isDisabled?: boolean;
  styles?: Partial<ColorStyles>;
}

export type TaskOrEmpty = Task | EmptyTask;

export type OnArrowDoubleClick = (
  taskFrom: Task,
  taskFromIndex: number,
  taskTo: Task,
  taskToIndex: number
) => void;

export type OnRelationChange = (
  /**
   * Task, targer, index
   */
  from: [Task, RelationMoveTarget, number],
  /**
   * Task, targer, index
   */
  to: [Task, RelationMoveTarget, number],
  /**
   * One of tasks is descendant of other task
   */
  isOneDescendant: boolean
) => void;

export type OnDateChangeSuggestionType = [
  /**
   * Start date
   */
  Date,
  /**
   * End date
   */
  Date,
  /**
   * Suggested task
   */
  Task,
  /**
   * Index in array of tasks
   */
  number
];

export type OnDateChange = (
  task: TaskOrEmpty,
  dependentTasks: readonly Task[],
  index: number,
  parents: readonly Task[],
  suggestions: readonly OnDateChangeSuggestionType[]
) => void;

export type OnProgressChange = (
  task: Task,
  children: readonly Task[],
  index: number
) => void;

export type OnEditTask = (
  task: TaskOrEmpty,
  index: number,
  getMetadata: GetMetadata
) => void;

export type OnMoveTaskBeforeAfter = (
  task: TaskOrEmpty,
  taskForMove: TaskOrEmpty,
  dependentTasks: readonly Task[],
  taskIndex: number,
  taskForMoveIndex: number,
  parents: readonly Task[],
  suggestions: readonly OnDateChangeSuggestionType[]
) => void;

export type OnMoveTaskInside = (
  parent: Task,
  childs: readonly TaskOrEmpty[],
  dependentTasks: readonly Task[],
  parentIndex: number,
  childIndexes: readonly number[],
  parents: readonly Task[],
  suggestions: readonly OnDateChangeSuggestionType[]
) => void;

export type OnAddTask = (parentTask: Task, getMetadata: GetMetadata) => void;

export type FixPosition = (
  task: Task,
  date: Date,
  /**
   * index in the array of tasks
   */
  index: number
) => void;

export type OnChangeTasksAction =
  | {
      type: "add_tasks";
    }
  | {
      type: "date_change";
    }
  | {
      type: "delete_relation";
      payload: {
        taskFrom: Task;
        taskFromIndex: number;
        taskTo: Task;
        taskToIndex: number;
      };
    }
  | {
      type: "delete_task";
      payload: {
        tasks: readonly TaskOrEmpty[];
        taskIndexes: readonly number[];
      };
    }
  | {
      type: "edit_task";
    }
  | {
      type: "fix_dependency_position";
    }
  | {
      type: "fix_end_position";
    }
  | {
      type: "fix_start_position";
    }
  | {
      type: "move_task_before";
    }
  | {
      type: "move_task_after";
    }
  | {
      type: "move_task_inside";
    }
  | {
      type: "progress_change";
    }
  | {
      type: "relation_change";
    }
  | {
      type: "expandState_change";
      payload: {
        changedTask: Task;
      };
    };

export type RelationKind =
  | "startToStart"
  | "startToEnd"
  | "endToStart"
  | "endToEnd";

export type OnChangeTasks = (
  nextTasks: readonly TaskOrEmpty[],
  action: OnChangeTasksAction
) => void;

export interface EventOption {
  /**
   * Time step value for date changes.
   */
  timeStep?: number;
  /**
   * Invokes on bar double click.
   */
  onDoubleClick?: (task: Task) => void;
  /**
   * Invokes on bar click.
   */
  onClick?: (task: TaskOrEmpty) => void;
  /**
   * Recount descedents of a group task when moving
   */
  isMoveChildsWithParent?: boolean;
  /**
   * Recount parents of tasks in callback `onChangeTasks`
   */
  isUpdateDisabledParentsOnChange?: boolean;
  /**
   * Invokes when the task expand status changed(task.hideChildren)
   */
  onChangeExpandState?: (changedTask: Task) => void;
  /**
   * Invokes on every change of the list of tasks
   */
  onChangeTasks?: OnChangeTasks;
  /**
   * Invokes on end and start time change. Chart undoes operation if method return false or error.
   */
  onDateChange?: OnDateChange;
  authorizedRelations?: RelationKind[];
  /**
   * Invokes on click on fix element next to relation arrow
   */
  onFixDependencyPosition?: OnDateChange;
  /**
   * Invokes new relation between tasks
   */
  onRelationChange?: OnRelationChange;
  /**
   * Invokes on progress change
   */
  onProgressChange?: OnProgressChange;
  /**
   * Callback for getting data of the added task
   */
  onAddTask?: (task: Task) => Promise<TaskOrEmpty | null>;
  /**
   * Invokes on edit button click
   */
  onAddTaskClick?: OnAddTask;
  /**
   * Invokes on delete selected task
   */
  onDelete?: (
    tasks: readonly TaskOrEmpty[],
    dependentTasks: readonly Task[],
    indexes: Array<{
      task: TaskOrEmpty;
      index: number;
    }>,
    parents: readonly Task[],
    suggestions: readonly OnDateChangeSuggestionType[]
  ) => void;
  /**
   * Callback for getting new data of the edited task
   */
  onEditTask?: (task: TaskOrEmpty) => Promise<TaskOrEmpty | null>;
  /**
   * Invokes on edit button click
   */
  onEditTaskClick?: OnEditTask;
  /**
   * Invokes on move task after other task
   */
  onMoveTaskBefore?: OnMoveTaskBeforeAfter;
  /**
   * Invokes on move task after other task
   */
  onMoveTaskAfter?: OnMoveTaskBeforeAfter;
  /**
   * Invokes on move task inside other task
   */
  onMoveTaskInside?: OnMoveTaskInside;
  /**
   * Invokes on double click on the relation arrow between tasks
   */
  onArrowDoubleClick?: OnArrowDoubleClick;
  /**
   * Invokes on click on fix element on the start of task
   */
  fixStartPosition?: FixPosition;
  /**
   * Invokes on click on fix element on the end of task
   */
  fixEndPosition?: FixPosition;

  onWheel?: (wheelEvent: WheelEvent) => void;
}

export interface DisplayOption {
  viewMode?: ViewMode;
  isDeleteDependencyOnDoubleClick?: boolean;
  /**
   * Display offsets from start on timeline instead of dates
   */
  isUnknownDates?: boolean;
  /**
   * Locale of date-fns
   */
  dateLocale?: DateLocale;
  viewDate?: Date;
  preStepsCount?: number;
  rtl?: boolean;

  /**
   * Show an warning icon next to task
   * if some childs aren't within the time interval of the task
   * and show elements to fix these warnings
   */
  isShowChildOutOfParentWarnings?: boolean;
  /**
   * Show an warning icon next to task
   * if some dependencies are conflicting
   * and show elements to fix these warnings
   */
  isShowDependencyWarnings?: boolean;
  /**
   * Show critical path
   */
  isShowCriticalPath?: boolean;
  /**
   * Show numbers of tasks next to tasks
   */
  isShowTaskNumbers?: boolean;
}

export interface Icons {
  renderAddIcon: (task: TaskOrEmpty) => ReactNode;
  renderClosedIcon: (task: TaskOrEmpty) => ReactNode;
  renderDeleteIcon: (task: TaskOrEmpty) => ReactNode;
  renderEditIcon: (task: TaskOrEmpty) => ReactNode;
  renderOpenedIcon: (task: TaskOrEmpty) => ReactNode;
  renderNoChildrenIcon: (task: TaskOrEmpty) => ReactNode;
}

export interface StylingOption {
  /**
   * Allow drag-n-drop of tasks in the table
   */
  canMoveTasks?: boolean;
  canResizeColumns?: boolean;
  colors?: Partial<ColorStyles>;
  dateFormats?: Partial<DateFormats>;
  distances?: Partial<Distances>;
  icons?: Partial<Icons>;
  columns?: readonly Column[];
  onResizeColumn?: OnResizeColumn;
  fontFamily?: string;
  fontSize?: string;
  TooltipContent?: ComponentType<{
    task: Task;
    fontSize: string;
    fontFamily: string;
  }>;
  TaskListHeader?: ComponentType<TaskListHeaderProps>;
  TaskListTable?: ComponentType<TaskListTableProps>;

  /**
   * Render function of bottom part of header above chart
   */
  renderBottomHeader?: RenderBottomHeader;
  /**
   * Render function of top part of header above chart
   */
  renderTopHeader?: RenderTopHeader;
  /**
   * Check is current date is a holiday
   * @param date the date
   * @param minTaskDate lower date of all tasks
   * @param dateSetup
   * @param dateExtremity start or end date
   */
  checkIsHoliday?: (
    date: Date,
    minTaskDate: Date,
    dateSetup: DateSetup,
    dateExtremity: DateExtremity
  ) => boolean;
  /**
   * Round the date of task after move or resize
   * @param date Date after move
   * @param viewMode current date unit
   * @param dateExtremity start or end date
   * @param action current user action
   * @returns rounded date
   */
  roundDate?: (
    date: Date,
    viewMode: ViewMode,
    dateExtremity: DateExtremity,
    action: BarMoveAction
  ) => Date;
  dateMoveStep?: String;
  ContextualPalette?: React.FC<TaskContextualPaletteProps>;
}

export interface TaskContextualPaletteProps {
  selectedTask: Task;
  onClose: () => void;
}

export type DateExtremity = "start" | "end";

export interface GanttProps extends EventOption, DisplayOption, StylingOption {
  /**
   * Can be used to compare multiple graphs. This prop is the number of graps being compared
   */
  comparisonLevels?: number;
  contextMenuOptions?: ContextMenuOptionType[];
  enableTableListContextMenu?: number;
  /**
   * Get new id for task after using copy-paste
   */
  getCopiedTaskId?: GetCopiedTaskId;
  /**
   * Move dates of tasks to working days during change
   */
  isAdjustToWorkingDates?: boolean;
  tasks: readonly TaskOrEmpty[];
}

export interface TaskListTableProps {
  canMoveTasks: boolean;
  childTasksMap: ChildByLevelMap;
  colors: ColorStyles;
  columns: readonly Column[];
  cutIdsMirror: Readonly<Record<string, true>>;
  dateSetup: DateSetup;
  dependencyMap: DependencyMap;
  distances: Distances;
  fontFamily: string;
  fontSize: string;
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
  icons?: Partial<Icons>;
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

export interface TaskListHeaderProps {
  headerHeight: number;
  columns: readonly Column[];
  fontFamily: string;
  fontSize: string;
  canResizeColumns: boolean;
  onColumnResizeStart: (columnIndex: number, clientX: number) => void;
}

// comparison level -> task id -> index in array of tasks
export type TaskToGlobalIndexMap = Map<number, Map<string, number>>;

// comparison level -> task id -> index of the row containing the task
export type TaskToRowIndexMap = Map<number, Map<string, number>>;

// comparison level -> index of the row containing the task -> task id
export type RowIndexToTaskMap = Map<number, Map<number, TaskOrEmpty>>;

// global row index (tasks at different comparison levels have different indexes) -> the task
export type GlobalRowIndexToTaskMap = Map<number, TaskOrEmpty>;

// comparison level -> task id -> array of child tasks
export type ChildByLevelMap = Map<number, Map<string, TaskOrEmpty[]>>;

// comparison level -> tasks that don't have parent
export type RootMapByLevel = Map<number, TaskOrEmpty[]>;

// comparison level -> task id -> the task
export type TaskMapByLevel = Map<number, Map<string, TaskOrEmpty>>;

// comparison level -> task id -> depth of nesting and task number in format like `1.2.1.1.3`
export type MapTaskToNestedIndex = Map<number, Map<string, [number, string]>>;

export interface TaskOutOfParentWarning {
  isOutside: boolean;
  date: Date;
}

export interface TaskOutOfParentWarnings {
  start?: TaskOutOfParentWarning;
  end?: TaskOutOfParentWarning;
}

/**
 * comparison level -> task id -> {
 *   start: {
 *     isOutsie: false,
 *     date: Date,
 *   },
 *
 *   end: {
 *     isOutsie: false,
 *     date: Date,
 *   },
 * }
 */
export type ChildOutOfParentWarnings = Map<
  number,
  Map<string, TaskOutOfParentWarnings>
>;

// comparison level -> task id -> expanded dependencies
export type DependencyMap = Map<number, Map<string, ExpandedDependency[]>>;

// comparison level -> task id -> expanded dependents
export type DependentMap = Map<number, Map<string, ExpandedDependent[]>>;

// comparison level -> task id -> dependency id -> difference in milliseconds between edges of dependency
export type DependencyMargins = Map<number, Map<string, Map<string, number>>>;

// comparison level -> task id -> task has a dependency with a warning
export type TaskToHasDependencyWarningMap = Map<number, Set<string>>;

export type CriticalPath = {
  tasks: Set<string>;
  dependencies: Map<string, Set<string>>;
};

export type MinAndMaxChildsOfTask = [
  [
    /**
     * First min
     */
    Task | null,
    /**
     * Second min
     */
    Task | null
  ],
  [
    /**
     * First max
     */
    Task | null,
    /**
     * Second max
     */
    Task | null
  ]
];

// comparison level -> task id -> [[first min, second min], [first max, second max]]
export type MinAndMaxChildsMap = Map<
  number,
  Map<string, MinAndMaxChildsOfTask>
>;

// comparison level -> critical path
export type CriticalPaths = Map<number, CriticalPath>;

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
  originalTask: Task;
  taskRootNode: Element;
  tsDiff: number;
};

export type GetMetadata = (task: TaskOrEmpty) => ChangeMetadata;

export type ColumnData = {
  canMoveTasks: boolean;
  dateSetup: DateSetup;
  depth: number;
  dependencies: Task[];
  distances: Distances;
  handleAddTask: (task: Task) => void;
  handleDeleteTasks: (task: TaskOrEmpty[]) => void;
  handleEditTask: (task: TaskOrEmpty) => void;
  hasChildren: boolean;
  icons?: Partial<Icons>;
  indexStr: string;
  isClosed: boolean;
  isShowTaskNumbers: boolean;
  onExpanderClick: (task: Task) => void;
  task: TaskOrEmpty;
};

export type ColumnProps = {
  data: ColumnData;
};

export type Column = {
  id: string;
  Cell: ComponentType<ColumnProps>;
  width: number;
  title?: ReactNode;
  canResize?: boolean;
};

export type OnResizeColumn = (
  nextColumns: readonly Column[],
  columnIndex: number,
  deltaWidth: number
) => void;
export type ChangeAction =
  | {
      type: "add-childs";
      parent: Task;
      // comparison level -> task id
      addedIdsMap: Map<number, Set<string>>;
      addedChildsByLevelMap: ChildByLevelMap;
      addedRootsByLevelMap: RootMapByLevel;
      descendants: readonly TaskOrEmpty[];
    }
  | {
      type: "change";
      task: TaskOrEmpty;
    }
  | {
      type: "change_start_and_end";
      task: Task;
      changedTask: Task;
      originalTask: Task;
    }
  | {
      type: "delete";
      tasks: readonly TaskOrEmpty[];
      // comparison level -> task id
      deletedIdsMap: Map<number, Set<string>>;
    }
  | {
      type: "move-before";
      target: TaskOrEmpty;
      taskForMove: TaskOrEmpty;
    }
  | {
      type: "move-after";
      target: TaskOrEmpty;
      taskForMove: TaskOrEmpty;
    }
  | {
      type: "move-inside";
      parent: Task;
      childs: readonly TaskOrEmpty[];
      // comparison level -> task id
      movedIdsMap: Map<number, Set<string>>;
    };

export type ChangeMetadata = [
  /**
   * dependent tasks
   */
  Task[],
  /**
   * indexes in list of tasks
   */
  Array<{
    task: TaskOrEmpty;
    index: number;
  }>,
  /**
   * array of parents of the task
   */
  Task[],
  /**
   * array of suggesgions for change parent
   */
  OnDateChangeSuggestionType[]
];

export type ContextMenuType = {
  task: TaskOrEmpty | null;
  x: number;
  y: number;
};

export type ActionMetaType = {
  /**
   * Check is task id exists at current level (1 by default)
   */
  checkTaskIdExists: CheckTaskIdExistsAtLevel;
  /**
   * Copy all selected tasks
   */
  copySelectedTasks: () => void;
  /**
   * Copy single task
   * @param task the task
   */
  copyTask: (task: TaskOrEmpty) => void;
  /**
   * Cut all selected tasks
   */
  cutSelectedTasks: () => void;
  /**
   * Cut single task
   * @param task the task
   */
  cutTask: (task: TaskOrEmpty) => void;
  /**
   * @returns List of parent tasks under copy action
   */
  getCopyParentTasks: () => readonly TaskOrEmpty[];
  /**
   * @returns List of tasks under copy action
   */
  getCopyTasks: () => readonly TaskOrEmpty[];
  /**
   * @returns List of tasks with all their descendants under copy action
   */
  getCopyTasksWithDescendants: () => readonly TaskOrEmpty[];
  /**
   * @returns List of parent tasks under cut action
   */
  getCutParentTasks: () => readonly TaskOrEmpty[];
  /**
   * @returns List of tasks under cut action
   */
  getCutTasks: () => readonly TaskOrEmpty[];
  /**
   * @returns List of parent tasks
   */
  getParentTasks: () => readonly TaskOrEmpty[];
  /**
   * @returns List of selected tasks
   */
  getSelectedTasks: () => readonly TaskOrEmpty[];
  /**
   * @returns List of tasks with all their descendants
   */
  getTasksWithDescendants: () => readonly TaskOrEmpty[];
  /**
   * Add childs to the container task
   * @param parent the container task
   * @param descendants list of added childs with their descendants
   */
  handleAddChilds: (parent: Task, descendants: readonly TaskOrEmpty[]) => void;
  /**
   * Delete tasks
   * @param tasksForDelete list of tasks for delete
   */
  handleDeleteTasks: (tasksForDelete: readonly TaskOrEmpty[]) => void;
  /**
   * Move tasks to the container task
   * @param parent the container task
   * @param childs list of moved tasks
   */
  handleMoveTasksInside: (parent: Task, childs: readonly TaskOrEmpty[]) => void;
  /**
   * Make copies of the list of tasks
   */
  makeCopies: (tasks: readonly TaskOrEmpty[]) => readonly TaskOrEmpty[];
  /**
   * Reset selection
   */
  resetSelectedTasks: () => void;
  /**
   * Task that triggered context menu
   */
  task: TaskOrEmpty;
};

export type CheckIsAvailableMetaType = {
  /**
   *
   * @returns Check are there tasks under the copy action
   */
  checkHasCopyTasks: () => boolean;
  /**
   *
   * @returns Check are there tasks under the cut action
   */
  checkHasCutTasks: () => boolean;
  /**
   * Context menu trigger task
   */
  task: TaskOrEmpty;
};

export type ContextMenuOptionType = {
  /**
   * Invokes on click on menu option
   * @param meta Metadata for the action
   */
  action: (meta: ActionMetaType) => void;
  /**
   * Check is the current action available. Available by default
   * @param meta Metadata for checking
   */
  checkIsAvailable?: (meta: CheckIsAvailableMetaType) => void;
  label: ReactNode;
  icon?: ReactNode;
};

export type CheckTaskIdExistsAtLevel = (
  newId: string,
  comparisonLevel?: number
) => boolean;

export type GetCopiedTaskId = (
  task: TaskOrEmpty,
  checkExists: (newId: string) => boolean
) => string;

export type AdjustTaskToWorkingDatesParams = {
  action: BarMoveAction;
  changedTask: Task;
  originalTask: Task;
  roundDate: (
    date: Date,
    action: BarMoveAction,
    dateExtremity: DateExtremity
  ) => Date;
};
