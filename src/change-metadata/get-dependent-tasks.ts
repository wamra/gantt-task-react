import type {
  ChangeAction,
  DependentMap,
  Task,
  TaskOrEmpty,
} from "../types/public-types";

export const fillDependentTasksForTask = (
  resSet: Set<Task>,
  task: TaskOrEmpty,
  dependentMap: DependentMap
) => {
  const { id: taskId, comparisonLevel = 1 } = task;

  const dependentMapAtLevel = dependentMap.get(comparisonLevel);

  if (!dependentMapAtLevel) {
    return;
  }

  const dependents = dependentMapAtLevel.get(taskId);

  if (!dependents) {
    return;
  }

  dependents.forEach(({ dependent }) => {
    resSet.add(dependent);
  });
};

export const getDependentTasks = (
  changeAction: ChangeAction,
  dependentMap: DependentMap
) => {
  const resSet = new Set<Task>();

  switch (changeAction.type) {
    case "add-childs":
      fillDependentTasksForTask(resSet, changeAction.parent, dependentMap);
      break;

    case "change":
    case "change_start_and_end":
      fillDependentTasksForTask(resSet, changeAction.task, dependentMap);
      break;

    case "delete":
      changeAction.tasks.forEach(task => {
        fillDependentTasksForTask(resSet, task, dependentMap);
      });
      break;

    case "move-before":
      fillDependentTasksForTask(resSet, changeAction.target, dependentMap);
      break;

    case "move-after":
      fillDependentTasksForTask(resSet, changeAction.target, dependentMap);
      break;

    case "move-inside":
      fillDependentTasksForTask(resSet, changeAction.parent, dependentMap);
      break;

    default:
      throw new Error(
        `Unknown change action: ${(changeAction as ChangeAction).type}`
      );
  }

  return [...resSet];
};
