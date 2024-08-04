import { TaskOrEmpty } from "../types/public-types";

export const getInitialClosedTasks = (
  tasks: readonly TaskOrEmpty[],
): Readonly<Record<string, true>> => {
  return tasks.reduce<Record<string, true>>((res, task) => {
    if (task.type !== "empty" && task.hideChildren) {
      res[task.id] = true;
    }

    return res;
  }, {});
};
