import React, { useCallback, useState } from "react";

import {
  Gantt,
  OnChangeTasks,
  Task,
  TaskOrEmpty,
  ViewMode,
} from "../src";

import { initTasks, onAddTask, onEditTask } from "./helper";

import "../dist/style.css";

type AppProps = {
  ganttHeight?: number;
};

export const CustomPalette: React.FC<AppProps> = props => {
  const [tasks, setTasks] = useState<readonly TaskOrEmpty[]>(initTasks());
  const [viewMode, setView] = React.useState<ViewMode>(ViewMode.Day);

  const onChangeTasks = useCallback<OnChangeTasks>(
    (newTaskOrEmptys, action) => {
      const newTasks: Task[] = newTaskOrEmptys.map(task => task as Task);
      switch (action.type) {
        case "delete_relation":
          if (
            // @ts-ignore
            window.confirm(
              `Do yo want to remove relation between ${action.payload.taskFrom.name} and ${action.payload.taskTo.name}?`
            )
          ) {
            setTasks(newTasks);
          }
          break;

        case "delete_task":
          // @ts-ignore
          if (window.confirm("Are you sure?")) {
            setTasks(newTasks);
          }
          break;

        default:
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
    // @ts-ignore
    alert("On Double Click event Id:" + task.id);
  }, []);

  const handleClick = useCallback((task: TaskOrEmpty) => {
    console.log("On Click event Id:" + task.id);
  }, []);

  const handleWheel = (wheelEvent: WheelEvent) => {
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
    />
  );
};
