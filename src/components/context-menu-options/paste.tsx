import type { ContextMenuOptionType } from "../../types/public-types";
import { GanttLocale } from "../../types/public-types";
import { PasteIcon } from "../icons/paste-icon";

export const createPasteOption = (
  locale: GanttLocale
): ContextMenuOptionType => ({
  action: ({
    getCopyParentTasks,
    getCopyTasksWithDescendants,
    getCutParentTasks,
    handleAddChilds,
    handleMoveTasksInside,
    makeCopies,
    resetSelectedTasks: resetSelectedTasksAction,
    task,
  }) => {
    if (task.type !== "project" && task.type !== "task") {
      return;
    }

    const cutParentTasks = getCutParentTasks();

    if (cutParentTasks.length > 0) {
      handleMoveTasksInside(task, cutParentTasks);
      resetSelectedTasksAction();
      return;
    }

    const copyParentTasks = getCopyParentTasks();

    if (copyParentTasks.length > 0) {
      const tasksForCopy = getCopyTasksWithDescendants();
      const copiedTasks = makeCopies(tasksForCopy);

      handleAddChilds(task, copiedTasks);
      resetSelectedTasksAction();
    }
  },

  checkIsAvailable: ({ checkHasCopyTasks, checkHasCutTasks, task }) => {
    if (task.type === "empty" || task.type === "milestone") {
      return false;
    }

    return checkHasCopyTasks() || checkHasCutTasks();
  },
  icon: <PasteIcon />,
  label: locale.context.paste,
});
