import { TaskItemProps } from "../task-item";
import { TaskBarMoveAction } from "../../../types";
import { PropsWithChildren } from "react";

export interface BarProps
  extends Omit<TaskItemProps, "renderCustomLabel">,
    PropsWithChildren {
  onLeftRelationTriggerMouseDown: () => void;
  onRightRelationTriggerMouseDown: () => void;
  onTaskEventStart: (action: TaskBarMoveAction, clientX: number) => void;
}
