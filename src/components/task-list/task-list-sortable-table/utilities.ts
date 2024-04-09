import type { UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { TaskOrEmpty } from "../../../types/public-types";

function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth);
}

export function getProjection(
  items: TaskOrEmpty[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number,
  getTaskDepth: (id: UniqueIdentifier) => number
) {
  const overItemIndex = items.findIndex(({ id }) => id === overId);
  const activeItemIndex = items.findIndex(({ id }) => id === activeId);
  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1];
  const nextItem = newItems[overItemIndex + 1];
  const dragDepth = getDragDepth(dragOffset, indentationWidth);
  const projectedDepth = getTaskDepth(activeId as UniqueIdentifier) + dragDepth;
  const maxDepth = getMaxDepth({
    previousItem,
    getTaskDepth,
  });
  const minDepth = getMinDepth({ nextItem, getTaskDepth });
  let depth = projectedDepth;

  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  return { depth, maxDepth, minDepth, parent: getParentId() };

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return null;
    }

    if (depth === getTaskDepth(previousItem.id)) {
      return previousItem.parent;
    }

    if (depth > getTaskDepth(previousItem.id)) {
      return previousItem.id;
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find(item => getTaskDepth(item.id) === depth)?.parent;

    return newParent ?? null;
  }
}

function getMaxDepth({
  previousItem,
  getTaskDepth,
}: {
  previousItem: TaskOrEmpty;
  getTaskDepth: (id: UniqueIdentifier) => number;
}) {
  if (previousItem) {
    return getTaskDepth(previousItem.id) + 1;
  }

  return 0;
}

function getMinDepth({
  nextItem,
  getTaskDepth,
}: {
  nextItem: TaskOrEmpty;
  getTaskDepth: (id: UniqueIdentifier) => number;
}) {
  if (nextItem) {
    return getTaskDepth(nextItem.id);
  }

  return 0;
}
