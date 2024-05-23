import { useEffect, useState } from "react";

import { Column, Distances, OnResizeColumn } from "../../types/public-types";
import { AddColumn } from "../task-list/columns/add-column";
import { TitleColumn } from "../task-list/columns/title-column";
import { DateStartColumn } from "../task-list/columns/date-start-column";
import { DateEndColumn } from "../task-list/columns/date-end-column";
import { DependenciesColumn } from "../task-list/columns/dependencies-column";
import { DeleteColumn } from "../task-list/columns/delete-column";
import { EditColumn } from "../task-list/columns/edit-column";

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
  distances: Distances,
  onResizeColumn: OnResizeColumn
): [
  columns: readonly Column[],
  taskListWidth: number,
  tableWidth: number,
  onTableResizeStart: (clientX: number) => void,
  onColumnResizeStart: (columnIndex: number, clientX: number) => void
] => {
  const [columnsState, setColumns] = useState<readonly Column[]>(() => {
    if (columnsProp) {
      return [...columnsProp];
    }

    const {
      titleCellWidth,
      dateCellWidth,
      dependenciesCellWidth,
      actionColumnWidth,
    } = distances;

    return [
      {
        id: "TitleColumn",
        Cell: TitleColumn,
        width: titleCellWidth,
        title: "Name",
      },

      {
        id: "DateStartColumn",
        Cell: DateStartColumn,
        width: dateCellWidth,
        title: "From",
      },

      {
        id: "DateEndColumn",
        Cell: DateEndColumn,
        width: dateCellWidth,
        title: "To",
      },

      {
        id: "DependenciesColumn",
        Cell: DependenciesColumn,
        width: dependenciesCellWidth,
        title: "Dependencies",
      },

      {
        id: "DeleteColumn",
        Cell: DeleteColumn,
        width: actionColumnWidth,
        canResize: false,
      },

      {
        id: "EditColumn",
        Cell: EditColumn,
        width: actionColumnWidth,
        canResize: false,
      },

      {
        id: "AddColumn",
        Cell: AddColumn,
        width: actionColumnWidth,
        canResize: false,
      },
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
