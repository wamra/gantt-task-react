import { checkIsDescendant } from "../helpers/check-is-descendant";

import type {
  TaskMapByLevel,
  TaskOrEmpty,
} from "../types/public-types";

export const getParentTasks = (
  selectedTasks: TaskOrEmpty[],
  tasksMap: TaskMapByLevel,
) => {
  const res: TaskOrEmpty[] = [];

  selectedTasks.forEach((maybeDescendant) => {
    let isDescendant = selectedTasks.some((maybeParent) => {
      if (maybeParent === maybeDescendant || maybeParent.type === 'empty') {
        return false;
      }

      return checkIsDescendant(maybeParent, maybeDescendant, tasksMap);
    });

    if (!isDescendant) {
      res.push(maybeDescendant);
    }
  });

  return res;
};
