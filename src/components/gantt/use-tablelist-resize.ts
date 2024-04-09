import { RefObject, useEffect, useMemo, useState } from "react";

import { Column, OnResizeColumn } from "../../types/public-types";
import { useTaskListColumnsBuilder } from "../task-list/task-list-table-columns/use-task-list-columns-builder";
import { useGanttLocale } from "../gantt-locale";
import { useGanttTheme } from "../gantt-theme";

type TableResizeEvent = {
  initialClientX: number;
  initialTableWidth: number;
};

type ColumnResizeEvent = {
  columnIndex: number;
  startX: number;
  endX: number;
  initialColumnWidth: number;
  initialTableWidth: number;
};
export const useTableListResize = (
  clientColumns: readonly Column[] | undefined | null,
  canMoveTasks: boolean,
  onResizeColumn: OnResizeColumn,
  ganttRef: RefObject<HTMLDivElement>
): [
  columns: readonly Column[],
  taskListWidth: number,
  tableWidth: number,

  onTableResizeStart: (clientX: number) => void,
  onColumnResizeStart: (columnIndex: number, clientX: number) => void,
] => {
  const columnsBuilder = useTaskListColumnsBuilder();
  const locale = useGanttLocale();
  const theme = useGanttTheme();
  const {
    titleCellWidth,
    dateCellWidth,
    dependenciesCellWidth,
    actionColumnWidth,
  } = theme.distances;

  const defaultColumns = useMemo(()=> {
    return [
      columnsBuilder.createNameColumn(locale.table.columns.name, titleCellWidth),
      columnsBuilder.createStartDateColumn(locale.table.columns.startDate, dateCellWidth),
      columnsBuilder.createEndDateColumn(locale.table.columns.endDate, dateCellWidth),
      columnsBuilder.createDependenciesColumn(locale.table.columns.dependencies, dependenciesCellWidth),
      columnsBuilder.createDeleteActionColumn(actionColumnWidth),
      columnsBuilder.createEditActionColumn(actionColumnWidth),
      columnsBuilder.createAddActionColumn(actionColumnWidth),
    ];
  }, [actionColumnWidth, columnsBuilder, dateCellWidth, dependenciesCellWidth, locale, titleCellWidth])

  const extraWidth = useMemo(() => canMoveTasks ? 26 : 0, [canMoveTasks])
  const [columnsState, setColumns] = useState<readonly Column[]>(clientColumns || defaultColumns);

  useEffect(() => {
    if (clientColumns) {
      setColumns([...clientColumns]);
      const currentColumnIds = clientColumns.map(col => col.id);
      const newColumnIds = clientColumns.map(col => col.id);

      const widthOfAddedColumns = clientColumns
        .filter(col => !currentColumnIds.includes(col.id))
        .reduce((res, { width }) => res + width, 0);
      const widthOfRemovedColumns = clientColumns
        .filter(col => !newColumnIds.includes(col.id))
        .reduce((res, { width }) => res + width, 0);

      setTableWidth(prev =>
        Math.min(
          prev + widthOfAddedColumns - widthOfRemovedColumns,
          clientColumns.reduce((res, { width }) => res + width, 0) + extraWidth
        )
      );
    }
  }, [clientColumns, extraWidth]);

  const [tableResizeEvent, setTableResizeEvent] =
    useState<TableResizeEvent | null>(null);
  const [columnResizeEvent, setColumnResizeEvent] =
    useState<ColumnResizeEvent | null>(null);

  const [tableWidthState, setTableWidth] = useState(() =>
    columnsState.reduce((res, { width }) => res + width, 0) + extraWidth
  );

  const onTableResizeStart = (clientX: number) => {
    const newTableResizeEvent = {
      initialClientX: clientX,
      initialTableWidth: tableWidthState,
    };
    setTableResizeEvent(newTableResizeEvent);
  };

  const onColumnResizeStart = (columnIndex: number, clientX: number) => {
    setColumnResizeEvent({
      columnIndex,
      startX: clientX,
      endX: clientX,
      initialColumnWidth: columnsState[columnIndex].width,
      initialTableWidth: tableWidthState,
    });
  };

  const isResizeTableInProgress = Boolean(tableResizeEvent);
  const isResizeColumnInProgress = Boolean(columnResizeEvent);
  const taskListWidth = columnsState.reduce((res, { width }) => res + width, 0) + extraWidth;
  useEffect(() => {
    if (!isResizeTableInProgress) {
      return undefined;
    }

    const handleMove = (clientX: number) => {
      const moveDelta = clientX - tableResizeEvent.initialClientX;
      setTableWidth(() => {
        return Math.min(
          Math.max(tableResizeEvent.initialTableWidth + moveDelta, 50),
          taskListWidth
        );
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      handleMove(event.clientX);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const firstTouch = event.touches[0];

      if (firstTouch) {
        handleMove(firstTouch.clientX);
      }
    };

    const handleUp = () => {
      setTableResizeEvent(null);
    };

    if (!ganttRef.current) {
      return () => {};
    }

    const gantt = ganttRef.current;

    gantt.addEventListener("mousemove", handleMouseMove);
    gantt.addEventListener("touchmove", handleTouchMove);
    gantt.addEventListener("mouseup", handleUp);
    gantt.addEventListener("touchend", handleUp);

    return () => {
      gantt.removeEventListener("mousemove", handleMouseMove);
      gantt.removeEventListener("touchmove", handleTouchMove);
      gantt.removeEventListener("mouseup", handleUp);
      gantt.removeEventListener("touchend", handleUp);
    };
  }, [isResizeTableInProgress, tableWidthState, tableResizeEvent, ganttRef, taskListWidth]);

  useEffect(() => {
    if (!isResizeColumnInProgress) {
      return undefined;
    }

    const handleMove = (clientX: number) => {
      const moveDelta = clientX - columnResizeEvent.startX;
      const newColumnWidth = Math.max(
        10,
        columnResizeEvent.initialColumnWidth + moveDelta
      );
      let previousColumnWidth = null;
      setColumns((prevColumns: readonly Column[]) => {
        const newColumns = prevColumns.map((column, index) => {
          if (index === columnResizeEvent.columnIndex) {
            previousColumnWidth = column.width;
            return { ...column, width: newColumnWidth };
          }
          return column;
        });
        return newColumns;
      });

      if (previousColumnWidth !== newColumnWidth) {
        setTableWidth(() =>
          Math.min(
            Math.max(columnResizeEvent.initialTableWidth + moveDelta, 50),
            taskListWidth
          )
        );
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      handleMove(event.clientX);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const firstTouch = event.touches[0];

      if (firstTouch) {
        handleMove(firstTouch.clientX);
      }
    };

    const handleUp = () => {
      if (onResizeColumn) {
        onResizeColumn(
          columnsState,
          columnResizeEvent.columnIndex,
          columnsState[columnResizeEvent.columnIndex].width -
            columnResizeEvent.initialColumnWidth
        );
      }
      setColumnResizeEvent(null);
    };

    const gantt = ganttRef.current;

    gantt.addEventListener("mousemove", handleMouseMove);
    gantt.addEventListener("touchmove", handleTouchMove);
    gantt.addEventListener("mouseup", handleUp);
    gantt.addEventListener("touchend", handleUp);

    return () => {
      gantt.removeEventListener("mousemove", handleMouseMove);
      gantt.removeEventListener("touchmove", handleTouchMove);
      gantt.removeEventListener("mouseup", handleUp);
      gantt.removeEventListener("touchend", handleUp);
    };
  }, [isResizeColumnInProgress, columnResizeEvent, columnsState, taskListWidth, onResizeColumn, ganttRef]);

  return [
    columnsState,
    taskListWidth,
    tableWidthState,
    onTableResizeStart,
    onColumnResizeStart,
  ];
};
