import { isAfter } from "date-fns";

import {
  ChildByLevelMap,
  MinAndMaxChildsMap,
  MinAndMaxChildsOfTask,
  RootMapByLevel,
  Task,
  TaskOrEmpty,
} from "../types";

const fillMinAndMaxChildsMap = (
  resOnLevel: Map<string, MinAndMaxChildsOfTask>,
  task: Task,
  childTasksOnLevel: Map<string, TaskOrEmpty[]>
) => {
  const childs = childTasksOnLevel.get(task.id);

  if (!childs || childs.length === 0) {
    return;
  }

  let firstMin: Task | null = null;
  let secondMin: Task | null = null;
  let firstMax: Task | null = null;
  let secondMax: Task | null = null;

  childs.forEach(task => {
    if (task.type === "empty") {
      return;
    }

    if (!firstMin) {
      firstMin = task;
    } else if (isAfter(firstMin.start, task.start)) {
      secondMin = firstMin;
      firstMin = task;
    } else if (!secondMin) {
      secondMin = task;
    } else if (isAfter(secondMin.start, task.start)) {
      secondMin = task;
    }

    if (!firstMax) {
      firstMax = task;
    } else if (isAfter(task.start, firstMax.start)) {
      secondMax = firstMax;
      firstMax = task;
    } else if (!secondMax) {
      secondMax = task;
    } else if (isAfter(task.start, secondMax.start)) {
      secondMax = task;
    }

    fillMinAndMaxChildsMap(resOnLevel, task, childTasksOnLevel);
  });

  resOnLevel.set(task.id, [
    [firstMin, secondMin],
    [firstMax, secondMax],
  ]);
};

export const getMinAndMaxChildsMap = (
  rootTasksMap: RootMapByLevel,
  childTasksMap: ChildByLevelMap
): MinAndMaxChildsMap => {
  const res = new Map<number, Map<string, MinAndMaxChildsOfTask>>();

  for (const [comparisonLevel, rootTasks] of rootTasksMap.entries()) {
    const childTasksOnLevel = childTasksMap.get(comparisonLevel);

    if (childTasksOnLevel) {
      const resOnLevel = new Map<string, MinAndMaxChildsOfTask>();

      rootTasks.forEach(task => {
        if (task.type !== "empty") {
          fillMinAndMaxChildsMap(resOnLevel, task, childTasksOnLevel);
        }
      });

      res.set(comparisonLevel, resOnLevel);
    }
  }

  return res;
};
