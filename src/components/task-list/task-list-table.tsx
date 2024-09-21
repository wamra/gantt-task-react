import React, { memo, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { checkHasChildren } from "../../helpers/check-has-children";
import { Task, TaskListTableProps } from "../../types/public-types";
import { TaskListTableRow } from "./task-list-table-row";

import styles from "./task-list-table.module.css";

const TaskListTableDefaultInner: React.FC<TaskListTableProps> = ({
  canMoveTasks,
  childTasksMap,
  colors,
  columns,
  cutIdsMirror,
  dateSetup,
  dependencyMap,
  distances,
  fontFamily,
  fontSize,
  fullRowHeight,
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
  onClick,
  onExpanderClick,
  renderedIndexes,
  scrollToTask,
  selectTaskOnMouseDown,
  selectedIdsMirror,
  tasks,
}) => {

  const renderedTasks = useMemo(
    /**
     * TO DO: maybe consider tasks on other levels?
     */
    () =>
      tasks.filter(task => !task.comparisonLevel || task.comparisonLevel === 1),
    [tasks]
  );

  const [draggedTask, setDraggedTask] = useState(null);

  const renderedListWithOffset = useMemo(() => {
    if (!renderedIndexes) {
      return null;
    }

    const [start, end] = renderedIndexes;

    const renderedList: ReactNode[] = [];

    for (let index = start; index <= end; ++index) {
      const task = renderedTasks[index];

      if (!task) {
        break;
      }

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

      renderedList.push(
        <TaskListTableRow
          canMoveTasks={canMoveTasks}
          colors={colors}
          columns={columns}
          dateSetup={dateSetup}
          dependencyMap={dependencyMap}
          depth={depth}
          distances={distances}
          fullRowHeight={fullRowHeight}
          getTaskCurrentState={getTaskCurrentState}
          handleAddTask={handleAddTask}
          handleDeleteTasks={handleDeleteTasks}
          handleEditTask={handleEditTask}
          handleMoveTaskBefore={handleMoveTaskBefore}
          handleMoveTaskAfter={handleMoveTaskAfter}
          handleMoveTasksInside={handleMoveTasksInside}
          handleOpenContextMenu={handleOpenContextMenu}
          hasChildren={checkHasChildren(task, childTasksMap)}
          icons={icons}
          indexStr={indexStr}
          isClosed={Boolean((task as Task)?.hideChildren)}
          isCut={cutIdsMirror[id]}
          isEven={index % 2 === 1}
          isSelected={selectedIdsMirror[id]}
          isShowTaskNumbers={isShowTaskNumbers}
          onClick={onClick}
          onExpanderClick={onExpanderClick}
          scrollToTask={scrollToTask}
          selectTaskOnMouseDown={selectTaskOnMouseDown}
          task={task}
          key={id}
          tasks={tasks}
          draggedTask={draggedTask}
          setDraggedTask={setDraggedTask}
          style={colors}
        />
      );
    }

    return (
      <>
        <div
          style={{
            height: fullRowHeight * start,
          }}
        />

        {renderedList}
      </>
    );
  }, [
    colors,
    columns,
    cutIdsMirror,
    fullRowHeight,
    getTaskCurrentState,
    renderedIndexes,
    renderedTasks,
    selectTaskOnMouseDown,
    selectedIdsMirror,
    draggedTask,
  ]);

  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {renderedListWithOffset}
    </div>
  );
};

export const TaskListTableDefault = memo(TaskListTableDefaultInner);
