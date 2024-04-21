import React, { memo } from "react";
import styles from "./gantt-loader.module.css";

type GanttLoaderProps = {
  loading?: boolean;
};

const GanttLoaderInner: React.FC<GanttLoaderProps> = ({ loading }) => {
  return (
    <div className={`${styles.loader} ${loading ? "" : styles.loaderHidden}`} />
  );
};

export const GanttLoader = memo(GanttLoaderInner);
