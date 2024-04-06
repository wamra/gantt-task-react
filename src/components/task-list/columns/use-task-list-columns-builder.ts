import { useGanttLocale } from "../../gantt-locale";
import { useCallback } from "react";
import { TitleColumn } from "./title-column";
import { DateStartColumn } from "./date-start-column";
import { DateEndColumn } from "./date-end-column";
import { DependenciesColumn } from "./dependencies-column";
import { DeleteColumn } from "./delete-column";
import { useGanttTheme } from "../../gantt-theme";
import { EditColumn } from "./edit-column";
import { AddColumn } from "./add-column";

export function useTaskListColumnsBuilder() {
  const locale = useGanttLocale();
  const theme = useGanttTheme();
  const {
    titleCellWidth,
    dateCellWidth,
    dependenciesCellWidth,
    actionColumnWidth,
  } = theme.distances;

  const createNameColumn = useCallback(
    (width?: number) => {
      return {
        id: "TitleColumn",
        component: TitleColumn,
        width: width || titleCellWidth,
        title: locale.table.columns.name,
      };
    },
    [locale.table.columns.name, titleCellWidth]
  );

  const createStartDateColumn = useCallback(
    (width?: number) => {
      return {
        id: "DateStartColumn",
        component: DateStartColumn,
        width: width || dateCellWidth,
        title: locale.table.columns.startDate,
      };
    },
    [locale.table.columns.startDate, dateCellWidth]
  );

  const createEndDateColumn = useCallback(
    (width?: number) => {
      return {
        id: "DateEndColumn",
        component: DateEndColumn,
        width: width || dateCellWidth,
        title: locale.table.columns.endDate,
      };
    },
    [locale.table.columns.endDate, dateCellWidth]
  );

  const createDependenciesColumn = useCallback(
    (width?: number) => {
      return {
        id: "DependenciesColumn",
        component: DependenciesColumn,
        width: width || dependenciesCellWidth,
        title: locale.table.columns.dependencies,
      };
    },
    [locale.table.columns.dependencies, dependenciesCellWidth]
  );

  const createDeleteActionColumn = useCallback(
    (width?: number) => {
      return {
        id: "DeleteColumn",
        component: DeleteColumn,
        width: width || actionColumnWidth,
        canResize: false,
      };
    },
    [actionColumnWidth]
  );

  const createEditActionColumn = useCallback(
    (width?: number) => {
      return {
        id: "EditColumn",
        component: EditColumn,
        width: width || actionColumnWidth,
        canResize: false,
      };
    },
    [actionColumnWidth]
  );

  const createAddActionColumn = useCallback(
    (width?: number) => {
      return {
        id: "AddColumn",
        component: AddColumn,
        width: width || actionColumnWidth,
        canResize: false,
      };
    },
    [actionColumnWidth]
  );

  return {
    createNameColumn,
    createStartDateColumn,
    createEndDateColumn,
    createDependenciesColumn,
    createDeleteActionColumn,
    createEditActionColumn,
    createAddActionColumn,
  };
}
