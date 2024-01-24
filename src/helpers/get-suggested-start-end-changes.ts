import {
  ChangeAction,
  ChildByLevelMap,
  TaskToGlobalIndexMap,
  OnDateChangeSuggestionType,
  Task,
  TaskOrEmpty,
} from "../types/public-types";

const getChildTasksByLevelMap = (
  childTasksMap: ChildByLevelMap,
  changeAction: ChangeAction,
  task: Task
) => {
  const { id, comparisonLevel = 1 } = task;

  switch (changeAction.type) {
    case "add-childs": {
      const addedIdsAtLevelSet = changeAction.addedIdsMap.get(comparisonLevel);

      if (!addedIdsAtLevelSet) {
        return childTasksMap.get(comparisonLevel);
      }

      if (addedIdsAtLevelSet.has(id)) {
        return changeAction.addedChildsByLevelMap.get(comparisonLevel);
      }

      return childTasksMap.get(comparisonLevel);
    }

    default:
      return childTasksMap.get(comparisonLevel);
  }
};

const getMinAndMaxDatesInDescendants = (
  /**
   * Cache of computed tasks
   */
  computedCacheMap: Map<Task, [Date, Date] | null>,
  task: Task,
  changeAction: ChangeAction,
  childTasksMap: ChildByLevelMap,
  /**
   * Avoid the circle of dependencies
   */
  checkedTasks: Set<string>
): [Date, Date] | null => {
  const cachedRes = computedCacheMap.get(task);
  if (cachedRes) {
    return cachedRes;
  }

  const { id, comparisonLevel = 1 } = task;

  if (checkedTasks.has(id)) {
    const res: [Date, Date] = [task.start, task.end];
    computedCacheMap.set(task, res);
    return res;
  }

  checkedTasks.add(id);

  switch (changeAction.type) {
    case "change":
    case "change_start_and_end":
      if (task.id === changeAction.task.id) {
        if (changeAction.task.type === "empty") {
          computedCacheMap.set(task, null);
          return null;
        }

        const res: [Date, Date] = [
          changeAction.task.start,
          changeAction.task.end,
        ];
        computedCacheMap.set(task, res);
        return res;
      }
      break;

    case "delete": {
      const deletedTaskIdsAtLevel =
        changeAction.deletedIdsMap.get(comparisonLevel);

      if (deletedTaskIdsAtLevel && deletedTaskIdsAtLevel.has(id)) {
        computedCacheMap.set(task, null);
        return null;
      }

      break;
    }

    default:
      break;
  }

  const taskMapByLevel = getChildTasksByLevelMap(
    childTasksMap,
    changeAction,
    task
  );

  if (!taskMapByLevel) {
    const res: [Date, Date] = [task.start, task.end];
    computedCacheMap.set(task, res);
    return res;
  }

  const childTasks = taskMapByLevel.get(id);

  let allChildTasks: readonly TaskOrEmpty[] | undefined = undefined;

  switch (changeAction.type) {
    case "change":
    case "change_start_and_end":
    case "delete":
      allChildTasks = childTasks;
      break;

    case "add-childs":
      if (task.id === changeAction.parent.id) {
        const rootsAtLevel =
          changeAction.addedRootsByLevelMap.get(comparisonLevel) || [];

        if (childTasks) {
          allChildTasks = [...childTasks, ...rootsAtLevel];
        } else {
          allChildTasks = rootsAtLevel;
        }
      } else {
        allChildTasks = childTasks;
      }
      break;

    case "move-inside": {
      const movedTasksAtLevel = changeAction.movedIdsMap.get(comparisonLevel);

      const tasksWithoutMoved = childTasks
        ? childTasks.filter(
            ({ id }) => !movedTasksAtLevel || !movedTasksAtLevel.has(id)
          )
        : [];

      if (task.id === changeAction.parent.id) {
        allChildTasks = [...tasksWithoutMoved, ...changeAction.childs];
      } else {
        allChildTasks = tasksWithoutMoved;
      }
      break;
    }

    case "move-after": {
      if (childTasks) {
        const targetId = changeAction.target.id;
        const taskForMoveId = changeAction.taskForMove.id;

        const tasksWithoutMoved = childTasks.filter(
          ({ id }) => id !== taskForMoveId
        );

        const hasTargetChild = tasksWithoutMoved.some(
          ({ id }) => id === targetId
        );

        if (hasTargetChild) {
          allChildTasks = [...tasksWithoutMoved, changeAction.taskForMove];
        } else {
          allChildTasks = tasksWithoutMoved;
        }
      } else {
        allChildTasks = childTasks;
      }
      break;
    }

    case "move-before": {
      if (childTasks) {
        const targetId = changeAction.target.id;
        const taskForMoveId = changeAction.taskForMove.id;

        const tasksWithoutMoved = childTasks.filter(
          ({ id }) => id !== taskForMoveId
        );

        const hasTargetChild = tasksWithoutMoved.some(
          ({ id }) => id === targetId
        );

        if (hasTargetChild) {
          allChildTasks = [...tasksWithoutMoved, changeAction.taskForMove];
        } else {
          allChildTasks = tasksWithoutMoved;
        }
      } else {
        allChildTasks = childTasks;
      }
      break;
    }

    default:
      break;
  }

  if (!allChildTasks || allChildTasks.length === 0) {
    const res: [Date, Date] = [task.start, task.end];
    computedCacheMap.set(task, res);
    return res;
  }

  let start: Date | null = null;
  let end: Date | null = null;

  allChildTasks.forEach(childTask => {
    if (childTask.type === "empty") {
      return;
    }

    const descendantsResult = getMinAndMaxDatesInDescendants(
      computedCacheMap,
      childTask,
      changeAction,
      childTasksMap,
      checkedTasks
    );

    if (!descendantsResult) {
      return;
    }

    const [childStart, childEnd] = descendantsResult;

    if (!start) {
      start = childStart;
    } else if (start.getTime() > childStart.getTime()) {
      start = childStart;
    }

    if (!end) {
      end = childEnd;
    } else if (end.getTime() < childEnd.getTime()) {
      end = childEnd;
    }
  });

  const res: [Date, Date] = [start || task.start, end || task.end];
  computedCacheMap.set(task, res);
  return res;
};

export const getSuggestedStartEndChanges = (
  /**
   * Cache of computed tasks
   */
  computedCacheMap: Map<Task, [Date, Date] | null>,
  task: Task,
  changeAction: ChangeAction,
  childTasksMap: ChildByLevelMap,
  mapTaskToGlobalIndex: TaskToGlobalIndexMap
): OnDateChangeSuggestionType => {
  const { id, comparisonLevel = 1 } = task;

  /**
   * Avoid the circle of dependencies
   */
  const checkedTasks = new Set<string>(id);

  const indexesByLevel = mapTaskToGlobalIndex.get(comparisonLevel);
  const index = indexesByLevel ? indexesByLevel.get(id) : -1;

  const resIndex = typeof index === "number" ? index : -1;

  const descendantsResult = getMinAndMaxDatesInDescendants(
    computedCacheMap,
    task,
    changeAction,
    childTasksMap,
    checkedTasks
  );

  if (!descendantsResult) {
    return [task.start, task.end, task, resIndex];
  }

  const [start, end] = descendantsResult;

  return [start, end, task, resIndex];
};
