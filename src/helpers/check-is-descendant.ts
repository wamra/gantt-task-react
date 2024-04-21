import { Task, TaskMapByLevel, TaskOrEmpty } from "../types";

export const checkIsDescendant = (
  maybeParent: Task,
  maybeDescendant: TaskOrEmpty,
  tasksMap: TaskMapByLevel
) => {
  /**
   * Avoid the circle of dependencies
   */
  const checkedTasks = new Set<string>();

  const { comparisonLevel = 1 } = maybeDescendant;

  if ((maybeParent.comparisonLevel || 1) !== comparisonLevel) {
    return false;
  }

  const tasksOnLevel = tasksMap.get(comparisonLevel);

  if (!tasksOnLevel) {
    throw new Error(`Tasks on level ${comparisonLevel} are not found`);
  }

  let cur = maybeDescendant;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { id, parent } = cur;

    if (!parent) {
      return false;
    }

    if (parent === maybeParent.id) {
      return true;
    }

    if (checkedTasks.has(id)) {
      console.error("Warning: circle of dependencies");
      return false;
    }

    checkedTasks.add(id);

    const parentTask = tasksOnLevel.get(parent);

    if (!parentTask || parentTask.type === "empty") {
      return false;
    }

    cur = parentTask;
  }
};
