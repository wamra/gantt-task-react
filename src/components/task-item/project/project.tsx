import React from "react";
import { TaskItemProps } from "../task-item";
import styles from "../bar/bar.module.css";
import { BarDateHandle } from "../bar/bar-date-handle";
import { BarProgressHandle } from "../bar/bar-progress-handle";
import { getProgressPoint } from "../../../helpers/bar-helper";

export const Project: React.FC<TaskItemProps> = ({
  task,
  isSelected,
  isProgressChangeable,
  isDateChangeable,
  onEventStart,
  rtl,
}) => {
  const barColor = isSelected
    ? task.styles.backgroundSelectedColor
    : task.styles.backgroundColor;
  const processColor = isSelected
    ? task.styles.progressSelectedColor
    : task.styles.progressColor;
  const projectWith = task.x2 - task.x1;

  const projectLeftTriangle = [
    task.x1,
    task.y + task.height / 2 - 1,
    task.x1,
    task.y + task.height,
    task.x1 + 15,
    task.y + task.height / 2 - 1,
  ].join(",");
  const projectRightTriangle = [
    task.x2,
    task.y + task.height / 2 - 1,
    task.x2,
    task.y + task.height,
    task.x2 - 15,
    task.y + task.height / 2 - 1,
  ].join(",");

  const progressPoint = getProgressPoint(
    +!rtl * task.progressWidth + task.progressX,
    task.y,
    task.height
  );
  const handleHeight = task.height - 2;

  return (
    <g tabIndex={0} className={styles.barWrapper}>
      <g
        onMouseDown={e => {
          isDateChangeable && onEventStart("move", task, e);
        }}
      >
        <rect
          fill={barColor}
          x={task.x1}
          width={projectWith}
          y={task.y}
          height={task.height}
          rx={task.barCornerRadius}
          ry={task.barCornerRadius}
          className={styles.projectBackground}
        />
        <rect
          x={task.progressX}
          width={task.progressWidth}
          y={task.y}
          height={task.height}
          ry={task.barCornerRadius}
          rx={task.barCornerRadius}
          fill={processColor}
        />
        <rect
          fill={barColor}
          x={task.x1}
          width={projectWith}
          y={task.y}
          height={task.height / 2}
          rx={task.barCornerRadius}
          ry={task.barCornerRadius}
          className={styles.projectTop}
        />
        <polygon
          className={styles.projectTop}
          points={projectLeftTriangle}
          fill={barColor}
        />
        <polygon
          className={styles.projectTop}
          points={projectRightTriangle}
          fill={barColor}
        />
      </g>
      <g className="handleGroup">
        {isDateChangeable && (
          <g>
            {/* left */}
            <BarDateHandle
              x={task.x1 + 1}
              y={task.y + 1}
              width={task.handleWidth}
              height={handleHeight}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={e => {
                onEventStart("start", task, e);
              }}
            />
            {/* right */}
            <BarDateHandle
              x={task.x2 - task.handleWidth - 1}
              y={task.y + 1}
              width={task.handleWidth}
              height={handleHeight}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={e => {
                onEventStart("end", task, e);
              }}
            />
          </g>
        )}
        {isProgressChangeable && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={e => {
              onEventStart("progress", task, e);
            }}
          />
        )}
      </g>
    </g>
  );
};
