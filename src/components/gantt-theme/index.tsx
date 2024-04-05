import React, {PropsWithChildren, useMemo} from "react";
import {ColorStyles} from "../../types/public-types";
import {DEFAULT_THEME} from "./default-theme";

export interface GanttThemeProps extends PropsWithChildren<any> {
  theme?: ColorStyles
}

export const GanttTheme: React.FC<GanttThemeProps> = ({children, theme = DEFAULT_THEME}) => {
  const ganttVariables = useMemo(() => {
    return ({
      '--gantt-arrow-color': theme.arrowColor,
      '--gantt-arrow-warning-color': theme.arrowWarningColor,
      '--gantt-arrow-critical-color': theme.arrowCriticalColor,

      '--gantt-bar-progress-color': theme.barProgressColor,
      '--gantt-bar-progress-critical-color': theme.barProgressCriticalColor,
      '--gantt-bar-progress-selected-critical-color': theme.barProgressSelectedCriticalColor,
      '--gantt-bar-progress-selected-color': theme.barProgressSelectedColor,
      '--gantt-group-progress-color': theme.groupProgressColor,
      '--gantt-group-progress-selected-color': theme.groupProgressSelectedColor,
      '--gantt-group-progress-critical-color': theme.groupProgressCriticalColor,
      '--gantt-group-progress-selected-critical-color': theme.groupProgressSelectedCriticalColor,
      '--gantt-group-background-selected-critical-color': theme.groupBackgroundSelectedCriticalColor,
      '--gantt-group-background-critical-color': theme.groupBackgroundCriticalColor,
      '--gantt-bar-background-selected-critical-color': theme.barBackgroundSelectedCriticalColor,
      '--gantt-bar-background-critical-color': theme.barBackgroundCriticalColor,
      '--gantt-group-background-selected-color': theme.groupBackgroundSelectedColor,
      '--gantt-group-background-color': theme.groupBackgroundColor,
      '--gantt-bar-background-selected-color': theme.barBackgroundSelectedColor,
      '--gantt-bar-background-color': theme.barBackgroundColor,

      '--gantt-project-progress-color': theme.projectProgressColor,
      '--gantt-project-progress-selected-color': theme.projectProgressSelectedColor,
      '--gantt-project-progress-critical-color': theme.projectProgressCriticalColor,
      '--gantt-project-progress-selected-critical-color': theme.projectProgressSelectedCriticalColor,
      '--gantt-project-background-color': theme.projectBackgroundColor,
      '--gantt-project-background-selected-color': theme.projectBackgroundSelectedColor,
      '--gantt-project-background-critical-color': theme.projectBackgroundCriticalColor,
      '--gantt-project-background-selected-critical-color': theme.projectBackgroundSelectedCriticalColor,

      '--gantt-milestone-background-selected-critical-color': theme.milestoneBackgroundSelectedCriticalColor,
      '--gantt-milestone-background-critical-color': theme.milestoneBackgroundCriticalColor,
      '--gantt-milestone-background-selected-color': theme.milestoneBackgroundSelectedColor,
      '--gantt-milestone-background-color': theme.milestoneBackgroundColor,

      '--gantt-selected-task-background-color': theme.selectedTaskBackgroundColor,
      '--gantt-even-task-background-color': theme.evenTaskBackgroundColor,
      '--gantt-holiday-background-color': theme.holidayBackgroundColor,
      '--gantt-task-drag-color': theme.taskDragColor,
      '--gantt-today-color': theme.todayColor,

      '--gantt-context-menu-bg-color': theme.contextMenuBgColor,
      '--gantt-context-menu-text-color': theme.contextMenuTextColor,
      '--gantt-context-menu-box-shadow': theme.contextMenuBoxShadow,

      '--gantt-font-family': theme.fontFamily,
      '--gantt-font-size': theme.fontSize,
    })

  }, [theme])

  return (
    // @ts-ignore
    <div className={'gantt-theme'} style={ganttVariables}>
      {children}
    </div>
  )
}
