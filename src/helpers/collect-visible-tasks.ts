import {
  ChildByLevelMap,
  RootMapByLevel,
  TaskOrEmpty,
} from "../types/public-types";

const collectChildren = (
  arrayRes: TaskOrEmpty[],
  mirrorRes: Record<string, true>,
  task: TaskOrEmpty,
  childTasksOnLevel: Map<string, TaskOrEmpty[]>
) => {
  const { comparisonLevel = 1 } = task;

  arrayRes.push(task);

  if (comparisonLevel === 1) {
    mirrorRes[task.id] = true;
  }

  if (task.type === "empty" || task.hideChildren) {
    return;
  }

  const childs = childTasksOnLevel.get(task.id);
  if (childs && childs.length > 0) {
    childs.forEach(childTask => {
      collectChildren(arrayRes, mirrorRes, childTask, childTasksOnLevel);
    });
  }
};

export const collectVisibleTasks = (
  childTasksMap: ChildByLevelMap,
  rootTasksMap: RootMapByLevel
): [readonly TaskOrEmpty[], Readonly<Record<string, true>>] => {
  const arrayRes: TaskOrEmpty[] = [];
  const mirrorRes: Record<string, true> = {};

  for (const [comparisonLevel, rootTasks] of rootTasksMap.entries()) {
    const childTasksOnLevel =
      childTasksMap.get(comparisonLevel) || new Map<string, TaskOrEmpty[]>();

    rootTasks.forEach(task => {
      collectChildren(arrayRes, mirrorRes, task, childTasksOnLevel);
    });
  }

  return [arrayRes, mirrorRes];
};
