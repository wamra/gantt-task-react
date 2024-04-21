import type { MouseEvent } from "react";
import { forwardRef, memo, useCallback, useMemo } from "react";

import { ColumnData, Task, TaskListTableRowProps } from "../../../types";

import styles from "./task-list-table-row.module.css";
import { DragIndicatorIcon } from "../../icons/drag-indicator-icon";

const TaskListTableRowInner = forwardRef<HTMLDivElement, TaskListTableRowProps>(
  (props, ref) => {
    const {
      columns,
      dateSetup,
      dependencyMap,
      depth,
      distances,
      fullRowHeight,
      getTaskCurrentState,
      handleAddTask,
      handleDeleteTasks,
      handleEditTask,
      handleOpenContextMenu,
      hasChildren,
      icons,
      indexStr,
      isClosed,
      isCut,
      isEven,
      isSelected,
      isDragging,
      isShowTaskNumbers,
      onClick,
      onExpanderClick,
      scrollToTask,
      selectTaskOnMouseDown,
      style,
      task,
      moveHandleProps,
      isOverlay,
      moveOverPosition,
    } = props;
    const { id, comparisonLevel = 1 } = task;

    const onRootMouseDown = useCallback(
      (event: MouseEvent) => {
        event.preventDefault();
        if (event.button !== 0) {
          return;
        }

        if (task.type !== "empty") {
          scrollToTask(task);
        }

        selectTaskOnMouseDown(task.id, event);
        if (onClick) {
          onClick(task);
        }
      },
      [onClick, scrollToTask, selectTaskOnMouseDown, task]
    );

    const onContextMenu = useCallback(
      (event: MouseEvent) => {
        event.preventDefault();
        if (event.ctrlKey) {
          return;
        }
        handleOpenContextMenu(task, event.clientX, event.clientY);
      },
      [handleOpenContextMenu, task]
    );

    const dependencies = useMemo<Task[]>(() => {
      const dependenciesAtLevel = dependencyMap.get(comparisonLevel);

      if (!dependenciesAtLevel) {
        return [];
      }

      const dependenciesByTask = dependenciesAtLevel.get(id);

      if (!dependenciesByTask) {
        return [];
      }

      return dependenciesByTask.map(({ source }) => source);
    }, [comparisonLevel, dependencyMap, id]);

    const columnData: ColumnData = useMemo(
      () => ({
        dateSetup,
        dependencies,
        distances,
        handleDeleteTasks,
        handleAddTask,
        handleEditTask,
        hasChildren,
        icons,
        isClosed,
        onExpanderClick,
        indexStr: isOverlay ? "" : indexStr,
        depth: isOverlay ? 1 : depth,
        isShowTaskNumbers: isOverlay ? false : isShowTaskNumbers,
        task: task.type === "empty" ? task : getTaskCurrentState(task),
      }),
      [
        dateSetup,
        dependencies,
        depth,
        distances,
        handleDeleteTasks,
        handleAddTask,
        handleEditTask,
        hasChildren,
        icons,
        isOverlay,
        indexStr,
        isClosed,
        isShowTaskNumbers,
        onExpanderClick,
        task,
        getTaskCurrentState,
      ]
    );

    const backgroundColor = useMemo(() => {
      if (isOverlay) {
        return "var(--gantt-table-drag-task-background-color)";
      }
      return isSelected
        ? "var(--gantt-table-selected-task-background-color)"
        : isEven
          ? "var(--gantt-table-even-background-color)"
          : undefined;
    }, [isEven, isOverlay, isSelected]);

    const rowClassName = useMemo(() => {
      const classNames = [styles.taskListTableRow];
      if (moveOverPosition === "after") {
        classNames.push(styles.isAfter);
      }
      if (moveOverPosition === "before") {
        classNames.push(styles.isBefore);
      }
      if (isOverlay && !isDragging) {
        classNames.push(styles.isOverlay);
      }

      if (isCut) {
        classNames.push(styles.isCut);
      }

      return classNames.join(" ");
    }, [isCut, moveOverPosition, isOverlay, isDragging]);

    return (
      <div
        ref={ref}
        className={rowClassName}
        onMouseDown={onRootMouseDown}
        style={{
          height: fullRowHeight,
          backgroundColor: backgroundColor,
          ...style,
        }}
        onContextMenu={onContextMenu}
      >
        {!isOverlay && moveHandleProps && (
          <div className={`${styles.dragIndicator}`} {...moveHandleProps}>
            <DragIndicatorIcon className={styles.dragIndicatorIcon} />
          </div>
        )}

        {columns.map(({ id, component: Component, width }, index) => {
          return (
            <div
              className={styles.taskListCell}
              style={{
                minWidth: width,
                maxWidth: width,
              }}
              key={`${id}-${index}`}
            >
              <Component data={columnData} />
            </div>
          );
        })}
      </div>
    );
  }
);

export const TaskListTableRow = memo(TaskListTableRowInner);
