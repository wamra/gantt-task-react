import React, { ComponentType } from "react";

import type { Strategy } from "@floating-ui/dom";

import type { Task } from "../../types/public-types";

import styles from "./tooltip.module.css";

export type TooltipProps = {
  tooltipX: number | null;
  tooltipY: number | null;
  tooltipStrategy: Strategy;
  setFloatingRef: (node: HTMLElement | null) => void;
  getFloatingProps: () => Record<string, unknown>;
  task: Task;
  TooltipContent: ComponentType<{ task: Task }>;
};

export const Tooltip: React.FC<TooltipProps> = ({
  tooltipX,
  tooltipY,
  tooltipStrategy,
  setFloatingRef,
  getFloatingProps,
  task,
  TooltipContent,
}) => {
  return (
    <div
      ref={setFloatingRef}
      style={{
        position: tooltipStrategy,
        top: tooltipY ?? 0,
        left: tooltipX ?? 0,
        width: "max-content",
        fontFamily: "var(--gantt-font-family)",
      }}
      {...getFloatingProps()}
    >
      <TooltipContent task={task} />
    </div>
  );
};

export const StandardTooltipContent: React.FC<{ task: Task }> = ({ task }) => {
  return (
    <div
      className={styles.tooltipDefaultContainer}
      style={{ fontSize: "var(--gantt-font-size)" }}
    >
      <b style={{ fontSize: "var(--gantt-font-size)" }}>{`${
        task.name
      }: ${task.start.getDate()}-${
        task.start.getMonth() + 1
      }-${task.start.getFullYear()} - ${task.end.getDate()}-${
        task.end.getMonth() + 1
      }-${task.end.getFullYear()}`}</b>
      {task.end.getTime() - task.start.getTime() !== 0 && (
        <p className={styles.tooltipDefaultContainerParagraph}>{`Duration: ${~~(
          (task.end.getTime() - task.start.getTime()) /
          (1000 * 60 * 60 * 24)
        )} day(s)`}</p>
      )}

      <p className={styles.tooltipDefaultContainerParagraph}>
        {!!task.progress && `Progress: ${task.progress} %`}
      </p>
    </div>
  );
};
