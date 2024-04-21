import { CSSProperties } from "react";
import type { Locale as DateLocale } from "date-fns";

export type TaskBarMoveAction = "progress" | "end" | "start" | "move";

export type RelationMoveTarget = "startOfTask" | "endOfTask";

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

export type TaskType = "task" | "milestone" | "project";

export type TaskId = string;

export interface Dependency {
  sourceId: string;
  sourceTarget: RelationMoveTarget;
  ownTarget: RelationMoveTarget;
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
  weekBottomHeader: (
    date: Date,
    weekNumber: number,
    locale?: DateLocale
  ) => string;
}

export interface Task {
  id: TaskId;
  type: TaskType;
  name: string;
  start: Date;
  end: Date;
  /**
   * From 0 to 100
   */
  progress: number;
  assignees?: string[];
  style?: CSSProperties;
  isDisabled?: boolean;
  /**
   * Project or task
   */
  parent?: string;
  dependencies?: Dependency[];
  hideChildren?: boolean;
  displayOrder?: number;
  comparisonLevel?: number;
  payload?: Record<string, string>;
}

export interface EmptyTask {
  id: string;
  type: "empty";
  name: string;
  parent?: string;
  comparisonLevel?: number;
  displayOrder?: number;
  isDisabled?: boolean;
}

export type TaskOrEmpty = Task | EmptyTask;

// comparison level -> task id -> array of child tasks
export type ChildByLevelMap = Map<number, Map<string, TaskOrEmpty[]>>;

// comparison level -> tasks that don't have parent
export type RootMapByLevel = Map<number, TaskOrEmpty[]>;

export interface DateSetup {
  dateFormats: DateFormats;
  dateLocale?: DateLocale;
  isUnknownDates: boolean;
  preStepsCount: number;
  viewMode: ViewMode;
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
  titleCellWidth: number;
  viewModeYearOffsetYears?: number;
  viewModeMonthOffsetMonths?: number;
  viewModeWeekOffsetWeeks?: number;
  viewModeDayOffsetDays?: number;
  viewModeHourOffsetHours?: number;
}
