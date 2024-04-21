import type { ChildByLevelMap, TaskOrEmpty } from "../types";

const fillDescendants = (
  res: TaskOrEmpty[],
  task: TaskOrEmpty,
  childAtLevelMap: Map<string, TaskOrEmpty[]>
) => {
  res.push(task);

  const childs = childAtLevelMap.get(task.id);

  if (!childs) {
    return;
  }

  childs.forEach(childTask => {
    fillDescendants(res, childTask, childAtLevelMap);
  });
};

export const getTasksWithDescendants = (
  parentTasks: TaskOrEmpty[],
  childByLevelMap: ChildByLevelMap
) => {
  const res: TaskOrEmpty[] = [];

  parentTasks.forEach(task => {
    const { comparisonLevel = 1 } = task;

    if (childByLevelMap?.size) {
      const childAtLevelMap = childByLevelMap.get(comparisonLevel);

      if (!childAtLevelMap) {
        return;
      }

      fillDescendants(res, task, childAtLevelMap);
    } else {
      fillDescendants(res, task, new Map<string, TaskOrEmpty[]>());
    }
  });

  return res;
};
