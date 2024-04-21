import React, { FC, useCallback, useMemo, useState } from "react";

import {
  ColumnProps,
  Gantt,
  GanttTheme,
  OnChangeTasks,
  Task,
  TaskOrEmpty,
  useTaskListColumnsBuilder,
  ViewMode,
} from "../src";

import { initTasksWithoutProject, onAddTask, onEditTask } from "./helper";

type AppProps = {
  ganttHeight?: number;
};

const DescriptionColumn: FC<ColumnProps> = ({ data }) => {
  if (data.task.type === "task") {
    return data.task.payload?.description;
  }

  return null;
};

export const CustomPalette: React.FC<AppProps> = props => {
  const [tasks, setTasks] = useState<readonly TaskOrEmpty[]>(() => {
    const initTasks = initTasksWithoutProject();
    const firstTask = initTasks[0];
    if (firstTask.type === "task") {
      firstTask.payload = {
        description: "First Description 1",
      };
    }
    return initTasks;
  });
  const [viewMode, setView] = React.useState<ViewMode>(ViewMode.Day);
  const columnsBuilder = useTaskListColumnsBuilder();
  const customTheme = useMemo(() => {
    return {
      colors: {
        arrowColor: "#00CED1",
      },
      distances: {
        viewModeYearOffsetYears: 10,
      },
      dateFormats: {
        weekBottomHeader: (_, weekNumber) => {
          return `НЕД${weekNumber}`;
        },
      },
    } as Partial<GanttTheme>;
  }, []);

  const columns = useMemo(() => {
    return [
      columnsBuilder.createNameColumn("Name", 200),
      {
        id: "Description",
        title: "Description",
        width: 60,
        component: DescriptionColumn,
      },
      columnsBuilder.createStartDateColumn("Start Date", 130),
      columnsBuilder.createEndDateColumn("End Date", 130),
    ];
  }, [columnsBuilder]);

  const onChangeTasks = useCallback<OnChangeTasks>(
    (newTaskOrEmptys, action) => {
      const newTasks: Task[] = newTaskOrEmptys.map(task => task as Task);
      switch (action.type) {
        case "delete_relation":
          if (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            window.confirm(
              `Do yo want to remove relation between ${action.payload.taskFrom.name} and ${action.payload.taskTo.name}?`
            )
          ) {
            setTasks(newTasks);
          }
          break;

        case "delete_task":
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          if (window.confirm("Are you sure?")) {
            setTasks(newTasks);
          }
          break;

        default:
          console.debug("action", action);
          // eslint-disable-next-line no-case-declarations
          const taskWithChildrenIds = newTasks.map((task: Task) => task.parent);
          newTasks.map((task: Task) => {
            if (taskWithChildrenIds.includes(task.id)) {
              task.type = "project";
            } else if (task.start && task.start === task.end) {
              task.type = "milestone";
            }
          });
          setTasks(newTasks);
          break;
      }
    },
    []
  );

  const handleDblClick = useCallback((task: Task) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    alert("On Double Click event Id:" + task.id);
  }, []);

  const handleClick = useCallback((task: TaskOrEmpty) => {
    console.log("On Click event Id:" + task.id);
  }, []);

  const handleWheel = (wheelEvent: WheelEvent) => {
    // eslint-disable-next-line
    const deltaY = (wheelEvent as any).deltaY;

    if (deltaY < 0 && viewMode !== ViewMode.Hour) {
      const currentIndex = Object.values(ViewMode).indexOf(viewMode);
      const newZoomLevel = Object.values(ViewMode)[currentIndex - 1];
      if (newZoomLevel) {
        setView(newZoomLevel);
      }
    } else if (deltaY > 0 && viewMode !== ViewMode.Month) {
      const currentIndex = Object.values(ViewMode).indexOf(viewMode);
      const newZoomLevel = Object.values(ViewMode)[currentIndex + 1];
      if (newZoomLevel) {
        setView(newZoomLevel);
      }
    }
  };

  const onChangeExpandState = (changedTask: Task) => {
    setTasks(prev => {
      return prev.map(task => {
        if (changedTask.id === task.id) {
          return { ...changedTask };
        }
        return task;
      });
    });
  };

  return (
    <Gantt
      {...props}
      // columns={columns}
      theme={customTheme}
      onAddTask={onAddTask}
      onChangeTasks={onChangeTasks}
      onDoubleClick={handleDblClick}
      onEditTask={onEditTask}
      onClick={handleClick}
      tasks={tasks}
      viewMode={viewMode}
      roundEndDate={(date: Date) => date}
      roundStartDate={(date: Date) => date}
      onWheel={handleWheel}
      onChangeExpandState={onChangeExpandState}
      enableTableListContextMenu={1}
      isAdjustToWorkingDates={false}
      isProgressChangeable={() => true}
      allowMoveTask={(_, method) => {
        return method !== "inside";
      }}
    />
  );
};
