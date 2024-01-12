import React, { useCallback, useState } from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  Column,
  ColumnProps,
  DateStartColumn,
  Gantt,
  OnChangeTasks,
  Task,
  TaskOrEmpty,
  TitleColumn,
} from "../src";

import { initTasks, onAddTask, onEditTask } from "./helper";

import "../dist/style.css";

const ProgressColumn: React.FC<ColumnProps> = ({ data: { task } }) => {
  if (task.type === "project" || task.type === "task") {
    return <>{task.progress}%</>;
  }

  return null;
};

const columns: readonly Column[] = [
  {
    component: DateStartColumn,
    width: 200,
    title: "Date of start",
  },
  {
    component: TitleColumn,
    width: 260,
    title: "Title",
  },
  {
    component: ProgressColumn,
    width: 80,
    title: "Progress",
  },
];

type AppProps = {
  ganttHeight?: number;
};

export const CustomColumns: React.FC<AppProps> = props => {
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

  const handleClick = useCallback((task: Task) => {
    console.log("On Click event Id:" + task.id);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Gantt
        {...props}
        columns={columns}
        onAddTask={onAddTask}
        onChangeTasks={onChangeTasks}
        onDoubleClick={handleDblClick}
        onEditTask={onEditTask}
        onClick={handleClick}
        tasks={tasks}
      />
    </DndProvider>
  );
};
