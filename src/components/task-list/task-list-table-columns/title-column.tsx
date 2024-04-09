import React, { useCallback, useMemo } from "react";

import { ColumnProps, Icons } from "../../../types/public-types";

import styles from "./title-column.module.css";
import { ExpandMoreIcon } from "../../icons/expand-more-icon";
import { ExpandLessIcon } from "../../icons/expand-less-icon";

const getExpanderSymbol = (
  hasChildren: boolean,
  isClosed: boolean,
  iconWidth: number,
  icons: Partial<Icons> | undefined
) => {
  if (!hasChildren) {
    return icons?.renderNoChildrenIcon ? icons.renderNoChildrenIcon() : "";
  }

  if (isClosed) {
    return icons?.renderClosedIcon ? (
      icons.renderClosedIcon()
    ) : (
      <ExpandMoreIcon width={iconWidth} style={{ verticalAlign: "middle" }} />
    );
  }

  return icons?.renderOpenedIcon ? (
    icons.renderOpenedIcon()
  ) : (
    <ExpandLessIcon width={iconWidth} style={{ verticalAlign: "middle" }} />
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
    () => getExpanderSymbol(hasChildren, isClosed, expandIconWidth, icons),
    [hasChildren, isClosed, expandIconWidth, icons]
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
        className={`gantt-expander ${styles.taskListExpander} ${
          !hasChildren ? styles.taskListEmptyExpander : ""
        }`}
        onClick={onClick}
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
