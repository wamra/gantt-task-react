import React, { useCallback } from "react";

import { ColumnProps } from "../../../types/public-types";

import styles from "./button-column.module.css";
import { EditIcon } from "../../icons/edit-icon";

export const EditColumn: React.FC<ColumnProps> = ({
  data: { handleEditTask, icons, task },
}) => {
  const onClick = useCallback(() => {
    handleEditTask(task);
  }, [task, handleEditTask]);

  return (
    <button
      type="button"
      onContextMenu={e => {
        e.stopPropagation();
      }}
      onClick={onClick}
      className={styles.button}
    >
      {icons?.renderEditIcon ? icons.renderEditIcon() : <EditIcon />}
    </button>
  );
};
