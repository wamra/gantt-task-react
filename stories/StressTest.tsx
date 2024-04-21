import React, { useCallback, useEffect, useState } from "react";

import { addDays } from "date-fns";

import { Gantt, OnCommitTasks, Task, TaskOrEmpty } from "../src";

import { onAddTask, onEditTask } from "./helper";

// 4 * ()

type AppProps = {
  numberOfRoots: number;
  numberOfSubtasks: number;
  depth: number;
};

const initSubtasks = (
  res: Task[],
  parentId: string,
  parentStartDate: Date,
  parentName: string,
  currentDepth: number,
  numberOfSubtasks: number,
  depth: number
) => {
  const restDepth = depth - currentDepth;
  const taskDuration = Math.pow(numberOfSubtasks, restDepth);

  let prevTaskId: string | null = null;

  for (let j = 0; j < numberOfSubtasks; ++j) {
    const taskId = `${parentId}/task_${j + 1}`;
    const taskName = `${parentName}.${j + 1}`;

    const startDate = addDays(parentStartDate, j * taskDuration);
    const endDate = addDays(parentStartDate, (j + 1) * taskDuration);

    const task: Task = {
      start: startDate,
      end: endDate,
      name: taskName,
      id: taskId,
      progress: 45,
      type: "task",
      parent: parentId,
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

    if (restDepth > 0) {
      initSubtasks(
        res,
        taskId,
        startDate,
        taskName,
        currentDepth + 1,
        numberOfSubtasks,
        depth
      );
    }
  }
};

const initTasks = (
  numberOfRoots: number,
  numberOfSubtasks: number,
  depth: number
) => {
  const res: Task[] = [];

  const firstStartDate = new Date();
  const firstEndDate = addDays(
    firstStartDate,
    Math.pow(numberOfSubtasks, depth)
  );

  for (let i = 0; i < numberOfRoots; ++i) {
    const projectStartDate = addDays(firstStartDate, i);
    const projectEndDate = addDays(firstEndDate, i);

    const projectId = `project_${i + 1}`;
    const projectName = `Project #${i + 1}`;

    const project: Task = {
      start: projectStartDate,
      end: projectEndDate,
      name: projectName,
      id: projectId,
      progress: 25,
      type: "project",
    };

    res.push(project);

    initSubtasks(
      res,
      projectId,
      projectStartDate,
      `Task #${i + 1}`,
      1,
      numberOfSubtasks,
      depth
    );
  }

  return res;
};

export const StressTest: React.FC<AppProps> = ({
  numberOfRoots,
  numberOfSubtasks,
  depth,
}) => {
  const [tasks, setTasks] = useState<readonly TaskOrEmpty[]>(() =>
    initTasks(numberOfRoots, numberOfSubtasks, depth)
  );

  useEffect(() => {
    setTasks(initTasks(numberOfRoots, numberOfSubtasks, depth));
  }, [numberOfRoots, numberOfSubtasks, depth]);

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
      onAddTaskAction={onAddTask}
      onCommitTasks={onChangeTasks}
      onDoubleClick={handleDblClick}
      onEditTaskAction={onEditTask}
      onClick={handleClick}
      tasks={tasks}
    />
  );
};
