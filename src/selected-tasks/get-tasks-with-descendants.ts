import type {
  ChildByLevelMap,
  TaskOrEmpty,
} from "../types/public-types";

const fillDescendants = (
  res: TaskOrEmpty[],
  task: TaskOrEmpty,
  childAtLevelMap: Map<string, TaskOrEmpty[]>,
) => {
  res.push(task);

  const childs = childAtLevelMap.get(task.id);

  if (!childs) {
    return;
  }

  childs.forEach((childTask) => {
    fillDescendants(res, childTask, childAtLevelMap);
  });
};

export const getTasksWithDescendants = (
  parentTasks: TaskOrEmpty[],
  childByLevelMap: ChildByLevelMap,
) => {
  const res: TaskOrEmpty[] = [];

  parentTasks.forEach((task) => {
    const {
      comparisonLevel = 1,
    } = task;

    const childAtLevelMap = childByLevelMap.get(comparisonLevel);

    if (!childAtLevelMap) {
      return;
    }

    fillDescendants(res, task, childAtLevelMap);
  });

  return res;
};
