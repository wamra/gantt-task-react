import type {
  ContextMenuOptionType,
  GanttLocale,
} from "../../types";
import { CutIcon } from "../icons/cut-icon";

export const createCutOption = (
  locale: GanttLocale
): ContextMenuOptionType => ({
  action: ({ cutSelectedTasks, cutTask, getSelectedTasks, task }) => {
    const selectedTasks = getSelectedTasks();

    if (selectedTasks.length > 0) {
      cutSelectedTasks();
      return;
    }

    cutTask(task);
  },

  icon: <CutIcon />,
  label: locale.context.cut,
});
