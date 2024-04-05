import React, { useCallback, useState } from "react";

import {
  Column,
  ColumnProps,
  DateEndColumn,
  DateStartColumn,
  Gantt,
  OnChangeTasks,
  OnResizeColumn,
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

type AppProps = {
  ganttHeight?: number;
};

enum TaskListColumnEnum {
  NAME = "Name",
  FROM = "From",
  TO = "To",
  PROGRESS = "Progress",
  ASSIGNEE = "Assignee",
}

export const getColumns = (
  columnTypes: TaskListColumnEnum[],
  displayColumns: boolean
) => {
  if (!displayColumns) {
    return new Map<TaskListColumnEnum, Column>();
  }
  const typeToColumn = new Map<TaskListColumnEnum, Column>();
  columnTypes.forEach(columnType => {
    if (columnType === TaskListColumnEnum.NAME) {
      typeToColumn.set(columnType, {
        component: TitleColumn,
        width: 210,
        title: "Name",
        id: TaskListColumnEnum.NAME,
      });
    } else if (columnType === TaskListColumnEnum.FROM) {
      typeToColumn.set(columnType, {
        component: DateStartColumn,
        width: 150,
        title: "Date of start",
        id: TaskListColumnEnum.FROM,
      });
    } else if (columnType === TaskListColumnEnum.TO) {
      typeToColumn.set(columnType, {
        component: DateEndColumn,
        width: 150,
        title: "Date of end",
        id: TaskListColumnEnum.TO,
      });
    } else if (columnType === TaskListColumnEnum.PROGRESS) {
      typeToColumn.set(columnType, {
        component: ProgressColumn,
        width: 40,
        title: "Progress",
        id: TaskListColumnEnum.PROGRESS,
      });
    }
  });

  return typeToColumn;
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

  const handleClick = useCallback((task: TaskOrEmpty) => {
    console.log("On Click event Id:" + task.id);
  }, []);

  
  const typeToColumn: Map<TaskListColumnEnum, Column> = getColumns(
    [
      TaskListColumnEnum.NAME,
      TaskListColumnEnum.FROM,
      TaskListColumnEnum.TO,
      TaskListColumnEnum.PROGRESS,
    ],
    true
  );
  const [displayedColumns, setDisplayedColumns] = useState<Column[]>(
    Array.from(typeToColumn.values())
  );

  const onResizeColumn: OnResizeColumn = (newColumns: readonly Column[]) => {
    setDisplayedColumns(() => {
      return [...newColumns];
    });
  };

  return (
    <>
      <Gantt
        {...props}
        columns={displayedColumns}
        onAddTask={onAddTask}
        onChangeTasks={onChangeTasks}
        onDoubleClick={handleDblClick}
        onEditTask={onEditTask}
        onClick={handleClick}
        tasks={tasks}
        onResizeColumn={onResizeColumn}
      />
    </>
  );
};
