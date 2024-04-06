import React, { useCallback, useState } from "react";

import { Gantt, OnChangeTasks, Task, TaskOrEmpty } from "../src";

import { initTasks, onAddTask, onEditTask } from "./helper";

type AppProps = {
  ganttHeight?: number;
};

export const Comparison: React.FC<AppProps> = props => {
  const [tasks, setTasks] = useState<readonly TaskOrEmpty[]>(() => {
    const firstLevelTasks = initTasks();

    const secondLevelTasks = firstLevelTasks.map<Task>(task => ({
      ...task,
      comparisonLevel: 2,
    } as Task));

    return [...firstLevelTasks, ...secondLevelTasks];
  });

  const onChangeTasks = useCallback<OnChangeTasks>((nextTasks, action) => {
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
      comparisonLevels={2}
      {...props}
      onAddTask={onAddTask}
      onChangeTasks={onChangeTasks}
      onDoubleClick={handleDblClick}
      onEditTask={onEditTask}
      onClick={handleClick}
      isShowTaskNumbers={false}
      tasks={tasks}
      isAdjustToWorkingDates={false}
    />
  );
};
