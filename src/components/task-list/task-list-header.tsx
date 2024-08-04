import React, { Fragment, memo } from "react";

import { TaskListHeaderProps } from "../../types/public-types";

import styles from "./task-list-header.module.css";
import { TaskListHeaderActions, TaskListHeaderActionsProps } from "./TaskListHeaderActions";

const TaskListHeaderDefaultInner: React.FC<TaskListHeaderProps & TaskListHeaderActionsProps> = ({
  headerHeight,
  fontFamily,
  fontSize,
  columns,
  canResizeColumns,
  onColumnResizeStart,
  onCollapseAll,
  onExpandFirstLevel,
  onExpandAll
}) => {
  return (
    <div
      className={styles.ganttTable_Header}
      style={{
        height: headerHeight,
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {columns.map(({ title, width, canResize }, index) => {
        return (
          <Fragment key={index}>
            {index > 0 && (
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
              <div className={styles.ganttTable_HeaderContent}>
                <div className={styles.ganttTable_HeaderTitle}>
                  {title}
                </div>

                {title === "Name" && <TaskListHeaderActions
                  onCollapseAll={onCollapseAll}
                  onExpandFirstLevel={onExpandFirstLevel}
                  onExpandAll={onExpandAll} />}
              </div>

              {canResizeColumns && canResize !== false && (
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
  );
};

export const TaskListHeaderDefault = memo(TaskListHeaderDefaultInner);
