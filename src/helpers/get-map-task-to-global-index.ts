import { TaskToGlobalIndexMap, TaskOrEmpty } from "../types/public-types";

/**
 * @param tasks List of tasks
 */
export const getMapTaskToGlobalIndex = (
  tasks: readonly TaskOrEmpty[],
): TaskToGlobalIndexMap => {
  const res = new Map<number, Map<string, number>>();

  tasks.forEach((task, index) => {
    const {
      id,
      comparisonLevel = 1,
    } = task;

    const indexesByLevel = res.get(comparisonLevel) || new Map<string, number>();

    indexesByLevel.set(id, index);
    res.set(comparisonLevel, indexesByLevel);
  });

  return res;
};
