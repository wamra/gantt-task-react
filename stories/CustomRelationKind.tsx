import React, { useCallback, useState } from "react";

import {
  Gantt,
  OnChangeTasks,
  OnRelationChange,
  RelationKind,
  DateExtremity,
  Task,
  TaskOrEmpty,
} from "../src";

import { initTasks, onAddTask, onEditTask } from "./helper";

import "../dist/style.css";

export const CustomRelationKind: React.FC = props => {
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

  const authorizedRelations: RelationKind[] = ["endToStart"];

  const handleRelationChange: OnRelationChange = (
    from: [Task, DateExtremity, number],
    to: [Task, DateExtremity, number]
  ) => {
    if (from[0].id !== to[0].id) {
      alert(`Relation between ${from[0].id} and ${to[0].id}`);
    }
  };

  return (
    <Gantt
      {...props}
      authorizedRelations={authorizedRelations}
      onAddTask={onAddTask}
      onChangeTasks={onChangeTasks}
      onDoubleClick={handleDblClick}
      onEditTask={onEditTask}
      onClick={handleClick}
      tasks={tasks}
      onRelationChange={handleRelationChange}
    />
  );
};
