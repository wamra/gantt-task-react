import React, { useMemo } from "react";
import styles from "./task-list-table.module.css";
import {
  Task,
  TaskListColumn,
  TaskListColumnEnum,
} from "../../types/public-types";

const localeDateStringCache = {};
const toLocaleDateStringFactory =
  (locale: string) =>
  (date: Date, dateTimeOptions: Intl.DateTimeFormatOptions) => {
    const key = date.toString();
    let lds = localeDateStringCache[key];
    if (!lds) {
      lds = date.toLocaleDateString(locale, dateTimeOptions);
      localeDateStringCache[key] = lds;
    }
    return lds;
  };
const dateTimeOptions: Intl.DateTimeFormatOptions = {
  weekday: "short",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const TaskListTableDefault: React.FC<{
  rowHeight: number;
  columns: TaskListColumn[];
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
}> = ({
  rowHeight,
  tasks,
  fontFamily,
  fontSize,
  locale,
  onExpanderClick,
  columns,
}) => {
  const toLocaleDateString = useMemo(
    () => toLocaleDateStringFactory(locale),
    [locale]
  );

  // const rowWidth = "155px";

  const getLabel = (type: TaskListColumnEnum, task: Task) => {
    let label;
    if (type === TaskListColumnEnum.NAME) {
      label = task.name;
    } else if (type === TaskListColumnEnum.FROM) {
      label = toLocaleDateString(task.start, dateTimeOptions);
    } else if (type === TaskListColumnEnum.TO) {
      label = toLocaleDateString(task.end, dateTimeOptions);
    } else if (type === TaskListColumnEnum.ASSIGNEE) {
      label = task.assignee;
    }
    return label;
  };
  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {tasks.map(t => {
        let expanderSymbol = "";
        if (t.hideChildren === false) {
          expanderSymbol = "▼";
        } else if (t.hideChildren === true) {
          expanderSymbol = "▶";
        }

        return (
          <div
            className={styles.taskListTableRow}
            style={{ height: rowHeight }}
            key={`${t.id}row`}
          >
            <div
              key={columns[0].columntype}
              className={styles.taskListCell}
              style={{
                minWidth: columns[0].columnWidth,
                maxWidth: columns[0].columnWidth,
              }}
              title={getLabel(columns[0].columntype, t)}
            >
              <div className={styles.taskListNameWrapper}>
                <div
                  className={
                    expanderSymbol
                      ? styles.taskListExpander
                      : styles.taskListEmptyExpander
                  }
                  onClick={() => onExpanderClick(t)}
                >
                  {expanderSymbol}
                </div>
                <div>{getLabel(columns[0].columntype, t)}</div>
              </div>
            </div>
            {columns.map((column, index) => {
              if (index > 0) {
                return (
                  <div
                    key={column.columntype}
                    className={styles.taskListCell}
                    style={{
                      minWidth: column.columnWidth,
                      maxWidth: column.columnWidth,
                    }}
                  >
                    &nbsp;{getLabel(column.columntype, t)}
                  </div>
                );
              }
              return <React.Fragment key="empty"></React.Fragment>;
            })}
          </div>
        );
      })}
    </div>
  );
};
