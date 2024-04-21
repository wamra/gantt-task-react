import React from "react";
import styles from "../bar.module.css";
import { TaskId } from "../../../../types/internal-types";

type BarProgressHandleProps = {
  className?: string;
  taskId: TaskId;
  progressPoint: string;
  startMoveProgress: (clientX: number) => void;
};
export const BarProgressHandle: React.FC<BarProgressHandleProps> = ({
  taskId,
  progressPoint,
  startMoveProgress,
}) => {
  return (
    <polygon
      data-testid={`bar-progress-handle-${taskId}`}
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
