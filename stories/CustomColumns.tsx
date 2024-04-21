import React, { useCallback, useState } from "react";

import {
  Column,
  ColumnProps,
  DateEndColumn,
  DateStartColumn,
  Gantt,
  OnCommitTasks,
  OnResizeColumn,
  Task,
  TaskCenterLabel,
  TaskOrEmpty,
  TitleColumn,
  ViewMode
} from "../src";
import { differenceInDays } from "date-fns";
import { initTasks, onAddTask, onEditTask } from "./helper";
import { TaskOutlineLabel } from "../src/components/task-item/task-label";

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

  const onCommitTasks = useCallback<OnCommitTasks>((nextTasks, action) => {
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
          break;
        }
        break;
      case "delete_task":
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (window.confirm("Are you sure?")) {
          setTasks(nextTasks);
          break;
        }
    }

    setTasks(nextTasks);
  }, []);

  const handleDblClick = useCallback((task: Task) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
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
        viewMode={ViewMode.Day}
        columns={displayedColumns}
        taskBar={{
          onClick: handleClick,
          onDoubleClick: handleDblClick,
          renderCustomLabel: (
            task,
            x1,
            width,
            taskHeight,
            arrowIndent,
            taskYOffset,
            movingAction,
            rtl
          ) => (
            <>
              {movingAction !== "start" && movingAction !== "end" && (
                <TaskCenterLabel
                  hideWhenSmall
                  x1={x1}
                  rtl={rtl}
                  taskHeight={taskHeight}
                  arrowIndent={arrowIndent}
                  taskYOffset={taskYOffset}
                  width={width}
                  label={
                    task.type === "empty"
                      ? null
                      : `${differenceInDays(task.end, task.start)} day(s)`
                  }
                />
              )}

              <TaskOutlineLabel
                x1={x1}
                rtl={rtl}
                taskHeight={taskHeight}
                arrowIndent={arrowIndent}
                taskYOffset={taskYOffset}
                width={width}
                label={task.name}
              />
            </>
          ),
        }}
        taskList={{
          onResizeColumn: onResizeColumn,
        }}
        onAddTaskAction={onAddTask}
        onCommitTasks={onCommitTasks}
        onEditTaskAction={onEditTask}
        tasks={tasks}
        isAdjustToWorkingDates={false}
      />
    </>
  );
};
