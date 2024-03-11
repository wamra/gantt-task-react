import React, { useCallback, useState } from "react";

import { Gantt, Task, TaskOrEmpty, OnChangeTasks } from "../src";

import { initTasks, onAddTask, onEditTask } from "./helper";

import "../dist/style.css";

type AppProps = {
  ganttHeight?: number;
};

export const Warnings: React.FC<AppProps> = props => {
  const [tasks, setTasks] = useState<readonly TaskOrEmpty[]>(initTasks());

  const onChangeTasks = useCallback<OnChangeTasks>((nextTasks, action) => {
    switch (action.type) {
      case "delete_relation":
        if (
          window.confirm(
            `Do yo want to remove relation between ${action.payload.taskFrom.name} and ${action.payload.taskTo.name}?`
          )
        ) {
          setTasks(nextTasks);
        }
        break;

      case "delete_task":
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
    alert("On Double Click event Id:" + task.id);
  }, []);

  const handleClick = useCallback((task: TaskOrEmpty) => {
    console.log("On Click event Id:" + task.id);
  }, []);

  return (
    <Gantt
      isRecountParentsOnChange={false}
      isShowChildOutOfParentWarnings
      isShowDependencyWarnings
      {...props}
      onAddTask={onAddTask}
      onChangeTasks={onChangeTasks}
      onDoubleClick={handleDblClick}
      onEditTask={onEditTask}
      onClick={handleClick}
      tasks={tasks}
    />
  );
};
