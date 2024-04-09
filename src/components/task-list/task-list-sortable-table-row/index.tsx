import type { CSSProperties, FC } from "react";
import { TaskListTableRow } from "../task-list-table-row";
import { AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskListTableRowProps } from "../../../types/public-types";

const animateLayoutChanges: AnimateLayoutChanges = () => true;

export const TaskListSortableTableRow: FC<TaskListTableRowProps> = props => {
  const { task, ...rest } = props;

  const {
    attributes,
    isDragging,
    isSorting,
    listeners,
    setNodeRef,
    transform,
    transition,
    over,
    activeIndex,
    index,
  } = useSortable({
    id: task.id,
    animateLayoutChanges,
  });
  const style: CSSProperties = {
    transform: isSorting ? undefined : CSS.Translate.toString(transform),
    transition,
  };

  return (
    <TaskListTableRow
      {...rest}
      task={task}
      ref={setNodeRef}
      style={{
        ...rest?.style,
        ...style,
      }}
      isDragging={isDragging}
      moveOverPosition={
        over?.id === task.id
          ? index > activeIndex
            ? "after"
            : "before"
          : undefined
      }
      moveHandleProps={{
        ...attributes,
        ...listeners,
      }}
    />
  );
};
