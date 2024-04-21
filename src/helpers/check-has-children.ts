import { ChildByLevelMap, TaskOrEmpty } from "../types";

export const checkHasChildren = (
  task: TaskOrEmpty,
  childTasksMap: ChildByLevelMap
) => {
  const { id, comparisonLevel = 1 } = task;

  const childIdsByLevel = childTasksMap.get(comparisonLevel);

  if (!childIdsByLevel) {
    return false;
  }

  const childs = childIdsByLevel.get(id);

  if (!childs) {
    return false;
  }

  return childs.length > 0;
};
