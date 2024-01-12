import React, {
  memo,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import type { MouseEvent, MouseEventHandler } from "react";

import {
  BarMoveAction,
  RelationMoveTarget,
} from "../../types/gantt-task-actions";
import {
  ChildOutOfParentWarnings,
  FixPosition,
  Task,
  ColorStyles,
  TaskOrEmpty,
  Distances,
} from "../../types/public-types";
import { Bar } from "./bar/bar";
import { BarSmall } from "./bar/bar-small";
import { Milestone } from "./milestone/milestone";
import { TaskWarning } from "./task-warning";
import { Project } from "./project/project";
import style from "./task-list.module.css";
import { BarFixWidth, fixWidthContainerClass } from "../other/bar-fix-width";

export type TaskItemProps = {
  getTaskGlobalIndexByRef: (task: Task) => number;
  hasChildren: boolean;
  hasDependencyWarning: boolean;
  progressWidth: number;
  progressX: number;
  selectTaskOnMouseDown: (taskId: string, event: MouseEvent) => void;
  task: Task;
  taskYOffset: number;
  width: number;
  x1: number;
  x2: number;
  childOutOfParentWarnings: ChildOutOfParentWarnings | null;
  distances: Distances;
  taskHeight: number;
  taskHalfHeight: number;
  isProgressChangeable: boolean;
  isDateChangeable: boolean;
  isRelationChangeable: boolean;
  isDelete: boolean;
  isSelected: boolean;
  isCritical: boolean;
  isRelationDrawMode: boolean;
  rtl: boolean;
  onDoubleClick?: (task: Task) => void;
  onClick?: (task: Task) => void;
  setTooltipTask: (task: Task | null, element: Element | null) => void;
  onEventStart: (
    action: BarMoveAction,
    selectedTask: Task,
    clientX: number,
    taskRootNode: Element
  ) => any;
  onRelationStart: (target: RelationMoveTarget, selectedTask: Task) => void;
  fixStartPosition?: FixPosition;
  fixEndPosition?: FixPosition;
  handleDeteleTasks: (task: TaskOrEmpty[]) => void;
  colorStyles: ColorStyles;
};

const TaskItemInner: React.FC<TaskItemProps> = props => {
  const {
    childOutOfParentWarnings,
    colorStyles: stylesProp,

    distances: { arrowIndent, handleWidth, taskWarningOffset },

    fixEndPosition = undefined,
    fixStartPosition = undefined,
    getTaskGlobalIndexByRef,
    handleDeteleTasks,
    hasDependencyWarning,
    isDateChangeable,
    isDelete,
    isRelationDrawMode,
    isSelected,
    onClick = undefined,
    onDoubleClick = undefined,
    onEventStart,
    onRelationStart,
    rtl,
    selectTaskOnMouseDown,
    setTooltipTask,

    task,
    task: { styles: taskStyles },

    taskHalfHeight,
    taskHeight,
    taskYOffset,
    width,
    x1,
    x2,
  } = props;

  const taskRootRef = useRef<SVGGElement>(null);

  const styles = useMemo(() => {
    if (taskStyles) {
      return {
        ...stylesProp,
        ...taskStyles,
      };
    }

    return stylesProp;
  }, [taskStyles, stylesProp]);

  const outOfParentWarnings = useMemo(() => {
    if (!childOutOfParentWarnings) {
      return undefined;
    }

    const { id, comparisonLevel = 1 } = task;

    const warningsByLevel = childOutOfParentWarnings.get(comparisonLevel);

    if (!warningsByLevel) {
      return undefined;
    }

    return warningsByLevel.get(id);
  }, [task, childOutOfParentWarnings]);

  const handleFixStartPosition = useCallback(() => {
    if (!outOfParentWarnings || !fixStartPosition) {
      return;
    }

    const { start } = outOfParentWarnings;

    if (!start) {
      return;
    }

    const globalIndex = getTaskGlobalIndexByRef(task);

    fixStartPosition(task, start.date, globalIndex);
  }, [task, fixStartPosition, outOfParentWarnings, getTaskGlobalIndexByRef]);

  const handleFixEndPosition = useCallback(() => {
    if (!outOfParentWarnings || !fixEndPosition) {
      return;
    }

    const { end } = outOfParentWarnings;

    if (!end) {
      return;
    }

    const globalIndex = getTaskGlobalIndexByRef(task);

    fixEndPosition(task, end.date, globalIndex);
  }, [task, fixEndPosition, outOfParentWarnings, getTaskGlobalIndexByRef]);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(task);
    }
  }, [onClick, task]);

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

      const taskRootNode = taskRootRef.current;

      if (taskRootNode) {
        onEventStart(action, task, clientX, taskRootNode);
      }
    },
    [isDateChangeable, onEventStart, task]
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
    switch (task.type) {
      case "milestone":
        return (
          <Milestone
            {...props}
            colorStyles={styles}
            onLeftRelationTriggerMouseDown={onLeftRelationTriggerMouseDown}
            onRightRelationTriggerMouseDown={onRightRelationTriggerMouseDown}
            onTaskEventStart={onTaskEventStart}
          />
        );

      case "project":
        return (
          <Project
            {...props}
            colorStyles={styles}
            onTaskEventStart={onTaskEventStart}
          />
        );

      default:
        if (width < handleWidth * 2) {
          return (
            <BarSmall
              {...props}
              colorStyles={styles}
              onTaskEventStart={onTaskEventStart}
            />
          );
        }

        return (
          <Bar
            {...props}
            onLeftRelationTriggerMouseDown={onLeftRelationTriggerMouseDown}
            onRightRelationTriggerMouseDown={onRightRelationTriggerMouseDown}
            onTaskEventStart={onTaskEventStart}
            colorStyles={styles}
          />
        );
    }
  }, [
    handleWidth,
    isRelationDrawMode,
    isSelected,
    outOfParentWarnings,
    props,
    styles,
    task,
    width,
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
      selectTaskOnMouseDown(task.id, event);
    },
    [selectTaskOnMouseDown, task]
  );

  const onMouseEnter = useCallback<MouseEventHandler<SVGGElement>>(
    event => {
      setTooltipTask(task, event.currentTarget);
    },
    [setTooltipTask, task]
  );

  const onMouseLeave = useCallback(() => {
    setTooltipTask(null, null);
  }, [setTooltipTask]);

  return (
    <g
      className={fixWidthContainerClass}
      onKeyDown={e => {
        switch (e.key) {
          case "Delete": {
            if (isDelete) {
              handleDeteleTasks([task]);
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

      {(outOfParentWarnings || hasDependencyWarning) && (
        <TaskWarning
          taskHalfHeight={taskHalfHeight}
          taskWarningOffset={taskWarningOffset}
          rtl={rtl}
          outOfParentWarnings={outOfParentWarnings}
          hasDependencyWarning={hasDependencyWarning}
          taskYOffset={taskYOffset}
          x1={x1}
          x2={x2}
        />
      )}

      {outOfParentWarnings && (
        <>
          {outOfParentWarnings.start && (
            <BarFixWidth
              x={rtl ? x2 : x1}
              y={taskYOffset + taskHeight}
              height={16}
              width={10}
              isLeft={outOfParentWarnings.start.isOutside !== rtl}
              color="grey"
              handleFixWidth={handleFixStartPosition}
            />
          )}

          {outOfParentWarnings.end && (
            <BarFixWidth
              x={rtl ? x1 : x2}
              y={taskYOffset + taskHeight}
              height={16}
              width={10}
              isLeft={outOfParentWarnings.end.isOutside === rtl}
              color="grey"
              handleFixWidth={handleFixEndPosition}
            />
          )}
        </>
      )}
    </g>
  );
};

export const TaskItem = memo(TaskItemInner);
