import React, { useCallback } from "react";

import { ColumnProps } from "../../../types/public-types";

import styles from "./edit-column.module.css";

export const EditColumn: React.FC<ColumnProps> = (props) => {
  const {
    data: { handleEditTask, icons, colors, task }
  } = props;
  const onClick = useCallback(() => {
    handleEditTask(task);
  }, [task, handleEditTask]);

  return (
    <button type="button" onClick={onClick} style={{
      "color": colors.barLabelColor
    }} className={styles.button}>
      {icons?.renderEditIcon ? icons.renderEditIcon(task) : "✎"}
    </button>
  );
};
