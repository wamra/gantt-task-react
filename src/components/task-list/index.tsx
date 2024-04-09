import type { MouseEvent, RefObject } from "react";
import React, { memo, useCallback } from "react";

import {
  AllowMoveTask,
  ChildByLevelMap,
  Column,
  DateSetup,
  DependencyMap,
  Distances,
  Icons,
  MapTaskToNestedIndex,
  OnResizeColumn,
  Task,
  TaskListTableRowProps,
  TaskOrEmpty,
} from "../../types/public-types";

import { useOptimizedList } from "../../helpers/use-optimized-list";
import { useTableListResize } from "../gantt/use-tablelist-resize";
import { TaskListTableHeaders } from "./task-list-table-headers";
import { TaskListSortableTable } from "./task-list-sortable-table";
import { TaskListTable } from "./task-list-table";
import styles from "./task-list.module.css";
import { checkHasChildren } from "../../helpers/check-has-children";

export type TaskListProps = {
  ganttRef: RefObject<HTMLDivElement>;
  allowMoveTask: AllowMoveTask;
  canMoveTasks: boolean;
  canResizeColumns: boolean;
  childTasksMap: ChildByLevelMap;
  columnsProp: readonly Column[];
  cutIdsMirror: Readonly<Record<string, true>>;
  dateSetup: DateSetup;
  dependencyMap: DependencyMap;
  distances: Distances;
  fullRowHeight: number;
  ganttFullHeight: number;
  ganttHeight: number;
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
  icons?: Partial<Icons>;
  isShowTaskNumbers: boolean;
  mapTaskToNestedIndex: MapTaskToNestedIndex;
  onClick?: (task: TaskOrEmpty) => void;
  onExpanderClick: (task: Task) => void;
  scrollToBottomStep: () => void;
  scrollToTask: (task: Task) => void;
  scrollToTopStep: () => void;
  selectTaskOnMouseDown: (taskId: string, event: MouseEvent) => void;
  selectedIdsMirror: Readonly<Record<string, true>>;
  taskListContainerRef: RefObject<HTMLDivElement>;
  taskListRef: RefObject<HTMLDivElement>;
  tasks: readonly TaskOrEmpty[];
  onResizeColumn?: OnResizeColumn;
};

const TaskListInner: React.FC<TaskListProps> = ({
  allowMoveTask,
  canResizeColumns,
  childTasksMap,
  columnsProp,
  cutIdsMirror,
  dateSetup,
  dependencyMap,
  distances,
  fullRowHeight,
  ganttFullHeight,
  ganttHeight,
  getTaskCurrentState,
  handleAddTask,
  handleDeleteTasks,
  handleEditTask,
  handleMoveTaskBefore,
  handleMoveTaskAfter,
  handleMoveTasksInside,
  handleOpenContextMenu,
  icons,
  isShowTaskNumbers,
  mapTaskToNestedIndex,
  onExpanderClick,
  onClick,
  scrollToTask,
  selectTaskOnMouseDown,
  selectedIdsMirror,
  ganttRef,
  taskListContainerRef,
  taskListRef,
  tasks,
  onResizeColumn,
  canMoveTasks,
}) => {
  // Manage the column and list table resizing
  const [
    columns,
    taskListWidth,
    tableWidth,
    onTableResizeStart,
    onColumnResizeStart,
  ] = useTableListResize(columnsProp, canMoveTasks, onResizeColumn, ganttRef);

  const renderedIndexes = useOptimizedList(
    taskListContainerRef,
    "scrollTop",
    fullRowHeight
  );

  const getTableRowProps = useCallback(
    (task: TaskOrEmpty, index: number) => {
      const { id, comparisonLevel = 1 } = task;
      const indexesOnLevel = mapTaskToNestedIndex.get(comparisonLevel);
      if (!indexesOnLevel) {
        throw new Error(`Indexes are not found for level ${comparisonLevel}`);
      }

      const taskIndex = indexesOnLevel.get(id);

      if (!taskIndex) {
        throw new Error(`Index is not found for task ${id}`);
      }

      const [depth, indexStr] = taskIndex;

      return {
        columns: columns,
        dateSetup: dateSetup,
        dependencyMap: dependencyMap,
        distances: distances,
        fullRowHeight: fullRowHeight,
        getTaskCurrentState: getTaskCurrentState,
        handleAddTask: handleAddTask,
        handleDeleteTasks: handleDeleteTasks,
        handleEditTask: handleEditTask,
        handleOpenContextMenu: handleOpenContextMenu,
        hasChildren: checkHasChildren(task, childTasksMap),
        icons: icons,
        indexStr: indexStr,
        isClosed: Boolean((task as Task)?.hideChildren),
        isCut: cutIdsMirror[id],
        isEven: index % 2 === 1,
        isSelected: selectedIdsMirror[id],
        isShowTaskNumbers: isShowTaskNumbers,
        onClick: onClick,
        onExpanderClick: onExpanderClick,
        scrollToTask: scrollToTask,
        selectTaskOnMouseDown: selectTaskOnMouseDown,
        task: task,
        depth: depth,
      } as TaskListTableRowProps;
    },
    [
      childTasksMap,
      columns,
      cutIdsMirror,
      dateSetup,
      dependencyMap,
      distances,
      fullRowHeight,
      getTaskCurrentState,
      handleAddTask,
      handleDeleteTasks,
      handleEditTask,
      handleOpenContextMenu,
      icons,
      isShowTaskNumbers,
      mapTaskToNestedIndex,
      onClick,
      onExpanderClick,
      scrollToTask,
      selectTaskOnMouseDown,
      selectedIdsMirror,
    ]
  );

  const RenderTaskListTable = canMoveTasks
    ? TaskListSortableTable
    : TaskListTable;

  return (
    <div className={styles.taskListRoot} ref={taskListRef}>
      <div
        className={styles.taskListHorizontalScroll}
        style={{
          width: tableWidth,
        }}
      >
        <TaskListTableHeaders
          canMoveTasks={canMoveTasks}
          headerHeight={distances.headerHeight}
          columns={columns}
          onColumnResizeStart={onColumnResizeStart}
          canResizeColumns={canResizeColumns}
        />

        <div className={styles.tableWrapper}>
          <div
            ref={taskListContainerRef}
            className={styles.horizontalContainer}
            style={{
              height: Math.max(
                ganttHeight,
                distances.minimumRowDisplayed * distances.rowHeight
              ),
              width: taskListWidth,
            }}
          >
            <div
              style={{
                height: Math.max(
                  ganttFullHeight,
                  distances.minimumRowDisplayed * distances.rowHeight
                ),
                backgroundSize: `100% ${fullRowHeight * 2}px`,
                backgroundImage: `linear-gradient(to bottom, transparent ${fullRowHeight}px, #f5f5f5 ${fullRowHeight}px)`,
              }}
            >
              <RenderTaskListTable
                ganttRef={ganttRef}
                getTableRowProps={getTableRowProps}
                canMoveTasks={canMoveTasks}
                allowMoveTask={allowMoveTask}
                childTasksMap={childTasksMap}
                columns={columns}
                cutIdsMirror={cutIdsMirror}
                dateSetup={dateSetup}
                dependencyMap={dependencyMap}
                distances={distances}
                fullRowHeight={fullRowHeight}
                ganttFullHeight={ganttFullHeight}
                getTaskCurrentState={getTaskCurrentState}
                handleAddTask={handleAddTask}
                handleDeleteTasks={handleDeleteTasks}
                handleEditTask={handleEditTask}
                handleMoveTaskBefore={handleMoveTaskBefore}
                handleMoveTaskAfter={handleMoveTaskAfter}
                handleMoveTasksInside={handleMoveTasksInside}
                handleOpenContextMenu={handleOpenContextMenu}
                icons={icons}
                isShowTaskNumbers={isShowTaskNumbers}
                mapTaskToNestedIndex={mapTaskToNestedIndex}
                onClick={onClick}
                onExpanderClick={onExpanderClick}
                renderedIndexes={renderedIndexes}
                scrollToTask={scrollToTask}
                selectTaskOnMouseDown={selectTaskOnMouseDown}
                selectedIdsMirror={selectedIdsMirror}
                taskListWidth={taskListWidth}
                tasks={tasks}
              />
            </div>
          </div>

          <div
            className={`${styles.scrollToTop} ${
              !renderedIndexes || renderedIndexes[2] ? styles.hidden : ""
            }`}
          />

          <div
            className={`${styles.scrollToBottom} ${
              !renderedIndexes || renderedIndexes[3] ? styles.hidden : ""
            }`}
          />
        </div>
      </div>

      <div
        className={styles.taskListResizer}
        onMouseDown={event => {
          onTableResizeStart(event.clientX);
        }}
        onTouchStart={event => {
          const firstTouch = event.touches[0];

          if (firstTouch) {
            onTableResizeStart(firstTouch.clientX);
          }
        }}
      />
    </div>
  );
};

export const TaskList = memo(TaskListInner);
