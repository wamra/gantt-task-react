import { RefObject, useEffect, useState } from "react";

import { Column, OnResizeColumn } from "../../types/public-types";
import { useTaskListColumnsBuilder } from "../task-list/columns/use-task-list-columns-builder";

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
  columnsProp: readonly Column[],
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
  const [columnsState, setColumns] = useState<readonly Column[]>(() => {
    if (columnsProp) {
      return [...columnsProp];
    }

    return [
      columnsBuilder.createNameColumn(),
      columnsBuilder.createStartDateColumn(),
      columnsBuilder.createEndDateColumn(),
      columnsBuilder.createDependenciesColumn(),
      columnsBuilder.createDeleteActionColumn(),
      columnsBuilder.createEditActionColumn(),
      columnsBuilder.createAddActionColumn(),
    ];
  });

  useEffect(() => {
    if (columnsProp) {
      setColumns([...columnsProp]);
      const currentColumnIds = columnsState.map(col => col.id);
      const newColumnIds = columnsProp.map(col => col.id);

      const widthOfAddedColumns = columnsProp
        .filter(col => !currentColumnIds.includes(col.id))
        .reduce((res, { width }) => res + width, 0);
      const widthOfRemovedColumns = columnsState
        .filter(col => !newColumnIds.includes(col.id))
        .reduce((res, { width }) => res + width, 0);

      setTableWidth(prev =>
        Math.min(
          prev + widthOfAddedColumns - widthOfRemovedColumns,
          columnsProp.reduce((res, { width }) => res + width, 0)
        )
      );
    }
  }, [columnsProp]);

  const [tableResizeEvent, setTableResizeEvent] =
    useState<TableResizeEvent | null>(null);
  const [columnResizeEvent, setColumnResizeEvent] =
    useState<ColumnResizeEvent | null>(null);

  const [tableWidthState, setTableWidth] = useState(() =>
    columnsState.reduce((res, { width }) => res + width, 0)
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
  const taskListWidth = columnsState.reduce((res, { width }) => res + width, 0);
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

    ganttRef.current.addEventListener("mousemove", handleMouseMove);
    ganttRef.current.addEventListener("touchmove", handleTouchMove);
    ganttRef.current.addEventListener("mouseup", handleUp);
    ganttRef.current.addEventListener("touchend", handleUp);

    return () => {
      ganttRef.current.removeEventListener("mousemove", handleMouseMove);
      ganttRef.current.removeEventListener("touchmove", handleTouchMove);
      ganttRef.current.removeEventListener("mouseup", handleUp);
      ganttRef.current.removeEventListener("touchend", handleUp);
    };
  }, [isResizeTableInProgress, tableWidthState, tableResizeEvent]);

  useEffect(() => {
    if (!isResizeColumnInProgress) {
      return undefined;
    }

    const handleMove = (clientX: number) => {
      const moveDelta = clientX - columnResizeEvent.startX;
      const newColumnwidth = Math.max(
        10,
        columnResizeEvent.initialColumnWidth + moveDelta
      );
      let previousColumnWidth = null;
      setColumns((prevColumns: readonly Column[]) => {
        const newColumns = prevColumns.map((column, index) => {
          if (index === columnResizeEvent.columnIndex) {
            previousColumnWidth = column.width;
            return { ...column, width: newColumnwidth };
          }
          return column;
        });
        return newColumns;
      });

      if (previousColumnWidth !== newColumnwidth) {
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

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("mouseup", handleUp);
    document.addEventListener("touchend", handleUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("touchend", handleUp);
    };
  }, [isResizeColumnInProgress, columnResizeEvent, columnsState]);

  return [
    columnsState,
    taskListWidth,
    tableWidthState,
    onTableResizeStart,
    onColumnResizeStart,
  ];
};
