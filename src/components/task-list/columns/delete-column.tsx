import React, { useCallback } from "react";

import { ColumnProps } from "../../../types/public-types";

import styles from "./delete-column.module.css";

export const DeleteColumn: React.FC<ColumnProps> = (props) => {
  const {
    data: { handleDeleteTasks, icons, colors, task }
  } = props;
  const onClick = useCallback(() => {
    handleDeleteTasks([task]);
  }, [task, handleDeleteTasks]);

  return (
    <button type="button" onClick={onClick} style={{
      "color": colors.barLabelColor
    }} className={styles.button}>
      {icons?.renderDeleteIcon ? icons.renderDeleteIcon(task) : "-"}
    </button>
  );
};
