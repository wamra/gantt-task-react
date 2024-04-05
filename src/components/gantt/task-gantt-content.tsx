import React, { useMemo } from "react";
import type { MouseEvent, ReactNode } from "react";

import {
  ChildByLevelMap,
  ChildOutOfParentWarnings,
  CriticalPaths,
  DependencyMap,
  DependentMap,
  Distances,
  FixPosition,
  GlobalRowIndexToTaskMap,
  RelationKind,
  Task,
  TaskCoordinates,
  TaskOrEmpty,
  TaskToHasDependencyWarningMap,
} from "../../types/public-types";
import { Arrow } from "../other/arrow";
import { RelationLine } from "../other/relation-line";
import { TaskItem } from "../task-item/task-item";
import {
  BarMoveAction,
  GanttRelationEvent,
  RelationMoveTarget,
} from "../../types/gantt-task-actions";
import { checkHasChildren } from "../../helpers/check-has-children";
import { checkTaskHasDependencyWarning } from "../../helpers/check-task-has-dependency-warning";
import type { OptimizedListParams } from "../../helpers/use-optimized-list";

export type TaskGanttContentProps = {
  authorizedRelations: RelationKind[];
  additionalLeftSpace: number;
  additionalRightSpace: number;
  checkIsHoliday: (date: Date) => boolean;
  childOutOfParentWarnings: ChildOutOfParentWarnings | null;
  childTasksMap: ChildByLevelMap;
  comparisonLevels: number;
  criticalPaths: CriticalPaths | null;
  dependencyMap: DependencyMap;
  dependentMap: DependentMap;
  distances: Distances;
  endColumnIndex: number;
  fixEndPosition?: FixPosition;
  fixStartPosition?: FixPosition;
  fullRowHeight: number;
  ganttRelationEvent: GanttRelationEvent | null;
  getDate: (index: number) => Date;
  getTaskCoordinates: (task: Task) => TaskCoordinates;
  getTaskGlobalIndexByRef: (task: Task) => number;
  handleBarRelationStart: (target: RelationMoveTarget, task: Task) => void;
  handleDeleteTasks: (task: TaskOrEmpty[]) => void;
  handleFixDependency: (task: Task, delta: number) => void;
  handleTaskDragStart: (
    action: BarMoveAction,
    task: Task,
    clientX: number,
    taskRootNode: Element
  ) => void;
  isShowDependencyWarnings: boolean;
  mapGlobalRowIndexToTask: GlobalRowIndexToTaskMap;
  onArrowDoubleClick: (taskFrom: Task, taskTo: Task) => void;
  onClick?: (task: Task, event: React.MouseEvent<SVGElement>) => void;
  onDoubleClick?: (task: Task) => void;
  renderedRowIndexes: OptimizedListParams | null;
  rtl: boolean;
  selectTaskOnMouseDown: (taskId: string, event: MouseEvent) => void;
  selectedIdsMirror: Readonly<Record<string, true>>;
  setTooltipTask: (task: Task | null, element: Element | null) => void;
  startColumnIndex: number;
  taskToHasDependencyWarningMap: TaskToHasDependencyWarningMap | null;
  taskYOffset: number;
  visibleTasksMirror: Readonly<Record<string, true>>;
  taskHeight: number;
  taskHalfHeight: number;
};

export const TaskGanttContent: React.FC<TaskGanttContentProps> = ({
  authorizedRelations,
  additionalLeftSpace,
  additionalRightSpace,
  checkIsHoliday,
  childOutOfParentWarnings,
  childTasksMap,
  comparisonLevels,
  criticalPaths,
  dependencyMap,
  dependentMap,
  distances,
  endColumnIndex,
  fixEndPosition = undefined,
  fixStartPosition = undefined,
  fullRowHeight,
  ganttRelationEvent,
  getDate,
  getTaskCoordinates,
  getTaskGlobalIndexByRef,
  handleBarRelationStart,
  handleDeleteTasks,
  handleFixDependency,
  handleTaskDragStart,
  isShowDependencyWarnings,
  mapGlobalRowIndexToTask,
  onArrowDoubleClick,
  onDoubleClick,
  onClick,
  renderedRowIndexes,
  rtl,
  selectTaskOnMouseDown,
  selectedIdsMirror,
  setTooltipTask,
  startColumnIndex,
  taskToHasDependencyWarningMap,
  taskYOffset,
  taskHeight,
  taskHalfHeight,
  visibleTasksMirror,
}) => {
  const renderedHolidays = useMemo(() => {
    const { columnWidth } = distances;

    const res: ReactNode[] = [];

    for (let i = startColumnIndex; i <= endColumnIndex; ++i) {
      const date = getDate(i);

      if (checkIsHoliday(date)) {
        res.push(
          <rect
            height="100%"
            width={columnWidth}
            x={additionalLeftSpace + i * columnWidth}
            y={0}
            fill={'var(--gantt-calendar-holiday-color)'}
            key={i}
          />
        );
      }
    }

    return res;
  }, [
    additionalLeftSpace,
    checkIsHoliday,
    distances,
    endColumnIndex,
    getDate,
    startColumnIndex,
  ]);

  const [renderedTasks, renderedArrows, renderedSelectedTasks] = useMemo(() => {
    if (!renderedRowIndexes) {
      return [null, null, null];
    }

    const [start, end] = renderedRowIndexes;

    const tasksRes: ReactNode[] = [];
    const arrowsRes: ReactNode[] = [];
    const selectedTasksRes: ReactNode[] = [];

    // task id -> true
    const addedSelectedTasks: Record<string, true> = {};

    // avoid duplicates
    // comparison level -> task from id -> task to id -> true
    const addedDependencies: Record<
      string,
      Record<string, Record<string, true>>
    > = {};

    for (let index = start; index <= end; ++index) {
      const task = mapGlobalRowIndexToTask.get(index);

      if (!task) {
        continue;
      }

      const { comparisonLevel = 1, id: taskId } = task;

      if (selectedIdsMirror[taskId] && !addedSelectedTasks[taskId]) {
        addedSelectedTasks[taskId] = true;

        selectedTasksRes.push(
          <rect
            x={0}
            y={Math.floor(index / comparisonLevels) * fullRowHeight}
            width="100%"
            height={fullRowHeight}
            fill={'var(--gantt-table-selected-task-background-color)'}
            key={taskId}
          />
        );
      }

      if (comparisonLevel > comparisonLevels) {
        continue;
      }

      if (task.type === "empty") {
        continue;
      }

      const key = `${comparisonLevel}_${task.id}`;

      const criticalPathOnLevel = criticalPaths
        ? criticalPaths.get(comparisonLevel)
        : undefined;

      const isCritical = criticalPathOnLevel
        ? criticalPathOnLevel.tasks.has(task.id)
        : false;

      const {
        containerX,
        containerWidth,
        innerX1,
        innerX2,
        width,
        levelY,
        progressWidth,
        x1: taskX1,
        x2: taskX2,
      } = getTaskCoordinates(task);

      tasksRes.push(
        <svg
          id={task.id}
          className="TaskItemClassName"
          x={containerX + (additionalLeftSpace || 0)}
          y={levelY}
          width={containerWidth}
          height={fullRowHeight}
          key={key}
        >
          <TaskItem
            getTaskGlobalIndexByRef={getTaskGlobalIndexByRef}
            hasChildren={checkHasChildren(task, childTasksMap)}
            hasDependencyWarning={
              taskToHasDependencyWarningMap
                ? checkTaskHasDependencyWarning(
                    task,
                    taskToHasDependencyWarningMap
                  )
                : false
            }
            progressWidth={progressWidth}
            progressX={rtl ? innerX2 : innerX1}
            selectTaskOnMouseDown={selectTaskOnMouseDown}
            task={task}
            taskYOffset={taskYOffset}
            width={width}
            x1={innerX1}
            x2={innerX2}
            childOutOfParentWarnings={childOutOfParentWarnings}
            distances={distances}
            taskHeight={taskHeight}
            taskHalfHeight={taskHalfHeight}
            isProgressChangeable={!task.isDisabled}
            isDateChangeable={!task.isDisabled}
            isRelationChangeable={!task.isDisabled}
            authorizedRelations={authorizedRelations}
            ganttRelationEvent={ganttRelationEvent}
            isDelete={!task.isDisabled}
            onDoubleClick={onDoubleClick}
            onClick={onClick}
            onEventStart={handleTaskDragStart}
            setTooltipTask={setTooltipTask}
            onRelationStart={handleBarRelationStart}
            isSelected={Boolean(selectedIdsMirror[taskId])}
            isCritical={isCritical}
            rtl={rtl}
            fixStartPosition={fixStartPosition}
            fixEndPosition={fixEndPosition}
            handleDeleteTasks={handleDeleteTasks}
          />
        </svg>
      );

      const addedDependenciesAtLevel = addedDependencies[comparisonLevel] || {};
      if (!addedDependencies[comparisonLevel]) {
        addedDependencies[comparisonLevel] = addedDependenciesAtLevel;
      }

      const addedDependenciesAtTask = addedDependenciesAtLevel[taskId] || {};
      if (!addedDependenciesAtLevel[taskId]) {
        addedDependenciesAtLevel[taskId] = addedDependenciesAtTask;
      }

      const dependenciesAtLevel = dependencyMap.get(comparisonLevel);

      if (!dependenciesAtLevel) {
        continue;
      }

      const dependenciesByTask = dependenciesAtLevel.get(taskId);

      if (dependenciesByTask) {
        const criticalPathForTask = criticalPathOnLevel
          ? criticalPathOnLevel.dependencies.get(task.id)
          : undefined;

        dependenciesByTask
          .filter(({ source }) => visibleTasksMirror[source.id])
          .forEach(
            ({
              containerHeight,
              containerY,
              innerFromY,
              innerToY,
              marginBetweenTasks,
              ownTarget,
              source,
              sourceTarget,
            }) => {
              if (addedDependenciesAtTask[source.id]) {
                return;
              }

              addedDependenciesAtTask[source.id] = true;

              const isCritical = criticalPathForTask
                ? criticalPathForTask.has(source.id)
                : false;

              const { x1: fromX1, x2: fromX2 } = getTaskCoordinates(source);

              const containerX = Math.min(fromX1, taskX1) - 300;
              const containerWidth =
                Math.max(fromX2, taskX2) - containerX + 300;

              arrowsRes.push(
                <svg
                  x={containerX + (additionalLeftSpace || 0)}
                  y={containerY}
                  width={containerWidth}
                  height={containerHeight}
                  key={`Arrow from ${source.id} to ${taskId} on ${comparisonLevel}`}
                >
                  <Arrow
                    distances={distances}
                    taskFrom={source}
                    targetFrom={sourceTarget}
                    fromX1={fromX1 - containerX}
                    fromX2={fromX2 - containerX}
                    fromY={innerFromY}
                    taskTo={task}
                    targetTo={ownTarget}
                    toX1={taskX1 - containerX}
                    toX2={taskX2 - containerX}
                    toY={innerToY}
                    marginBetweenTasks={marginBetweenTasks}
                    fullRowHeight={fullRowHeight}
                    taskHeight={taskHeight}
                    isShowDependencyWarnings={isShowDependencyWarnings}
                    isCritical={isCritical}
                    rtl={rtl}
                    onArrowDoubleClick={onArrowDoubleClick}
                    handleFixDependency={handleFixDependency}
                  />
                </svg>
              );
            }
          );
      }

      const dependentsAtLevel = dependentMap.get(comparisonLevel);

      if (!dependentsAtLevel) {
        continue;
      }

      const dependentsByTask = dependentsAtLevel.get(taskId);

      if (dependentsByTask) {
        dependentsByTask
          .filter(({ dependent }) => visibleTasksMirror[dependent.id])
          .forEach(
            ({
              containerHeight,
              containerY,
              innerFromY,
              innerToY,
              marginBetweenTasks,
              ownTarget,
              dependent,
              dependentTarget,
            }) => {
              const addedDependenciesAtDependent =
                addedDependenciesAtLevel[dependent.id] || {};
              if (!addedDependenciesAtLevel[dependent.id]) {
                addedDependenciesAtLevel[dependent.id] =
                  addedDependenciesAtDependent;
              }

              if (addedDependenciesAtDependent[taskId]) {
                return;
              }

              addedDependenciesAtDependent[taskId] = true;

              const criticalPathForTask = criticalPathOnLevel
                ? criticalPathOnLevel.dependencies.get(dependent.id)
                : undefined;

              const isCritical = criticalPathForTask
                ? criticalPathForTask.has(task.id)
                : false;

              const { x1: toX1, x2: toX2 } = getTaskCoordinates(dependent);

              const containerX = Math.min(toX1, taskX1) - 300;
              const containerWidth = Math.max(toX2, taskX2) - containerX + 300;

              arrowsRes.push(
                <svg
                  x={containerX + (additionalLeftSpace || 0)}
                  y={containerY}
                  width={containerWidth}
                  height={containerHeight}
                  key={`Arrow from ${taskId} to ${dependent.id} on ${comparisonLevel}`}
                >
                  <Arrow
                    distances={distances}
                    taskFrom={task}
                    targetFrom={ownTarget}
                    fromX1={taskX1 - containerX}
                    fromX2={taskX2 - containerX}
                    fromY={innerFromY}
                    taskTo={dependent}
                    targetTo={dependentTarget}
                    toX1={toX1 - containerX}
                    toX2={toX2 - containerX}
                    toY={innerToY}
                    marginBetweenTasks={marginBetweenTasks}
                    fullRowHeight={fullRowHeight}
                    taskHeight={taskHeight}
                    isShowDependencyWarnings={isShowDependencyWarnings}
                    isCritical={isCritical}
                    rtl={rtl}
                    onArrowDoubleClick={onArrowDoubleClick}
                    handleFixDependency={handleFixDependency}
                  />
                </svg>
              );
            }
          );
      }
    }

    return [tasksRes, arrowsRes, selectedTasksRes];
  }, [
    additionalLeftSpace,
    additionalRightSpace,
    dependencyMap,
    dependentMap,
    fullRowHeight,
    ganttRelationEvent,
    getTaskCoordinates,
    mapGlobalRowIndexToTask,
    renderedRowIndexes,
    selectTaskOnMouseDown,
    selectedIdsMirror,
    visibleTasksMirror,
  ]);

  return (
    <g className="content">
      {renderedSelectedTasks}

      <g>{renderedHolidays}</g>

      <g
        className="arrows"
        fill={'var(--gantt-arrow-color)'}
        stroke={'var(--gantt-arrow-color)'}
      >
        {renderedArrows}
      </g>

      <g className="bar" fontFamily={'var(--gantt-font-family)'} fontSize={'var(--gantt-font-size)'}>
        {renderedTasks}
      </g>

      {ganttRelationEvent && (
        <RelationLine
          x1={ganttRelationEvent.startX}
          x2={ganttRelationEvent.endX}
          y1={ganttRelationEvent.startY}
          y2={ganttRelationEvent.endY}
        />
      )}
    </g>
  );
};
