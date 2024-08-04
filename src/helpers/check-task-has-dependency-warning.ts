import { Task, TaskToHasDependencyWarningMap } from "../types/public-types";

export const checkTaskHasDependencyWarning = (
  task: Task,
  taskToHasDependencyWarningMap: TaskToHasDependencyWarningMap,
) => {
  const {
    id,
    comparisonLevel = 1,
  } = task;

  const hasWarningsAtLevelSet = taskToHasDependencyWarningMap.get(comparisonLevel);

  if (!hasWarningsAtLevelSet) {
    return false;
  }

  return hasWarningsAtLevelSet.has(id) || false;
};
