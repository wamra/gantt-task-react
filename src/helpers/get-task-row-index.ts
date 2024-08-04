import { TaskToRowIndexMap, Task } from "../types/public-types";

export const getTaskRowIndex = (
  task: Task,
  taskToRowIndexMap: TaskToRowIndexMap,
) => {
  const {
    id,
    comparisonLevel = 1,
  } = task;

  const rowIndexByLevel = taskToRowIndexMap.get(comparisonLevel);

  if (!rowIndexByLevel) {
    throw new Error(`Warning: tasks by level ${comparisonLevel} are not found`);
  }

  const rowIndex = rowIndexByLevel.get(id);

  if (typeof rowIndex !== 'number') {
    throw new Error(`Row index is not found for task ${id}`);
  }

  return rowIndex;
};
