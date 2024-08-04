import type {
  ContextMenuOptionType,
} from "../types/public-types";

export const cutOption: ContextMenuOptionType = {
  action: ({
    cutSelectedTasks,
    cutTask,
    getSelectedTasks,
    task,
  }) => {
    const selectedTasks = getSelectedTasks();

    if (selectedTasks.length > 0) {
      cutSelectedTasks();
      return;
    }

    cutTask(task);
  },

  icon: '✂',
  label: 'Cut',
};
