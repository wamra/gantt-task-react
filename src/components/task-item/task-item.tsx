import type { MouseEvent, MouseEventHandler } from "react";
import React, { memo, useCallback, useMemo, useRef } from "react";

import {
  TaskBarMoveAction,
  Distances,
  GanttTaskBarActions,
  GanttRelationEvent,
  RelationKind,
  RelationMoveTarget,
  Task,
  TaskOrEmpty,
} from "../../types";
import { Bar } from "./bar";
import { Milestone } from "./milestone";
import { BarRelationHandle } from "./bar-relation";
import { TaskResponsiveLabel } from "./task-label";

export interface TaskItemProps extends GanttTaskBarActions {
  hasChildren: boolean;
  progressWidth: number;
  progressX: number;
  task: Task;
  taskYOffset: number;
  width: number;
  x1: number;
  x2: number;
  distances: Distances;
  taskHeight: number;
  taskHalfHeight: number;

  authorizedRelations: RelationKind[];
  ganttRelationEvent: GanttRelationEvent;

  canDelete: boolean;
  isSelected: boolean;
  isCritical: boolean;
  rtl: boolean;

  isRelationChangeable: (task: Task) => boolean;
  isProgressChangeable: (task: Task) => boolean;
  isDateChangeable: (task: Task) => boolean;

  onRelationStart: (target: RelationMoveTarget, selectedTask: Task) => void;
  onDeleteTask: (task: TaskOrEmpty) => void;
  onSelectTaskOnMouseDown: (taskId: string, event: MouseEvent) => void;
  onClick?: (task: Task, event: React.MouseEvent<SVGElement>) => void;
  onDoubleClick?: (task: Task) => void;
  onEventStart: (
    action: TaskBarMoveAction,
    selectedTask: Task,
    clientX: number,
    taskRootNode: Element
  ) => void;
  onTooltipTask: (task: Task | null, element: Element | null) => void;
}

const TaskItemInner: React.FC<TaskItemProps> = props => {
  const {
    distances: { arrowIndent, relationCircleOffset, relationCircleRadius },
    onDeleteTask,
    isDateChangeable,
    canDelete,
    onClick = undefined,
    onDoubleClick = undefined,
    onEventStart,
    onRelationStart,
    authorizedRelations,
    isRelationChangeable,
    ganttRelationEvent,
    rtl,
    onSelectTaskOnMouseDown,
    onTooltipTask,
    task,
    taskHalfHeight,
    taskHeight,
    taskYOffset,
    width,
    x1,
    x2,
    allowMoveTaskBar,
  } = props;

  const taskRootRef = useRef<SVGGElement>(null);

  const handleClick = useCallback(
    (event: React.MouseEvent<SVGElement>) => {
      if (onClick) {
        onClick(task, event);
      }
    },
    [onClick, task]
  );

  const handleDoubleClick = useCallback(() => {
    if (onDoubleClick) {
      onDoubleClick(task);
    }
  }, [onDoubleClick, task]);

  const onTaskEventStart = useCallback(
    (action: TaskBarMoveAction, clientX: number) => {
      if (!isDateChangeable(task)) {
        return;
      }

      if (allowMoveTaskBar && !allowMoveTaskBar(action, task)) {
        return;
      }

      const taskRootNode = taskRootRef.current;

      if (taskRootNode) {
        onEventStart(action, task, clientX, taskRootNode);
      }
    },
    [isDateChangeable, onEventStart, task, allowMoveTaskBar]
  );

  const onLeftRelationTriggerMouseDown = useCallback(() => {
    onRelationStart(rtl ? "endOfTask" : "startOfTask", task);
  }, [onRelationStart, rtl, task]);

  const onRightRelationTriggerMouseDown = useCallback(() => {
    onRelationStart(rtl ? "startOfTask" : "endOfTask", task);
  }, [onRelationStart, rtl, task]);

  const taskItem = useMemo(() => {
    const isFromStartRelationAuthorized =
      authorizedRelations.includes("startToStart") ||
      authorizedRelations.includes("startToEnd");
    const isFromEndRelationAuthorized =
      authorizedRelations.includes("endToEnd") ||
      authorizedRelations.includes("endToStart");
    const isToStartRelationAuthorized =
      (ganttRelationEvent?.target === "startOfTask" &&
        authorizedRelations.includes("startToStart")) ||
      (ganttRelationEvent?.target === "endOfTask" &&
        authorizedRelations.includes("endToStart"));
    const isToEndRelationAuthorized =
      (ganttRelationEvent?.target === "startOfTask" &&
        authorizedRelations.includes("startToEnd")) ||
      (ganttRelationEvent?.target === "endOfTask" &&
        authorizedRelations.includes("endToEnd"));

    let displayLeftRelationHandle: boolean;
    if (ganttRelationEvent && task !== ganttRelationEvent.task) {
      displayLeftRelationHandle = rtl
        ? isToEndRelationAuthorized
        : isToStartRelationAuthorized;
    } else {
      displayLeftRelationHandle = rtl
        ? isFromEndRelationAuthorized
        : isFromStartRelationAuthorized;
    }
    let displayRightRelationHandle: boolean;
    if (ganttRelationEvent && task !== ganttRelationEvent.task) {
      displayRightRelationHandle = rtl
        ? isToStartRelationAuthorized
        : isToEndRelationAuthorized;
    } else {
      displayRightRelationHandle = rtl
        ? isFromStartRelationAuthorized
        : isFromEndRelationAuthorized;
    }
    const relationHandles = (
      <>
        {/* left */}
        {isRelationChangeable && displayLeftRelationHandle && (
          <BarRelationHandle
            dataTestId={`bar-relation-handle-left-${task.id}`}
            isRelationDrawMode={!!ganttRelationEvent}
            x={x1 - relationCircleOffset}
            y={taskYOffset + taskHalfHeight}
            radius={relationCircleRadius}
            startDrawRelation={onLeftRelationTriggerMouseDown}
          />
        )}
        {/* right */}
        {isRelationChangeable && displayRightRelationHandle && (
          <BarRelationHandle
            dataTestId={`bar-relation-handle-right-${task.id}`}
            isRelationDrawMode={!!ganttRelationEvent}
            x={x2 + relationCircleOffset}
            y={taskYOffset + taskHalfHeight}
            radius={relationCircleRadius}
            startDrawRelation={onRightRelationTriggerMouseDown}
          />
        )}
      </>
    );

    if (task.type === "milestone") {
      return (
        <Milestone
          {...props}
          onLeftRelationTriggerMouseDown={onLeftRelationTriggerMouseDown}
          onRightRelationTriggerMouseDown={onRightRelationTriggerMouseDown}
          onTaskEventStart={onTaskEventStart}
        >
          {relationHandles}
        </Milestone>
      );
    } else
      return (
        <Bar
          {...props}
          onLeftRelationTriggerMouseDown={onLeftRelationTriggerMouseDown}
          onRightRelationTriggerMouseDown={onRightRelationTriggerMouseDown}
          onTaskEventStart={onTaskEventStart}
        >
          {relationHandles}
        </Bar>
      );
  }, [
    authorizedRelations,
    ganttRelationEvent,
    isRelationChangeable,
    onLeftRelationTriggerMouseDown,
    onRightRelationTriggerMouseDown,
    onTaskEventStart,
    props,
    relationCircleOffset,
    relationCircleRadius,
    rtl,
    task,
    taskHalfHeight,
    taskYOffset,
    x1,
    x2,
  ]);

  const onMouseDown = useCallback<MouseEventHandler>(
    event => {
      onSelectTaskOnMouseDown(task.id, event);
    },
    [onSelectTaskOnMouseDown, task]
  );

  const onMouseEnter = useCallback<MouseEventHandler<SVGGElement>>(
    event => {
      onTooltipTask(task, event.currentTarget);
    },
    [onTooltipTask, task]
  );

  const onMouseLeave = useCallback(() => {
    onTooltipTask(null, null);
  }, [onTooltipTask]);

  return (
    <g
      onKeyDown={e => {
        switch (e.key) {
          case "Delete": {
            if (canDelete) {
              onDeleteTask(task);
            }
            break;
          }
        }
        e.stopPropagation();
      }}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      ref={taskRootRef}
    >
      {taskItem}
      <TaskResponsiveLabel
        x1={x1}
        width={width}
        taskHeight={taskHeight}
        arrowIndent={arrowIndent}
        rtl={rtl}
        label={task.name}
        taskYOffset={taskYOffset}
      />
    </g>
  );
};

export const TaskItem = memo(TaskItemInner);
