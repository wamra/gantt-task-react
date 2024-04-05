import React, { useCallback, useMemo } from "react";

import { ColumnProps, Icons } from "../../../types/public-types";

import styles from "./title-column.module.css";
import { ExpandMoreIcon } from "../../icons/expand-more-icon";
import { ExpandLessIcon } from "../../icons/expand-less-icon";

const getExpanderSymbol = (
  hasChildren: boolean,
  isClosed: boolean,
  icons: Partial<Icons> | undefined
) => {
  if (!hasChildren) {
    return icons?.renderNoChildrenIcon ? icons.renderNoChildrenIcon() : "";
  }

  if (isClosed) {
    return icons?.renderClosedIcon ? (
      icons.renderClosedIcon()
    ) : (
      <ExpandMoreIcon />
    );
  }

  return icons?.renderOpenedIcon ? (
    icons.renderOpenedIcon()
  ) : (
    <ExpandLessIcon />
  );
};

export const TitleColumn: React.FC<ColumnProps> = ({
  data: {
    distances: { expandIconWidth, nestedTaskNameOffset },
    icons,
    isShowTaskNumbers,
    hasChildren,
    isClosed,
    depth,
    indexStr,
    task,
    onExpanderClick,
  },
}) => {
  const { name } = task;

  const expanderSymbol = useMemo(
    () => getExpanderSymbol(hasChildren, isClosed, icons),
    [hasChildren, isClosed, icons]
  );

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

      <div className={styles.taskName}>
        {isShowTaskNumbers && <b>{indexStr} </b>}

        {name}
      </div>
    </div>
  );
};
