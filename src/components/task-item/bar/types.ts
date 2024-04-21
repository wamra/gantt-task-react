import { TaskItemProps } from "../task-item";
import { TaskBarMoveAction } from "../../../types";
import { PropsWithChildren } from "react";

export interface BarProps extends TaskItemProps, PropsWithChildren {
  onLeftRelationTriggerMouseDown: () => void;
  onRightRelationTriggerMouseDown: () => void;
  onTaskEventStart: (action: TaskBarMoveAction, clientX: number) => void;
}
