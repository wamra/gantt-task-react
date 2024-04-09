import React, { Fragment, memo } from "react";

import { TaskListHeaderProps } from "../../../types/public-types";

import styles from "./task-list-header.module.css";

const TaskListTableHeadersDefaultInner: React.FC<TaskListHeaderProps> = ({
  headerHeight,
  columns,
  canResizeColumns,
  canMoveTasks,
  onColumnResizeStart,
}) => {
  return (
    <div
      className={styles.ganttTable}
      style={{
        fontFamily: "var(--gantt-font-family)",
        fontSize: "var(--gantt-font-size)",
      }}
    >
      <div
        className={styles.ganttTable_Header}
        style={{
          height: headerHeight - 2,
        }}
      >
        {canMoveTasks && <div className={styles.ganttTable_HeaderMoveTask} />}

        {columns.map(({ title, width, canResize }, index) => {
          return (
            <Fragment key={index}>
              {index > 0 && !!title && (
                <div
                  className={styles.ganttTable_HeaderSeparator}
                  style={{
                    height: headerHeight * 0.5,
                    marginTop: headerHeight * 0.2,
                  }}
                />
              )}

              <div
                data-testid={`table-column-header-${title}`}
                className={styles.ganttTable_HeaderItem}
                style={{
                  minWidth: width,
                  maxWidth: width,
                }}
              >
                {title}

                {canResizeColumns && canResize !== false && !!title && (
                  <div
                    data-testid={`table-column-header-resize-handle-${title}`}
                    className={styles.resizer}
                    onMouseDown={event => {
                      onColumnResizeStart(index, event.clientX);
                    }}
                    onTouchStart={event => {
                      const firstTouch = event.touches[0];

                      if (firstTouch) {
                        onColumnResizeStart(index, firstTouch.clientX);
                      }
                    }}
                  />
                )}
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export const TaskListTableHeaders = memo(TaskListTableHeadersDefaultInner);
