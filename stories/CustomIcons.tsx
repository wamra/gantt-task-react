import React, { useCallback, useState } from "react";

import {
  Distances,
  Gantt,
  GanttRenderIconsProps,
  OnCommitTasks,
  Task,
  TaskOrEmpty,
  ViewMode,
} from "../src";

import { initTasks, onAddTask, onEditTask } from "./helper";

const icons: GanttRenderIconsProps = {
  renderAddIcon: () => <>➕</>,
  renderClosedIcon: () => <>📁</>,
  renderDeleteIcon: () => <>➖</>,
  renderEditIcon: () => <>🗃</>,
  renderNoChildrenIcon: () => <>🥳</>,
  renderOpenedIcon: () => <>📂</>,
};

const distances: Partial<Distances> = {
  expandIconWidth: 30,
};

type AppProps = {
  ganttHeight?: number;
};

export const CustomIcons: React.FC<AppProps> = props => {
  const [tasks, setTasks] = useState<readonly TaskOrEmpty[]>(initTasks());

  const onChangeTasks = useCallback<OnCommitTasks>((nextTasks, action) => {
    switch (action.type) {
      case "delete_relation":
        if (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          window.confirm(
            `Do yo want to remove relation between ${action.payload.taskFrom.name} and ${action.payload.taskTo.name}?`
          )
        ) {
          setTasks(nextTasks);
        }
        break;

      case "delete_task":
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (window.confirm("Are you sure?")) {
          setTasks(nextTasks);
        }
        break;

      default:
        setTasks(nextTasks);
        break;
    }
  }, []);

  const handleDblClick = useCallback((task: Task) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    alert("On Double Click event Id:" + task.id);
  }, []);

  const handleClick = useCallback((task: TaskOrEmpty) => {
    console.log("On Click event Id:" + task.id);
  }, []);

  return (
    <Gantt
      {...props}
      theme={{
        distances
      }}
      icons={icons}
      onAddTaskAction={onAddTask}
      onCommitTasks={onChangeTasks}
      onDoubleClick={handleDblClick}
      onEditTaskAction={onEditTask}
      onClick={handleClick}
      tasks={tasks}
      viewMode={ViewMode.Day}
    />
  );
};
