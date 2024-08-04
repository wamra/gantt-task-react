import type {
  ContextMenuOptionType,
} from "../types/public-types";

export const copyOption: ContextMenuOptionType = {
  action: ({
    copySelectedTasks,
    copyTask,
    getParentTasks,
    task,
  }) => {
    const parentTasks = getParentTasks();

    if (parentTasks.includes(task)) {
      copySelectedTasks();
    } else {
      copyTask(task);
    }
  },
  label: 'Copy',
};
