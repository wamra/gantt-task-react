import type { GlobalRowIndexToTaskMap, RowIndexToTaskMap, TaskOrEmpty, TaskToRowIndexMap } from "../types";

/**
 * @param visibleTasks
 * @param comparisonLevels Number of comparison levels
 */
export const getMapTaskToRowIndex = (
  visibleTasks: readonly TaskOrEmpty[],
  comparisonLevels: number
): [TaskToRowIndexMap, RowIndexToTaskMap, GlobalRowIndexToTaskMap] => {
  const taskToRowIndexRes = new Map<number, Map<string, number>>();
  const rowIndexToTaskRes = new Map<number, Map<number, TaskOrEmpty>>();
  const globalIndexToTaskRes = new Map<number, TaskOrEmpty>();

  const indexesByLevels: Record<string, number> = {};

  visibleTasks.forEach(task => {
    const { id, comparisonLevel = 1 } = task;

    if (!indexesByLevels[comparisonLevel]) {
      indexesByLevels[comparisonLevel] = 0;
    }

    const index = indexesByLevels[comparisonLevel];
    ++indexesByLevels[comparisonLevel];

    const indexesMapByLevel =
      taskToRowIndexRes.get(comparisonLevel) || new Map<string, number>();
    indexesMapByLevel.set(id, index);
    taskToRowIndexRes.set(comparisonLevel, indexesMapByLevel);

    const rowIndexToTaskAtLevelMap =
      rowIndexToTaskRes.get(comparisonLevel) || new Map<number, TaskOrEmpty>();
    rowIndexToTaskAtLevelMap.set(index, task);
    rowIndexToTaskRes.set(comparisonLevel, rowIndexToTaskAtLevelMap);

    const absoluteIndex = index * comparisonLevels + (comparisonLevel - 1);
    globalIndexToTaskRes.set(absoluteIndex, task);
  });

  return [taskToRowIndexRes, rowIndexToTaskRes, globalIndexToTaskRes];
};
