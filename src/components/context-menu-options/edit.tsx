import type { ContextMenuOptionType } from "../../types/public-types";
import { GanttLocale } from "../../types/public-types";
import { EditIcon } from "../icons/edit-icon";

export const createEditOption = (
  locale: GanttLocale
): ContextMenuOptionType => ({
  action: ({ task, handleEditTask }) => {
    handleEditTask(task);
  },
  icon: <EditIcon />,
  label: locale.context.edit,
});
