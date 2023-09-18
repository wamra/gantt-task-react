import React from "react";
import styles from "./task-list-header.module.css";
import { TaskListColumn } from "../../types/public-types";

export const TaskListHeaderDefault: React.FC<{
  headerHeight: number;
  columns: TaskListColumn[];
  fontFamily: string;
  fontSize: string;
}> = ({ headerHeight, fontFamily, fontSize, columns }) => {
  // const rowWidth = "155px";
  return (
    <div
      className={styles.ganttTable}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      <div
        className={styles.ganttTable_Header}
        style={{
          height: headerHeight - 2,
        }}
      >
        <div
          key={columns[0].columntype}
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: columns[0].columnWidth,
          }}
        >
          &nbsp;{columns[0].columntype}
        </div>
        {columns.map((column, index) => {
          if (index > 0) {
            return (
              <React.Fragment key={column.columntype}>
                <div
                  className={styles.ganttTable_HeaderSeparator}
                  style={{
                    height: headerHeight * 0.5,
                    marginTop: headerHeight * 0.2,
                  }}
                />
                <div
                  className={styles.ganttTable_HeaderItem}
                  style={{
                    minWidth: column.columnWidth,
                  }}
                >
                  &nbsp;{column.columntype}
                </div>
              </React.Fragment>
            );
          }
          return <React.Fragment key="empty"></React.Fragment>;
        })}
        {/* <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.25,
          }}
        />
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: rowWidth,
          }}
        >
          &nbsp;To
        </div> */}
      </div>
    </div>
  );
};
