import type { ReactNode } from "react";
import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { TaskListTableProps, TaskOrEmpty } from "../../../types";
import {
  Announcements,
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import styles from "./task-list-sortable-table.module.css";
import { sortableTreeKeyboardCoordinates } from "./keyboardCoordinates";
import { getProjection } from "./utilities";
import { SensorContext } from "./types";
import { createPortal } from "react-dom";
import { CSS } from "@dnd-kit/utilities";
import { TaskListSortableTableRow } from "../task-list-sortable-table-row";
import {
  restrictToFirstScrollableAncestor,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";

const indentationWidth = 50;
const dropAnimation: DropAnimation = {
  keyframes({ transform }) {
    return [
      { transform: CSS.Transform.toString(transform.initial) },
      {
        transform: CSS.Transform.toString({
          scaleX: 0.98,
          scaleY: 0.98,
          x: transform.final.x - 10,
          y: transform.final.y - 10,
        }),
      },
    ];
  },
  sideEffects: defaultDropAnimationSideEffects({
    className: {
      active: "active",
    },
  }),
};

const TaskListSortableTableDefaultInner: React.FC<
  TaskListTableProps
> = props => {
  const {
    getTableRowProps,
    mapTaskToNestedIndex,
    renderedIndexes,
    tasks,
    ganttRef,
    fullRowHeight,
    handleMoveTaskBefore,
    handleMoveTaskAfter,
    onExpanderClick,
  } = props;
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [currentPosition, setCurrentPosition] = useState<{
    parent: UniqueIdentifier | null;
    overId: UniqueIdentifier;
  } | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const renderedTasks = useMemo(
    /**
     * TO DO: maybe consider tasks on other levels?
     */
    () =>
      tasks.filter(task => !task.comparisonLevel || task.comparisonLevel === 1),
    [tasks]
  );

  const sensorContext: SensorContext = useRef({
    items: renderedTasks,
    offset: offsetLeft,
  });

  const getTaskDepth = useCallback(
    (taskId: string | UniqueIdentifier): number => {
      const activeTask = renderedTasks.find(task => task.id === taskId);
      const activeTaskComparisonLevel = activeTask.comparisonLevel || 1;
      const [activeTaskDepth] = mapTaskToNestedIndex
        .get(activeTaskComparisonLevel)
        .get(activeId.toString());

      return activeTaskDepth || 1;
    },
    [activeId, mapTaskToNestedIndex, renderedTasks]
  );

  const getProjected = () => {
    if (!activeId || !overId) {
      return null;
    }

    return getProjection(
      renderedTasks,
      activeId,
      overId,
      offsetLeft,
      indentationWidth,
      getTaskDepth
    );
  };

  const projected = getProjected();
  const measuring = useMemo(
    () => ({
      droppable: {
        strategy: MeasuringStrategy.Always,
      },
    }),
    []
  );

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

      renderedList.push(
        <TaskListSortableTableRow
          {...getTableRowProps(task, index)}
          key={task.id}
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
  }, [renderedIndexes, fullRowHeight, renderedTasks, getTableRowProps]);

  const getMovementAnnouncement = useCallback(
    (
      eventName: string,
      activeId: UniqueIdentifier,
      overId?: UniqueIdentifier
    ) => {
      if (overId && projected) {
        if (eventName !== "onDragEnd") {
          if (
            currentPosition &&
            projected.parent === currentPosition.parent &&
            overId === currentPosition.overId
          ) {
            return null;
          } else {
            setCurrentPosition({
              parent: projected.parent,
              overId,
            });
          }
        }

        const clonedItems = [...renderedTasks];
        const overIndex = clonedItems.findIndex(({ id }) => id === overId);
        const activeIndex = clonedItems.findIndex(({ id }) => id === activeId);
        const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

        const previousItem = sortedItems[overIndex - 1];

        let announcement;
        const movedVerb = eventName === "onDragEnd" ? "dropped" : "moved";
        const nestedVerb = eventName === "onDragEnd" ? "dropped" : "nested";

        if (!previousItem) {
          const nextItem = sortedItems[overIndex + 1];
          announcement = `${activeId} was ${movedVerb} before ${nextItem.id}.`;
        } else {
          const previousDepth = getTaskDepth(previousItem.id);
          if (projected.depth > previousDepth) {
            announcement = `${activeId} was ${nestedVerb} under ${previousItem.id}.`;
          } else {
            let previousSibling: TaskOrEmpty | undefined = previousItem;
            const previousSiblingDepth = getTaskDepth(previousSibling.id);
            while (previousSibling && projected.depth < previousSiblingDepth) {
              const parentId: UniqueIdentifier | null = previousSibling.parent;
              previousSibling = sortedItems.find(({ id }) => id === parentId);
            }

            if (previousSibling) {
              announcement = `${activeId} was ${movedVerb} after ${previousSibling.id}.`;
            }
          }
        }

        return announcement;
      }

      return null;
    },
    [currentPosition, getTaskDepth, projected, renderedTasks]
  );

  const announcements: Announcements = useMemo(
    () => ({
      onDragStart({ active }) {
        return `Picked up ${active.id}.`;
      },
      onDragMove({ active, over }) {
        return getMovementAnnouncement("onDragMove", active.id, over?.id);
      },
      onDragOver({ active, over }) {
        return getMovementAnnouncement("onDragOver", active.id, over?.id);
      },
      onDragEnd({ active, over }) {
        return getMovementAnnouncement("onDragEnd", active.id, over?.id);
      },
      onDragCancel({ active }) {
        return `Moving was cancelled. ${active.id} was dropped in its original position.`;
      },
    }),
    [getMovementAnnouncement]
  );

  const [coordinateGetter] = useState(() =>
    sortableTreeKeyboardCoordinates(
      sensorContext,
      true,
      indentationWidth,
      getTaskDepth
    )
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );

  const handleDragStart = useCallback(
    ({ active: { id: activeId } }: DragStartEvent) => {
      setActiveId(activeId);
      setOverId(activeId);

      const activeItem = renderedTasks.find(({ id }) => id === activeId);

      if (activeItem) {
        setCurrentPosition({
          parent: activeItem.parent,
          overId: activeId,
        });
        if ("hideChildren" in activeItem && !activeItem.hideChildren) {
          onExpanderClick(activeItem);
        }
      }

      if (ganttRef.current) {
        ganttRef.current.style.setProperty("cursor", "grabbing");
      }
    },
    [ganttRef, onExpanderClick, renderedTasks]
  );

  const handleDragMove = useCallback(({ delta }: DragMoveEvent) => {
    setOffsetLeft(delta.x);
  }, []);

  const handleDragOver = useCallback(({ over }: DragOverEvent) => {
    setOverId(over?.id ?? null);
  }, []);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    resetState();

    if (projected && over) {
      // const { depth, parent } = projected || {};
      const clonedItems = [...renderedTasks];
      const activeTask = clonedItems.find(({ id }) => id === active.id);
      const overTask = clonedItems.find(({ id }) => id === over.id);
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      if (activeIndex > overIndex) {
        handleMoveTaskBefore(overTask, activeTask);
      } else if (activeIndex < overIndex) {
        handleMoveTaskAfter(overTask, activeTask);
      }
    }
  };

  const resetState = useCallback(() => {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);
    setCurrentPosition(null);
    if (ganttRef.current) {
      ganttRef.current.style.setProperty("cursor", "");
    }
  }, [ganttRef]);

  const handleDragCancel = useCallback(() => {
    resetState();
  }, [resetState]);

  return (
    <DndContext
      accessibility={{ announcements }}
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={renderedTasks}
        strategy={verticalListSortingStrategy}
      >
        <div
          className={styles.taskListWrapper}
          style={{
            fontFamily: "var(--gantt-font-family)",
            fontSize: "var(--gantt-font-size)",
          }}
        >
          {renderedListWithOffset}
        </div>
      </SortableContext>
      {ganttRef.current &&
        createPortal(
          <DragOverlay
            dropAnimation={dropAnimation}
            modifiers={[
              restrictToVerticalAxis,
              restrictToFirstScrollableAncestor,
            ]}
          >
            {activeId ? (
              <TaskListSortableTableRow
                {...getTableRowProps(
                  renderedTasks.find(x => x.id === activeId),
                  renderedTasks.findIndex(x => x.id === activeId)
                )}
                isOverlay={true}
              />
            ) : null}
          </DragOverlay>,
          ganttRef.current
        )}
    </DndContext>
  );
};

export const TaskListSortableTable = memo(TaskListSortableTableDefaultInner);
