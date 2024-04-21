import { TaskItemProps } from "../task-item";
import { BarMoveAction } from "../../../types";
import { PropsWithChildren } from "react";

export interface BarProps extends TaskItemProps, PropsWithChildren {
  onLeftRelationTriggerMouseDown: () => void;
  onRightRelationTriggerMouseDown: () => void;
  onTaskEventStart: (action: BarMoveAction, clientX: number) => void;
}
