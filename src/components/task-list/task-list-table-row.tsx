import React, { memo, useCallback, useMemo } from "react";
import type { CSSProperties, MouseEvent } from "react";

import { useDrop } from "react-dnd";

import {
  ColorStyles,
  Column,
  ColumnData,
  DateSetup,
  DependencyMap,
  Distances,
  Icons,
  Task,
  TaskOrEmpty,
} from "../../types/public-types";

import styles from "./task-list-table-row.module.css";
import { ROW_DRAG_TYPE } from "../../constants";

type TaskListTableRowProps = {
  canMoveTasks: boolean;
  colors: ColorStyles;
  columns: readonly Column[];
  dateSetup: DateSetup;
  dependencyMap: DependencyMap;
  depth: number;
  distances: Distances;
  fullRowHeight: number;
  getTaskCurrentState: (task: Task) => Task;
  handleAddTask: (task: Task) => void;
  handleDeteleTasks: (task: TaskOrEmpty[]) => void;
  handleEditTask: (task: TaskOrEmpty) => void;
  handleMoveTaskBefore: (target: TaskOrEmpty, taskForMove: TaskOrEmpty) => void;
  handleMoveTaskAfter: (target: TaskOrEmpty, taskForMove: TaskOrEmpty) => void;
  handleMoveTasksInside: (parent: Task, childs: readonly TaskOrEmpty[]) => void;
  handleOpenContextMenu: (
    task: TaskOrEmpty,
    clientX: number,
    clientY: number
  ) => void;
  hasChildren: boolean;
  icons?: Partial<Icons>;
  indexStr: string;
  isClosed: boolean;
  isCut: boolean;
  isEven: boolean;
  isSelected: boolean;
  isShowTaskNumbers: boolean;
  onExpanderClick: (task: Task) => void;
  scrollToTask: (task: Task) => void;
  selectTaskOnMouseDown: (taskId: string, event: MouseEvent) => void;
  style?: CSSProperties;
  task: TaskOrEmpty;
  tasks: readonly TaskOrEmpty[];
};

const TaskListTableRowInner: React.FC<TaskListTableRowProps> = ({
  canMoveTasks,
  colors,
  columns,
  dateSetup,
  dependencyMap,
  depth,
  distances,
  fullRowHeight,
  getTaskCurrentState,
  handleAddTask,
  handleDeteleTasks,
  handleEditTask,
  handleMoveTaskBefore,
  handleMoveTaskAfter,
  handleMoveTasksInside,
  handleOpenContextMenu,
  hasChildren,
  icons = undefined,
  indexStr,
  isClosed,
  isCut,
  isEven,
  isSelected,
  isShowTaskNumbers,
  onExpanderClick,
  scrollToTask,
  selectTaskOnMouseDown,
  style = undefined,
  task,
  tasks,
}) => {
  const { id, comparisonLevel = 1 } = task;

  const onRootMouseDown = useCallback(
    (event: MouseEvent) => {
      if (event.button !== 0) {
        return;
      }

      if (task.type === "empty") {
        return;
      }

      scrollToTask(task);
      selectTaskOnMouseDown(task.id, event);
    },
    [scrollToTask, selectTaskOnMouseDown, task]
  );

  const onContextMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      handleOpenContextMenu(task, event.clientX, event.clientY);
    },
    [handleOpenContextMenu, task]
  );

  const isDraggedTaskAncestorOfDropTarget = (draggedItem: TaskOrEmpty) => {
    // check that the being drooped element is not a parent (direct or indirect of the target)
    let idToTaskIndex = new Map(tasks.map((task, index) => [task.id, index]));
    let parentId = task.parent;
    const parentsId: String[] = [];
    while (parentId) {
      parentsId.push(parentId);
      parentId = tasks[idToTaskIndex.get(parentId)].parent;
    }
    return parentsId.includes(draggedItem.id);
  };

  const [dropInsideProps, dropInside] = useDrop(
    {
      accept: ROW_DRAG_TYPE,

      drop: (item: TaskOrEmpty, monitor) => {
        if (
          monitor.didDrop() ||
          task.type === "empty" ||
          task.type === "milestone"
        ) {
          return;
        }

        handleMoveTasksInside(task, [item]);
      },

      canDrop: (draggedTask: TaskOrEmpty) => {
        if (!isDraggedTaskAncestorOfDropTarget(draggedTask)) {
          return (
            draggedTask.id !== id ||
            (draggedTask.comparisonLevel || 1) !== comparisonLevel
          );
        }
        return false;
      },

      collect: monitor => ({
        isLighten: monitor.canDrop() && monitor.isOver(),
      }),
    },
    [id, comparisonLevel, handleMoveTasksInside, task]
  );

  const [dropAfterProps, dropAfter] = useDrop(
    {
      accept: ROW_DRAG_TYPE,

      drop: (item: TaskOrEmpty) => {
        handleMoveTaskAfter(task, item);
      },
      canDrop: (draggedTask: TaskOrEmpty, monitor) => {
        const hoveringOnBrother =
          draggedTask.parent === task.parent &&
          tasks.findIndex(t => t.id === draggedTask.id) ===
            tasks.findIndex(t => t.id === task.id) + 1;
        if (
          monitor.isOver() &&
          !hoveringOnBrother &&
          draggedTask.id !== task.id
        ) {
          return !isDraggedTaskAncestorOfDropTarget(draggedTask);
        }
        return false;
      },
      collect: monitor => ({
        isLighten: monitor.canDrop(),
      }),
    },
    [id, comparisonLevel, handleMoveTaskAfter, task]
  );

  const [dropBeforeProps, dropBefore] = useDrop(
    {
      accept: ROW_DRAG_TYPE,
      canDrop(draggedTask, monitor) {
        const hoveringOnBrother =
          draggedTask.parent === task.parent &&
          tasks.findIndex(t => t.id === draggedTask.id) ===
            tasks.findIndex(t => t.id === task.id) - 1;
        if (
          monitor.isOver() &&
          !hoveringOnBrother &&
          draggedTask.id !== task.id
        ) {
          return !isDraggedTaskAncestorOfDropTarget(draggedTask);
        }
        return false;
      },
      drop: (draggedItem: TaskOrEmpty) => {
        handleMoveTaskBefore(task, draggedItem);
      },

      collect: monitor => ({
        isLighten: monitor.canDrop(),
      }),
    },
    [id, comparisonLevel, handleMoveTaskBefore, task]
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
      canMoveTasks,
      dateSetup,
      dependencies,
      depth,
      distances,
      handleDeteleTasks,
      handleAddTask,
      handleEditTask,
      hasChildren,
      icons,
      indexStr,
      isClosed,
      isShowTaskNumbers,
      onExpanderClick,
      task: task.type === "empty" ? task : getTaskCurrentState(task),
    }),
    [
      canMoveTasks,
      dateSetup,
      dependencies,
      depth,
      distances,
      getTaskCurrentState,
      handleDeteleTasks,
      handleAddTask,
      handleEditTask,
      hasChildren,
      icons,
      indexStr,
      isClosed,
      isShowTaskNumbers,
      onExpanderClick,
      task,
    ]
  );
  const dropPreviewOffset =
    distances.nestedTaskNameOffset * depth + distances.expandIconWidth;

  return (
    <div
      className={`${styles.taskListTableRow} ${
        dropInsideProps.isLighten &&
        !dropAfterProps.isLighten &&
        !dropBeforeProps.isLighten
          ? styles.lighten
          : ""
      } ${isCut ? styles.isCut : ""}`}
      onMouseDown={onRootMouseDown}
      style={{
        height: fullRowHeight,
        backgroundColor: isSelected
          ? colors.selectedTaskBackgroundColor
          : isEven && !dropInsideProps.isLighten
          ? colors.evenTaskBackgroundColor
          : undefined,
        ...style,
      }}
      onContextMenu={onContextMenu}
      ref={dropInside}
    >
      {columns.map(({ component: Component, width }, index) => {
        return (
          <div
            className={styles.taskListCell}
            style={{
              minWidth: width,
              maxWidth: width,
            }}
            key={index}
          >
            <Component data={columnData} />
          </div>
        );
      })}

      <div
        className={`${styles.dropBefore} ${
          dropBeforeProps.isLighten ? styles.dropBeforeLighten : ""
        }`}
        style={{ left: dropPreviewOffset }}
        ref={dropBefore}
      />
      <div
        className={`${styles.dropAfter} ${
          dropAfterProps.isLighten ? styles.dropAfterLighten : ""
        }`}
        style={{ left: dropPreviewOffset }}
        ref={dropAfter}
      />
    </div>
  );
};

export const TaskListTableRow = memo(TaskListTableRowInner);
