import { Task, TaskMapByLevel, TaskOrEmpty } from "../types/public-types";

export const collectParents = (
  task: TaskOrEmpty,
  tasksMap: TaskMapByLevel
): Task[] => {
  /**
   * Avoid the circle of dependencies
   */
  const checkedTasks = new Set<string>();

  const res: Task[] = [];

  let cur = task;
  while (task.parent != cur.id) {
    const { comparisonLevel = 1, id, parent } = cur;

    if (checkedTasks.has(id)) {
      console.error("Warning: circle of dependencies");
      return res;
    }

    checkedTasks.add(id);

    if (!parent) {
      return res;
    }

    const tasksByLevel = tasksMap.get(comparisonLevel);

    if (!tasksByLevel) {
      return res;
    }

    const parentTask = tasksByLevel.get(parent);

    if (!parentTask || parentTask.type === "empty" || !parentTask.isDisabled) {
      return res;
    }

    res.push(parentTask);
    cur = parentTask;
  }
  return res;
};
