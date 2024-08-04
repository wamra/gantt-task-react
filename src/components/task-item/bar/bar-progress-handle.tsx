import React from "react";
import styles from "./bar.module.css";

type BarProgressHandleProps = {
  taskName: string;
  progressPoint: string;
  startMoveProgress: (clientX: number) => void;
};
export const BarProgressHandle: React.FC<BarProgressHandleProps> = ({
  taskName,
  progressPoint,
  startMoveProgress,
}) => {
  return (
    <polygon
      data-testid={`task-progress-handle-${taskName}`}
      className={styles.barHandle}
      points={progressPoint}
      onMouseDown={e => {
        startMoveProgress(e.clientX);
      }}
      onTouchStart={e => {
        const firstTouch = e.touches[0];

        if (firstTouch) {
          startMoveProgress(firstTouch.clientX);
        }
      }}
    />
  );
};
