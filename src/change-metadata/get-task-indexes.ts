import type {
  ChangeAction,
  TaskOrEmpty,
  TaskToGlobalIndexMap,
} from "../types/public-types";

export const getTaskIndex = (
  task: TaskOrEmpty,
  mapTaskToGlobalIndex: TaskToGlobalIndexMap
) => {
  const { id: taskId, comparisonLevel = 1 } = task;

  const taskIndexMapAtLevel = mapTaskToGlobalIndex.get(comparisonLevel);

  if (!taskIndexMapAtLevel) {
    console.error(`Warning: tasks at level ${comparisonLevel} are not found`);
  }

  const taskIndex = taskIndexMapAtLevel
    ? taskIndexMapAtLevel.get(taskId)
    : undefined;

  if (typeof taskIndex !== "number") {
    console.error(`Warning: index for task ${taskId} is not found`);
  }

  return {
    task,
    index: typeof taskIndex === "number" ? taskIndex : -1,
  };
};

export const getTaskIndexes = (
  changeAction: ChangeAction,
  mapTaskToGlobalIndex: TaskToGlobalIndexMap
) => {
  switch (changeAction.type) {
    case "add-childs":
      return [getTaskIndex(changeAction.parent, mapTaskToGlobalIndex)];

    case "change":
    case "change_start_and_end":
      return [getTaskIndex(changeAction.task, mapTaskToGlobalIndex)];

    case "delete":
      return changeAction.tasks.map(task =>
        getTaskIndex(task, mapTaskToGlobalIndex)
      );

    case "move-before":
      return [getTaskIndex(changeAction.target, mapTaskToGlobalIndex)];

    case "move-after":
      return [getTaskIndex(changeAction.target, mapTaskToGlobalIndex)];

    case "move-inside":
      return [getTaskIndex(changeAction.parent, mapTaskToGlobalIndex)];

    default:
      throw new Error(
        `Unknown change action: ${(changeAction as ChangeAction).type}`
      );
  }
};
