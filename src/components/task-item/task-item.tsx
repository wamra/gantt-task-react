import type { MouseEvent, MouseEventHandler } from "react";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  BarMoveAction,
  GanttRelationEvent,
  RelationMoveTarget,
} from "../../types/gantt-task-actions";
import {
  Distances,
  GanttActionsOption,
  RelationKind,
  Task,
  TaskOrEmpty,
} from "../../types/public-types";
import { Bar } from "./bar/bar";
import { BarSmall } from "./bar/bar-small";
import { Milestone } from "./milestone/milestone";
import style from "./task-item.module.css";
import { BarRelationHandle } from "./bar/bar-relation-handle";

export interface TaskItemProps extends GanttActionsOption {
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
    action: BarMoveAction,
    selectedTask: Task,
    clientX: number,
    taskRootNode: Element
  ) => void;
  onTooltipTask: (task: Task | null, element: Element | null) => void;
}

const TaskItemInner: React.FC<TaskItemProps> = props => {
  const {
    distances: {
      arrowIndent,
      handleWidth,
      relationCircleOffset,
      relationCircleRadius,
    },
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
    (action: BarMoveAction, clientX: number) => {
      if (!isDateChangeable) {
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

  const textRef = useRef<SVGTextElement>(null);
  const [isTextInside, setIsTextInside] = useState(true);

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
            dataTestId={`task-relation-handle-left-${task.name}`}
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
            dataTestId={`task-relation-handle-right-${task.name}`}
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
    } else if (width < handleWidth * 2) {
      return <BarSmall {...props} onTaskEventStart={onTaskEventStart} />;
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
    handleWidth,
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
    width,
    x1,
    x2,
  ]);

  useEffect(() => {
    if (textRef.current) {
      setIsTextInside(textRef.current.getBBox().width < width);
    }
  }, [textRef, width]);

  const x = useMemo(() => {
    if (isTextInside) {
      return x1 + width * 0.5;
    }

    if (rtl && textRef.current) {
      return x1 - textRef.current.getBBox().width - arrowIndent * 0.8;
    }

    return x1 + width + arrowIndent * 1.2;
  }, [x1, width, isTextInside, rtl, arrowIndent]);

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
      <text
        x={x}
        y={taskYOffset + taskHeight * 0.5}
        className={
          isTextInside
            ? style.barLabel
            : style.barLabel && style.barLabelOutside
        }
        ref={textRef}
      >
        {task.name}
      </text>
    </g>
  );
};

export const TaskItem = memo(TaskItemInner);
