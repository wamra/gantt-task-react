import React, {
  ReactChild,
  MouseEvent as MouseEventReact,
  useState,
  useEffect,
} from "react";
import { Task } from "../../types/public-types";
import { addToDate } from "../../helpers/date-helper";
import styles from "./grid.module.css";

export type GridBodyProps = {
  tasks: Task[];
  dates: Date[];
  svgWidth: number;
  rowHeight: number;
  columnWidth: number;
  todayColor: string;
  rtl: boolean;
  enableGridDrag: boolean;
  onDrag?: (deltaX: number, deltaY: number) => void;
  onClick: () => void;
};
type Point = { x: number; y: number };
export const GridBody: React.FC<GridBodyProps> = ({
  tasks,
  dates,
  rowHeight,
  svgWidth,
  columnWidth,
  todayColor,
  rtl,
  enableGridDrag,
  onDrag,
  onClick,
}) => {
  let y = 0;
  const gridRows: ReactChild[] = [];
  const rowLines: ReactChild[] = [
    <line
      key="RowLineFirst"
      x="0"
      y1={0}
      x2={svgWidth}
      y2={0}
      className={styles.gridRowLine}
    />,
  ];
  for (const task of tasks) {
    gridRows.push(
      <rect
        key={"Row" + task.id}
        x="0"
        y={y}
        width={svgWidth}
        height={rowHeight}
        className={styles.gridRow}
      />
    );
    rowLines.push(
      <line
        key={"RowLine" + task.id}
        x="0"
        y1={y + rowHeight}
        x2={svgWidth}
        y2={y + rowHeight}
        className={styles.gridRowLine}
      />
    );
    y += rowHeight;
  }

  const now = new Date();
  let tickX = 0;
  const ticks: ReactChild[] = [];
  let today: ReactChild = <rect />;
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    ticks.push(
      <line
        key={date.getTime()}
        x1={tickX}
        y1={0}
        x2={tickX}
        y2={y}
        className={styles.gridTick}
      />
    );
    if (
      (i + 1 !== dates.length &&
        date.getTime() < now.getTime() &&
        dates[i + 1].getTime() >= now.getTime()) ||
      // if current date is last
      (i !== 0 &&
        i + 1 === dates.length &&
        date.getTime() < now.getTime() &&
        addToDate(
          date,
          date.getTime() - dates[i - 1].getTime(),
          "millisecond"
        ).getTime() >= now.getTime())
    ) {
      today = (
        <rect
          x={tickX}
          y={0}
          width={columnWidth}
          height={y}
          fill={todayColor}
        />
      );
    }
    // rtl for today
    if (
      rtl &&
      i + 1 !== dates.length &&
      date.getTime() >= now.getTime() &&
      dates[i + 1].getTime() < now.getTime()
    ) {
      today = (
        <rect
          x={tickX + columnWidth}
          y={0}
          width={columnWidth}
          height={y}
          fill={todayColor}
        />
      );
    }
    tickX += columnWidth;
  }

  // Manage the grid dragging
  const [draggingCursorPosition, setDraggingCursorPosition] = useState<Point>();
  const handleMouseDown = (event: MouseEventReact) => {
    setDraggingCursorPosition({ x: event.clientX, y: event.clientY });
    onClick();
  };
  const handleMouseUp = () => {
    setDraggingCursorPosition(undefined);
  };

  useEffect(() => {
    const saveMousePosition = (event: MouseEvent) => {
      if (onDrag && draggingCursorPosition) {
        onDrag(
          event.clientX - draggingCursorPosition.x,
          event.clientY - draggingCursorPosition.y
        );
        setDraggingCursorPosition({ x: event.clientX, y: event.clientY });
      }
    };

    if (enableGridDrag) {
      document.addEventListener("mousemove", saveMousePosition);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", saveMousePosition);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    setDraggingCursorPosition,
    onDrag,
    draggingCursorPosition,
    enableGridDrag,
  ]);

  return (
    <g className="gridBody" onMouseDown={handleMouseDown}>
      <g className="rows">{gridRows}</g>
      <g className="rowLines">{rowLines}</g>
      <g className="ticks">{ticks}</g>
      <g className="today">{today}</g>
    </g>
  );
};
