import type { ReactNode } from "react";
import React, { memo, useMemo } from "react";
import { TaskListTableProps } from "../../../types";
import { TaskListTableRow } from "../task-list-table-row";

import styles from "./task-list-table.module.css";

const TaskListTableDefaultInner: React.FC<TaskListTableProps> = ({
  getTableRowProps,
  fullRowHeight,
  renderedIndexes,
  tasks,
}) => {
  const renderedTasks = useMemo(
    /**
     * TO DO: maybe consider tasks on other levels?
     */
    () =>
      tasks.filter(task => !task.comparisonLevel || task.comparisonLevel === 1),
    [tasks]
  );

  const renderedListWithOffset = useMemo(() => {
    if (!renderedIndexes) {
      return null;
    }

    const [start, end] = renderedIndexes;

    const renderedList: ReactNode[] = [];

    for (let index = start; index <= end; ++index) {
      const task = renderedTasks[index];
      if (!task) {
        break;
      }

      renderedList.push(
        <TaskListTableRow {...getTableRowProps(task, index)} key={task.id} />
      );
    }

    return (
      <>
        <div
          style={{
            height: fullRowHeight * start,
          }}
        />

        {renderedList}
      </>
    );
  }, [renderedIndexes, fullRowHeight, renderedTasks, getTableRowProps]);

  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: "var(--gantt-font-family)",
        fontSize: "var(--gantt-font-size)",
      }}
    >
      {renderedListWithOffset}
    </div>
  );
};

export const TaskListTable = memo(TaskListTableDefaultInner);
