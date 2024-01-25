import type { ContextMenuOptionType } from "../types/public-types";

export const deleteOption: ContextMenuOptionType = {
  action: ({
    getTasksWithDescendants,
    handleDeleteTasks,
    resetSelectedTasks: resetSelectedTasksAction,
    task,
  }) => {
    const tasksWithDescendants = getTasksWithDescendants();

    handleDeleteTasks(
      tasksWithDescendants.length === 0 ? [task] : tasksWithDescendants
    );

    resetSelectedTasksAction();
  },
  icon: "×",
  label: "Delete",
};
