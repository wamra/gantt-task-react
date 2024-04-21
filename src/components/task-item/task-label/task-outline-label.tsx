import React, { memo, useMemo, useRef } from "react";
import style from "./task-label.module.css";
import { TaskLabelProps } from "./types";

const TaskOutlineLabelInner: React.FC<TaskLabelProps> = props => {
  const { arrowIndent, rtl, label, taskHeight, taskYOffset, width, x1 } = props;

  const textRef = useRef<SVGTextElement>(null);

  const calculatedX = useMemo(() => {
    if (rtl && textRef.current) {
      return x1 - textRef.current.getBBox().width - arrowIndent * 0.8;
    } else {
      return x1 + width + arrowIndent * 1.2;
    }
  }, [x1, width, rtl, arrowIndent]);

  return (
    <text
      x={calculatedX}
      y={taskYOffset + taskHeight * 0.5}
      className={`${style.barLabel} ${style.barLabelOutside}`}
      ref={textRef}
    >
      {label}
    </text>
  );
};

export const TaskOutlineLabel = memo(TaskOutlineLabelInner);
