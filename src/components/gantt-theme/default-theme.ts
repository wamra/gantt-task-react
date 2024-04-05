import {GanttTheme} from "../../types/public-types";

export const DEFAULT_THEME: GanttTheme = {
  colors: {
    arrowColor: "grey",
    arrowCriticalColor: "#ff0000",
    arrowWarningColor: "#ffbc00",
    barProgressColor: "#a3a3ff",
    barProgressCriticalColor: "#ff1919",
    barProgressSelectedColor: "#8282f5",
    barProgressSelectedCriticalColor: "#ff0000",
    barBackgroundColor: "#b8c2cc",
    barBackgroundCriticalColor: "#ff6363",
    barBackgroundSelectedColor: "#aeb8c2",
    barBackgroundSelectedCriticalColor: "#ff8e8e",
    groupProgressColor: "#2dbb2e",
    groupProgressCriticalColor: "#2dbb2e",
    groupProgressSelectedColor: "#28a329",
    groupProgressSelectedCriticalColor: "#28a329",
    groupBackgroundColor: "#006bc1",
    groupBackgroundCriticalColor: "#006bc1",
    groupBackgroundSelectedColor: "#407fbf",
    groupBackgroundSelectedCriticalColor: "#407fbf",
    projectProgressColor: "#7db59a",
    projectProgressCriticalColor: "#7db59a",
    projectProgressSelectedColor: "#59a985",
    projectProgressSelectedCriticalColor: "#59a985",
    projectBackgroundColor: "#fac465",
    projectBackgroundCriticalColor: "#fac465",
    projectBackgroundSelectedColor: "#f7bb53",
    projectBackgroundSelectedCriticalColor: "#f7bb53",
    milestoneBackgroundColor: "#f1c453",
    milestoneBackgroundCriticalColor: "#ff8e8e",
    milestoneBackgroundSelectedColor: "#f29e4c",
    milestoneBackgroundSelectedCriticalColor: "#ff0000",
    evenTaskBackgroundColor: "#f5f5f5",
    holidayBackgroundColor: "rgba(233, 233, 233, 0.3)",
    selectedTaskBackgroundColor: "rgba(252, 248, 227, 0.5)",
    taskDragColor: "#7474ff",
    todayColor: "rgba(252, 248, 227, 0.5)",
    contextMenuBoxShadow: "rgb(0 0 0 / 25%) 1px 1px 5px 1px",
    contextMenuBgColor: "#fff",
    contextMenuTextColor: "inherit",
  },
  typography: {
    fontSize: '14px',
    fontFamily: "Arial, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue",
  },
  distances: {
    actionColumnWidth: 40,
    arrowIndent: 20,
    barCornerRadius: 3,
    barFill: 60,
    columnWidth: 60,
    contextMenuIconWidth: 20,
    contextMenuOptionHeight: 25,
    contextMenuSidePadding: 10,
    dateCellWidth: 220,
    dependenciesCellWidth: 120,
    dependencyFixHeight: 20,
    dependencyFixIndent: 50,
    dependencyFixWidth: 20,
    expandIconWidth: 20,
    handleWidth: 8,
    headerHeight: 50,
    ganttHeight: 600,
    minimumRowDisplayed: 4,
    nestedTaskNameOffset: 20,
    relationCircleOffset: 10,
    relationCircleRadius: 5,
    rowHeight: 50,
    taskWarningOffset: 35,
    titleCellWidth: 220,
  },
  dateFormats: {
    dateColumnFormat: "E, d MMMM yyyy",
    dayBottomHeaderFormat: "E, d",
    dayTopHeaderFormat: "E, d",
    hourBottomHeaderFormat: "HH",
    monthBottomHeaderFormat: "LLL",
    monthTopHeaderFormat: "LLLL",
  }
};
