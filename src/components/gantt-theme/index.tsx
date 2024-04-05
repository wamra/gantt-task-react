import React, { PropsWithChildren, useMemo } from "react";
import { GanttTheme } from "../../types/public-types";

export interface GanttThemeProps extends PropsWithChildren<any> {
  theme: GanttTheme;
}

export const GanttThemeProvider: React.FC<GanttThemeProps> = ({
  children,
  theme,
}) => {
  const ganttVariables = useMemo(() => {
    const { colors, typography, shape } = theme;
    return {
      "--gantt-background-color": colors.backgroundColor,
      "--gantt-arrow-color": colors.arrowColor,
      "--gantt-arrow-fix-color": colors.arrowFixColor,
      "--gantt-arrow-relation-color": colors.arrowRelationColor,
      "--gantt-arrow-hover-color": colors.arrowHoverColor,
      "--gantt-arrow-warning-color": colors.arrowWarningColor,
      "--gantt-arrow-critical-color": colors.arrowCriticalColor,
      "--gantt-hover-filter": colors.hoverFilter,

      "--gantt-bar-progress-color": colors.barProgressColor,
      "--gantt-bar-progress-critical-color": colors.barProgressCriticalColor,
      "--gantt-bar-progress-selected-critical-color":
        colors.barProgressSelectedCriticalColor,
      "--gantt-bar-progress-selected-color": colors.barProgressSelectedColor,
      "--gantt-group-progress-color": colors.groupProgressColor,
      "--gantt-group-progress-selected-color":
        colors.groupProgressSelectedColor,
      "--gantt-group-progress-critical-color":
        colors.groupProgressCriticalColor,
      "--gantt-group-progress-selected-critical-color":
        colors.groupProgressSelectedCriticalColor,
      "--gantt-group-background-selected-critical-color":
        colors.groupBackgroundSelectedCriticalColor,
      "--gantt-group-background-critical-color":
        colors.groupBackgroundCriticalColor,
      "--gantt-bar-background-selected-critical-color":
        colors.barBackgroundSelectedCriticalColor,
      "--gantt-bar-background-critical-color":
        colors.barBackgroundCriticalColor,
      "--gantt-group-background-selected-color":
        colors.groupBackgroundSelectedColor,
      "--gantt-group-background-color": colors.groupBackgroundColor,
      "--gantt-bar-background-selected-color":
        colors.barBackgroundSelectedColor,
      "--gantt-bar-background-color": colors.barBackgroundColor,

      "--gantt-project-progress-color": colors.projectProgressColor,
      "--gantt-project-progress-selected-color":
        colors.projectProgressSelectedColor,
      "--gantt-project-progress-critical-color":
        colors.projectProgressCriticalColor,
      "--gantt-project-progress-selected-critical-color":
        colors.projectProgressSelectedCriticalColor,
      "--gantt-project-background-color": colors.projectBackgroundColor,
      "--gantt-project-background-selected-color":
        colors.projectBackgroundSelectedColor,
      "--gantt-project-background-critical-color":
        colors.projectBackgroundCriticalColor,
      "--gantt-project-background-selected-critical-color":
        colors.projectBackgroundSelectedCriticalColor,

      "--gantt-milestone-background-selected-critical-color":
        colors.milestoneBackgroundSelectedCriticalColor,
      "--gantt-milestone-background-critical-color":
        colors.milestoneBackgroundCriticalColor,
      "--gantt-milestone-background-selected-color":
        colors.milestoneBackgroundSelectedColor,
      "--gantt-milestone-background-color": colors.milestoneBackgroundColor,



      "--gantt-context-menu-bg-color": colors.contextMenuBgColor,
      "--gantt-context-menu-text-color": colors.contextMenuTextColor,
      "--gantt-context-menu-box-shadow": colors.contextMenuBoxShadow,

      "--gant--tooltip-box-shadow": colors.tooltipBoxShadow,

      "--gantt-divider-color": colors.dividerColor,

      "--gantt-table-selected-task-background-color": colors.tableSelectedTaskBackgroundColor,
      "--gantt-table-resize-hover-color": colors.tableResizeHoverColor,
      "--gantt-table-action-color": colors.tableActionColor,
      "--gantt-table-even-background-color": colors.tableEvenBackgroundColor,
      "--gantt-table-drag-task-background-color": colors.tableDragTaskBackgroundColor,

      "--gantt-scrollbar-thumb-color": colors.scrollbarThumbColor,
      "--gantt-calendar-stroke-color": colors.calendarStrokeColor,
      "--gantt-calendar-holiday-color": colors.calendarHolidayColor,
      "--gantt-calendar-today-color": colors.calendarTodayColor,

      "--gantt-primary-text-color": colors.primaryTextColor,
      "--gantt-secondary-text-color": colors.secondaryTextColor,

      "--gantt-font-family": typography.fontFamily,
      "--gantt-font-size": typography.fontSize,

      "--gantt-shape-border-radius": shape.borderRadius,


    };
  }, [theme]);

  return (
    // @ts-ignore
    <div className={"gantt-theme"} style={ganttVariables}>
      {children}
    </div>
  );
};

export * from "./gantt-theme-builder";
