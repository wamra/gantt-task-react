import React, { useCallback } from "react";

import { ColumnProps, Icons, TaskOrEmpty } from "../../../types/public-types";

import styles from "./title-column.module.css";

const getExpanderSymbol = (
  task: TaskOrEmpty,
  hasChildren: boolean,
  isClosed: boolean,
  icons: Partial<Icons> | undefined
) => {
  if (!hasChildren) {
    return icons?.renderNoChildrenIcon ? icons.renderNoChildrenIcon(task) : "";
  }

  if (isClosed) {
    return icons?.renderClosedIcon ? icons.renderClosedIcon(task) : "⊞";
  }

  return icons?.renderOpenedIcon ? icons.renderOpenedIcon(task) : "⊟";
};

export const TitleColumn: React.FC<ColumnProps> = (props) => {
  const {
    data: {
      colors,
      distances: { expandIconWidth, nestedTaskNameOffset },
      icons,
      isShowTaskNumbers,
      hasChildren,
      isClosed,
      depth,
      indexStr,
      task,
      onExpanderClick,
    }
  } = props;
  const { name } = task;

  const expanderSymbol = getExpanderSymbol(task, hasChildren, isClosed, icons);

  const title = isShowTaskNumbers ? `${indexStr} ${name}` : name;

  const onClick = useCallback(() => {
    if (task.type !== "empty") {
      onExpanderClick(task);
    }
  }, [onExpanderClick, task]);

  return (
    <div
      data-testid={`title-table-cell-${name}`}
      className={`${styles.taskListNameWrapper}`}
      style={{
        paddingLeft: depth * nestedTaskNameOffset,
      }}
      title={title}
    >
      <div
        className={`${styles.taskListExpander} ${
          !hasChildren ? styles.taskListEmptyExpander : ""
        }`}
        onClick={onClick}
        style={{
          width: expandIconWidth,
        }}
      >
        {expanderSymbol}
      </div>
      <div style={{
        color: colors.barLabelColor
      }} className={styles.taskName}>
        {isShowTaskNumbers && <b>{indexStr} </b>}

        {name}
      </div>
    </div>
  );
};
