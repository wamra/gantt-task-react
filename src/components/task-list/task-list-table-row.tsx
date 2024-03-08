import React, { memo, useCallback, useMemo, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";

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
  handleDeleteTasks: (task: TaskOrEmpty[]) => void;
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
  draggedTask: TaskOrEmpty;
  setDraggedTask: React.Dispatch<any>;
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
  handleDeleteTasks,
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
  draggedTask,
  setDraggedTask,
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
      handleDeleteTasks,
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
      handleDeleteTasks,
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

  const [hoveringState, setHoveringState] = useState({
    hoveringBefore: false,
    hoveringInside: false,
    hoveringAfter: false,
  });

  let backgroundColor = isSelected
    ? colors.selectedTaskBackgroundColor
    : isEven && !hoveringState.hoveringInside
    ? colors.evenTaskBackgroundColor
    : undefined;
  if (
    hoveringState.hoveringInside &&
    !hoveringState.hoveringAfter &&
    !hoveringState.hoveringBefore
  ) {
    backgroundColor = colors.taskDragColor;
  }

  const handleDragStart: React.DragEventHandler<HTMLDivElement> = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    setDraggedTask(task);
    event.dataTransfer.setData("draggedTask", task?.id);
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = event => {
    event.preventDefault();
  };

  const handleDragEnd: React.DragEventHandler<HTMLDivElement> = () => {
    setDraggedTask(null);
  };

  const canDropBefore = (): boolean => {
    let canDropBefore = false;

    if (draggedTask) {
      const hoveringOnBrother =
        draggedTask.parent === task.parent &&
        tasks.findIndex(t => t.id === draggedTask.id) ===
          tasks.findIndex(t => t.id === task.id) - 1;
      if (!hoveringOnBrother && draggedTask.id !== task.id) {
        canDropBefore = !isDraggedTaskAncestorOfDropTarget(draggedTask);
      }
    }
    return canDropBefore;
  };

  const dropBefore = () => {
    if (canDropBefore()) {
      handleMoveTaskBefore(task, draggedTask);
    }
    setHoveringState({
      hoveringBefore: false,
      hoveringInside: false,
      hoveringAfter: false,
    });
  };

  const canDropAfter = (): boolean => {
    let canDropAfter = false;

    if (draggedTask) {
      const hoveringOnBrother =
        draggedTask.parent === task.parent &&
        tasks.findIndex(t => t.id === draggedTask.id) ===
          tasks.findIndex(t => t.id === task.id) + 1;
      if (!hoveringOnBrother && draggedTask.id !== task.id) {
        canDropAfter = !isDraggedTaskAncestorOfDropTarget(draggedTask);
      }
    }
    return canDropAfter;
  };

  const dropAfter = () => {
    if (canDropAfter()) {
      handleMoveTaskAfter(task, draggedTask);
    }
    setHoveringState({
      hoveringBefore: false,
      hoveringInside: false,
      hoveringAfter: false,
    });
  };

  const canDropInside = (): boolean => {
    let canDropInside = false;
    if (task.type !== "empty" && task.type !== "milestone") {
      if (draggedTask) {
        if (!isDraggedTaskAncestorOfDropTarget(draggedTask)) {
          canDropInside =
            draggedTask.id !== id ||
            (draggedTask.comparisonLevel || 1) !== comparisonLevel;
        }
      }
    }
    return canDropInside;
  };

  const dropInside: React.DragEventHandler<HTMLDivElement> = () => {
    if (canDropInside() && task.type !== "empty") {
      handleMoveTasksInside(task, [draggedTask]);
    }
    setHoveringState({
      hoveringBefore: false,
      hoveringInside: false,
      hoveringAfter: false,
    });
  };

  return (
    <div
      className={`${styles.taskListTableRow} ${isCut ? styles.isCut : ""}`}
      onMouseDown={onRootMouseDown}
      style={{
        height: fullRowHeight,
        backgroundColor: backgroundColor,
        ...style,
      }}
      onContextMenu={onContextMenu}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
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
            <div
              className={styles.taskListCellInner}
              onDragEnter={() => {
                setHoveringState({
                  hoveringBefore: false,
                  hoveringInside: canDropInside(),
                  hoveringAfter: false,
                });
              }}
              onDragLeave={() => {
                setHoveringState(prevState => {
                  return { ...prevState, hoveringInside: false };
                });
              }}
              onDragOver={event => {
                event.preventDefault();
                event.dataTransfer.dropEffect = canDropInside()
                  ? "move"
                  : "none";
              }}
              onDrop={dropInside}
              style={{
                height: Math.max(0, fullRowHeight - 2 * 8),
              }}
            >
              <div
                style={{
                  pointerEvents: hoveringState.hoveringInside ? "none" : "auto",
                }}
              >
                <Component data={columnData} />
              </div>
            </div>
          </div>
        );
      })}

      <div
        data-testid={`table-row-drop-before-${task.name}`}
        className={`${styles.dropBefore} ${
          hoveringState.hoveringBefore ? styles.dropBeforeLighten : ""
        }`}
        style={{
          left: dropPreviewOffset,
          backgroundColor: hoveringState.hoveringBefore
            ? colors.taskDragColor
            : undefined,
          color: hoveringState.hoveringBefore
            ? colors.taskDragColor
            : undefined,
        }}
        onDragEnter={event => {
          event.preventDefault();
          setHoveringState({
            hoveringBefore: canDropBefore(),
            hoveringInside: false,
            hoveringAfter: false,
          });
        }}
        onDragLeave={() => {
          setHoveringState(prevState => {
            return { ...prevState, hoveringBefore: false };
          });
        }}
        onDragOver={event => {
          event.preventDefault();
          event.dataTransfer.dropEffect = canDropBefore() ? "move" : "none";
        }}
        onDrop={dropBefore}
      />
      <div
        data-testid={`table-row-drop-after-${task.name}`}
        className={`${styles.dropAfter} ${
          hoveringState.hoveringAfter ? styles.dropBeforeLighten : ""
        }`}
        style={{
          left: dropPreviewOffset,
          backgroundColor: hoveringState.hoveringAfter
            ? colors.taskDragColor
            : undefined,
          color: hoveringState.hoveringAfter ? colors.taskDragColor : undefined,
        }}
        onDragEnter={() =>
          setHoveringState({
            hoveringBefore: false,
            hoveringInside: false,
            hoveringAfter: canDropAfter(),
          })
        }
        onDragLeave={() =>
          setHoveringState(prevState => {
            return { ...prevState, hoveringAfter: false };
          })
        }
        onDragOver={event => {
          event.preventDefault();
          event.dataTransfer.dropEffect = canDropAfter() ? "move" : "none";
        }}
        onDrop={dropAfter}
      />
    </div>
  );
};

export const TaskListTableRow = memo(TaskListTableRowInner);
