import { DateFormats, Distances } from "./common-types";

export interface GanttPartialTheme {
  rtl?: boolean;
  colors?: Partial<ColorStyles>;
  shape?: Partial<ShapeStyles>;
  typography?: Partial<TypographyStyles>;
  distances?: Partial<Distances>;
  dateFormats?: Partial<DateFormats>;
}

export interface GanttTheme {
  rtl?: boolean;
  colors: ColorStyles;
  shape: ShapeStyles;
  typography: TypographyStyles;
  distances: Distances;
  dateFormats: DateFormats;
}

export interface TypographyStyles {
  fontFamily: string;
  fontSize: string;
}

export interface ShapeStyles {
  borderRadius: string;
}

export interface ColorStyles {
  backgroundColor: string;
  arrowColor: string;
  arrowRelationColor: string;
  dividerColor: string;
  hoverFilter: string;

  arrowCriticalColor: string;
  barHandleColor: string;
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
  calendarHolidayColor: string;
  arrowHoverColor: string;

  tableDragTaskBackgroundColor: string;
  tableSelectedTaskBackgroundColor: string;
  tableActionColor: string;
  tableDragIndicatorColor: string;
  tableHoverActionColor: string;
  tableEvenBackgroundColor: string;

  calendarTodayColor: string;
  contextMenuBoxShadow: string;
  contextMenuBgColor: string;
  contextMenuTextColor: string;
  tooltipBoxShadow: string;
  scrollbarThumbColor: string;

  calendarStrokeColor: string;
  primaryTextColor: string;
  secondaryTextColor: string;
}
