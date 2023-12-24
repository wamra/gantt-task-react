import React from "react";
import { BarTask } from "../../types/bar-task";

type ArrowProps = {
  taskFrom: BarTask;
  taskTo: BarTask;
  rowHeight: number;
  taskHeight: number;
  arrowIndent: number;
  rtl: boolean;
};
export const Arrow: React.FC<ArrowProps> = ({
  taskFrom,
  taskTo,
  rowHeight,
  taskHeight,
  arrowIndent,
  rtl,
}) => {
  let path: string;
  let trianglePoints: string;
  if (rtl) {
    [path, trianglePoints] = drownPathAndTriangleRTL(
      taskFrom,
      taskTo,
      rowHeight,
      taskHeight,
      arrowIndent
    );
  } else {
    [path, trianglePoints] = drownPathAndTriangle(
      taskFrom,
      taskTo,
      rowHeight,
      taskHeight,
      arrowIndent
    );
  }

  return (
    <g className="arrow">
      <path strokeWidth="1.5" d={path} fill="none" />
      <polygon points={trianglePoints} />
    </g>
  );
};

const drownPathAndTriangle = (
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number
) => {
  let path = "";
  const taskToEndPosition = taskTo.y + taskHeight / 2;
  if (taskFrom.x2) {
    const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;
    const taskFromEndPosition = taskFrom.x2 + arrowIndent * 2;
    const taskFromHorizontalOffsetValue =
      taskFromEndPosition < taskTo.x1 ? "" : `H ${taskTo.x1 - arrowIndent}`;
    const taskToHorizontalOffsetValue =
      taskFromEndPosition > taskTo.x1
        ? arrowIndent
        : taskTo.x1 - taskFrom.x2 - arrowIndent;

    path = `M ${taskFrom.x2} ${taskFrom.y + taskHeight / 2} 
  h ${arrowIndent} 
  v ${(indexCompare * rowHeight) / 2} 
  ${taskFromHorizontalOffsetValue}
  V ${taskToEndPosition} 
  h ${taskToHorizontalOffsetValue}`;
  }

  let trianglePoints = "";
  if (taskTo.x1) {
    trianglePoints = `${taskTo.x1},${taskToEndPosition} 
    ${taskTo.x1 - 5},${taskToEndPosition - 5} 
    ${taskTo.x1 - 5},${taskToEndPosition + 5}`;
  }
  return [path, trianglePoints];
};

const drownPathAndTriangleRTL = (
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number
) => {
  let path = "";
  const taskToEndPosition = taskTo.y + taskHeight / 2;
  if (taskFrom.x1) {
    const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;
    const taskFromEndPosition = taskFrom.x1 - arrowIndent * 2;
    const taskFromHorizontalOffsetValue =
      taskFromEndPosition > taskTo.x2 ? "" : `H ${taskTo.x2 + arrowIndent}`;
    const taskToHorizontalOffsetValue =
      taskFromEndPosition < taskTo.x2
        ? -arrowIndent
        : taskTo.x2 - taskFrom.x1 + arrowIndent;

    path = `M ${taskFrom.x1} ${taskFrom.y + taskHeight / 2} 
  h ${-arrowIndent} 
  v ${(indexCompare * rowHeight) / 2} 
  ${taskFromHorizontalOffsetValue}
  V ${taskToEndPosition} 
  h ${taskToHorizontalOffsetValue}`;
  }

  let trianglePoints = "";
  if (taskTo.x2) {
    trianglePoints = `${taskTo.x2},${taskToEndPosition} 
  ${taskTo.x2 + 5},${taskToEndPosition + 5} 
  ${taskTo.x2 + 5},${taskToEndPosition - 5}`;
  }
  return [path, trianglePoints];
};
