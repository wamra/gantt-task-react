import React, { useCallback, useState } from "react";

import addDays from "date-fns/addDays";

import { Gantt, OnChangeTasks, Task, TaskOrEmpty } from "../src";

import { onAddTask, onEditTask } from "./helper";

import "../dist/style.css";

const NUMBER_OF_SUBTASKS = 6;

type AppProps = {
  ganttHeight?: number;
};

const initTasks = () => {
  const res: Task[] = [];

  const projectStartDate = new Date();
  const projectEndDate = addDays(projectStartDate, NUMBER_OF_SUBTASKS);

  const projectId = "project";
  const projectName = "Project";

  const project: Task = {
    start: projectStartDate,
    end: projectEndDate,
    name: projectName,
    id: projectId,
    progress: 25,
    type: "project",
  };

  res.push(project);

  for (let j = 0; j < NUMBER_OF_SUBTASKS; ++j) {
    const taskId = `${projectId}/not_connected_task_${j + 1}`;
    const taskName = `Not connected task ${j + 1}`;

    const task: Task = {
      start: addDays(projectStartDate, j),
      end: addDays(projectStartDate, j + 1),
      name: taskName,
      id: taskId,
      progress: 45,
      type: "task",
      parent: projectId,
    };

    res.push(task);
  }

  let prevTaskId: string | null = null;

  for (let j = 0; j < NUMBER_OF_SUBTASKS; ++j) {
    const taskId = `${projectId}/task_${j + 1}`;
    const taskName = `Task ${j + 1}`;

    const task: Task = {
      start: addDays(projectStartDate, j),
      end: addDays(projectStartDate, j + 1),
      name: taskName,
      id: taskId,
      progress: 45,
      type: "task",
      parent: projectId,
      dependencies: prevTaskId
        ? [
            {
              ownTarget: "startOfTask",
              sourceTarget: "endOfTask",
              sourceId: prevTaskId,
            },
          ]
        : undefined,
    };

    prevTaskId = taskId;

    res.push(task);
  }

  return res;
};

export const CriticalPath: React.FC<AppProps> = props => {
  const [tasks, setTasks] = useState<readonly TaskOrEmpty[]>(initTasks);

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

  const handleClick = useCallback((task: Task) => {
    console.log("On Click event Id:" + task.id);
  }, []);

  return (
    <Gantt
      isShowCriticalPath
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
