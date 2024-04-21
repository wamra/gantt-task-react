import React, { ComponentType } from "react";

import type { Strategy } from "@floating-ui/dom";

import type { Task } from "../../types";

import styles from "./tooltip.module.css";
import { useGanttLocale } from "../gantt-locale";

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
        zIndex: 11,
      }}
      {...getFloatingProps()}
    >
      <TooltipContent task={task} />
    </div>
  );
};

export const StandardTooltipContent: React.FC<{ task: Task }> = ({ task }) => {
  const locale = useGanttLocale();
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
      <div className={styles.tooltipDefaultContainerTexts}>
        {task.end.getTime() - task.start.getTime() !== 0 && (
          <p
            className={styles.tooltipDefaultContainerParagraph}
          >{`${locale.tooltip.duration},: ${~~(
            (task.end.getTime() - task.start.getTime()) /
            (1000 * 60 * 60 * 24)
          )} ${locale.suffix.days}`}</p>
        )}

        {!!locale.tooltip.progress && (
          <p className={styles.tooltipDefaultContainerParagraph}>
            {!!task.progress &&
              `${locale.tooltip.progress}: ${task.progress} %`}
          </p>
        )}
      </div>
    </div>
  );
};
