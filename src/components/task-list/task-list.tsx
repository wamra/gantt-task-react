import React, { memo } from "react";
import type { ComponentType, MouseEvent, RefObject } from "react";

import {
  ChildByLevelMap,
  ColorStyles,
  Column,
  DateSetup,
  DependencyMap,
  Distances,
  Icons,
  MapTaskToNestedIndex,
  OnResizeColumn,
  Task,
  TaskListHeaderProps,
  TaskListTableProps,
  TaskOrEmpty,
} from "../../types/public-types";

import { useOptimizedList } from "../../helpers/use-optimized-list";

import styles from "./task-list.module.css";
import { useTableListResize } from "../gantt/use-tablelist-resize";

// const SCROLL_DELAY = 25;

export type TaskListProps = {
  canMoveTasks: boolean;
  canResizeColumns: boolean;
  childTasksMap: ChildByLevelMap;
  colors: ColorStyles;
  columnsProp: readonly Column[];
  cutIdsMirror: Readonly<Record<string, true>>;
  dateSetup: DateSetup;
  dependencyMap: DependencyMap;
  distances: Distances;
  fontFamily: string;
  fontSize: string;
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
  TaskListHeader: ComponentType<TaskListHeaderProps>;
  TaskListTable: ComponentType<TaskListTableProps>;
  onResizeColumn?: OnResizeColumn;
};

const TaskListInner: React.FC<TaskListProps> = ({
  canMoveTasks,
  canResizeColumns,
  childTasksMap,
  colors,
  columnsProp,
  cutIdsMirror,
  dateSetup,
  dependencyMap,
  distances,
  fontFamily,
  fontSize,
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
  icons = undefined,
  isShowTaskNumbers,
  mapTaskToNestedIndex,
  onExpanderClick,
  onClick,
  scrollToTask,
  selectTaskOnMouseDown,
  selectedIdsMirror,
  taskListContainerRef,
  taskListRef,
  tasks,
  TaskListHeader,
  TaskListTable,
  onResizeColumn,
}) => {
  // Manage the column and list table resizing
  const [
    columns,
    taskListWidth,
    tableWidth,
    onTableResizeStart,
    onColumnResizeStart,
  ] = useTableListResize(columnsProp, distances, onResizeColumn);

  const renderedIndexes = useOptimizedList(
    taskListContainerRef,
    "scrollTop",
    fullRowHeight
  );

  // const [{ isScrollingToTop }, scrollToTopRef] = useDrop(
  //   {
  //     accept: ROW_DRAG_TYPE,

  //     collect: monitor => ({
  //       isScrollingToTop: monitor.isOver(),
  //     }),

  //     canDrop: () => false,
  //   },
  //   []
  // );

  // const [{ isScrollingToBottom }, scrollToBottomRef] = useDrop(
  //   {
  //     accept: ROW_DRAG_TYPE,

  //     collect: monitor => ({
  //       isScrollingToBottom: monitor.isOver(),
  //     }),

  //     canDrop: () => false,
  //   },
  //   [scrollToBottomStep]
  // );
  // const isScrollingToTop = false;
  // const isScrollingToBottom = false;
  // useEffect(() => {
  //   if (!isScrollingToTop) {
  //     return undefined;
  //   }

  //   const intervalId = setInterval(() => {
  //     scrollToTopStep();
  //   }, SCROLL_DELAY);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [isScrollingToTop, scrollToTopStep]);

  // useEffect(() => {
  //   if (!isScrollingToBottom) {
  //     return undefined;
  //   }

  //   const intervalId = setInterval(() => {
  //     scrollToBottomStep();
  //   }, SCROLL_DELAY);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [isScrollingToBottom, scrollToBottomStep]);

  return (
    <div className={styles.taskListRoot} ref={taskListRef}>
      <div
        className={styles.taskListHorizontalScroll}
        style={{
          width: tableWidth,
        }}
      >
        <TaskListHeader
          headerHeight={distances.headerHeight}
          fontFamily={fontFamily}
          fontSize={fontSize}
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
              <TaskListTable
                canMoveTasks={canMoveTasks}
                childTasksMap={childTasksMap}
                colors={colors}
                columns={columns}
                cutIdsMirror={cutIdsMirror}
                dateSetup={dateSetup}
                dependencyMap={dependencyMap}
                distances={distances}
                fontFamily={fontFamily}
                fontSize={fontSize}
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
