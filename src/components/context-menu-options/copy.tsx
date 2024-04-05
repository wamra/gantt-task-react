import type { ContextMenuOptionType } from "../../types/public-types";
import { GanttLocale } from "../../types/public-types";
import { CopyIcon } from "../icons/copy-icon";

export const createCopyOption = (
  locale: GanttLocale
): ContextMenuOptionType => ({
  action: ({ copySelectedTasks, copyTask, getParentTasks, task }) => {
    const parentTasks = getParentTasks();

    if (parentTasks.includes(task)) {
      copySelectedTasks();
    } else {
      copyTask(task);
    }
  },
  icon: <CopyIcon />,
  label: locale.context.copy,
});
