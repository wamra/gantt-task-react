import React, { useCallback } from "react";
import { TitleColumn } from "./title-column";
import { DateStartColumn } from "./date-start-column";
import { DateEndColumn } from "./date-end-column";
import { DependenciesColumn } from "./dependencies-column";
import { DeleteColumn } from "./delete-column";
import { EditColumn } from "./edit-column";
import { AddColumn } from "./add-column";

export function useTaskListColumnsBuilder() {
  const createNameColumn = useCallback(
    (title: React.ReactNode | null, width?: number) => {
      return {
        id: "TitleColumn",
        component: TitleColumn,
        width: width || 120,
        title: title,
      };
    },
    []
  );

  const createStartDateColumn = useCallback(
    (title: React.ReactNode | null, width?: number) => {
      return {
        id: "DateStartColumn",
        component: DateStartColumn,
        width: width || 60,
        title: title,
      };
    },
    []
  );

  const createEndDateColumn = useCallback(
    (title: React.ReactNode | null, width?: number) => {
      return {
        id: "DateEndColumn",
        component: DateEndColumn,
        width: width || 60,
        title: title,
      };
    },
    []
  );

  const createDependenciesColumn = useCallback(
    (title: React.ReactNode | null, width?: number) => {
      return {
        id: "DependenciesColumn",
        component: DependenciesColumn,
        width: width || 90,
        title: title,
      };
    },
    []
  );

  const createDeleteActionColumn = useCallback((width?: number) => {
    return {
      id: "DeleteColumn",
      component: DeleteColumn,
      width: width || 60,
      canResize: false,
    };
  }, []);

  const createEditActionColumn = useCallback((width?: number) => {
    return {
      id: "EditColumn",
      component: EditColumn,
      width: width || 60,
      canResize: false,
    };
  }, []);

  const createAddActionColumn = useCallback((width?: number) => {
    return {
      id: "AddColumn",
      component: AddColumn,
      width: width || 60,
      canResize: false,
    };
  }, []);

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
