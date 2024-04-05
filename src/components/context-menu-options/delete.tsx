import type { ContextMenuOptionType } from "../../types/public-types";
import { GanttLocale } from "../../types/public-types";
import { DeleteIcon } from "../icons/delete-icon";

export const createDeleteOption = (locale: GanttLocale): ContextMenuOptionType => ({
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
  icon: <DeleteIcon />,
  label: locale.context.delete,
});
