import React, { memo } from "react";
import type {
  ComponentType,
  MouseEvent,
  RefObject,
  SyntheticEvent,
} from "react";

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
  scrollToTask: (task: Task) => void;
  selectTaskOnMouseDown: (taskId: string, event: MouseEvent) => void;
  selectedIdsMirror: Readonly<Record<string, true>>;
  taskListContentRef: RefObject<HTMLDivElement>;
  taskListRef: RefObject<HTMLDivElement>;
  tasks: readonly TaskOrEmpty[];
  TaskListHeader: ComponentType<TaskListHeaderProps>;
  TaskListTable: ComponentType<TaskListTableProps>;
  onResizeColumn?: OnResizeColumn;
  onScrollTableListContentVertically: (
    event: SyntheticEvent<HTMLDivElement>
  ) => void;
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
  taskListContentRef,
  taskListRef,
  tasks,
  TaskListHeader,
  TaskListTable,
  onResizeColumn,
  onScrollTableListContentVertically,
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
    taskListContentRef,
    "scrollTop",
    fullRowHeight
  );

  return (
    <div className={styles.ganttTableRoot} ref={taskListRef}>
      <div
        className={styles.ganttTableWrapper}
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

        <div
          className={styles.taskListContent}
          ref={taskListContentRef}
          onScroll={onScrollTableListContentVertically}
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
