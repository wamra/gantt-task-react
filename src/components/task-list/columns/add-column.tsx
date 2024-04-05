import React, { useCallback } from "react";

import { ColumnProps } from "../../../types/public-types";

import styles from "./add-column.module.css";
import { AddIcon } from "../../icons/add-icon";

export const AddColumn: React.FC<ColumnProps> = ({
  data: { handleAddTask, icons, task },
}) => {
  const onClick = useCallback(() => {
    if (task.type === "empty") {
      return;
    }

    handleAddTask(task);
  }, [task, handleAddTask]);

  if (task.type === "empty" || task.type === "milestone") {
    return null;
  }

  return (
    <button
      type="button"
      onContextMenu={e => {
        e.stopPropagation();
      }}
      onClick={onClick}
      className={styles.button}
    >
      {icons?.renderAddIcon ? icons.renderAddIcon() : <AddIcon />}
    </button>
  );
};
