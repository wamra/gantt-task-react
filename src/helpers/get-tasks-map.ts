import { TaskOrEmpty, TaskMapByLevel } from "../types/public-types";

/**
 * @param tasks List of tasks
 */
export const getTasksMap = (
  tasks: readonly TaskOrEmpty[],
): TaskMapByLevel => {
  const res = new Map<number, Map<string, TaskOrEmpty>>();

  tasks.forEach((task) => {
    const {
      comparisonLevel = 1,
      id,
    } = task;

    const tasksByLevel = res.get(comparisonLevel) || new Map<string, TaskOrEmpty>();
    tasksByLevel.set(id, task);

    res.set(comparisonLevel, tasksByLevel);
  });

  return res;
};
