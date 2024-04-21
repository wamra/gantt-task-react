import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import style from "./task-label.module.css";
import { TaskLabelProps } from "./types";

interface Props extends TaskLabelProps {
  hideWhenSmall?: boolean;
}

const TaskCenterLabelInner: React.FC<Props> = props => {
  const { hideWhenSmall, label, taskHeight, taskYOffset, width, x1 } = props;

  const textRef = useRef<SVGTextElement>(null);
  const [isTextInside, setIsTextInside] = useState(true);

  const calculatedX = useMemo(() => {
    return x1 + width * 0.5;
  }, [x1, width]);

  useEffect(() => {
    if (textRef.current) {
      setIsTextInside(textRef.current.getBBox().width < width);
    }
  }, [textRef, width]);

  return (
    <text
      x={calculatedX}
      y={taskYOffset + taskHeight * 0.5}
      className={`${style.barLabel} ${!isTextInside && hideWhenSmall ? style.barLabelHidden : ""}`}
      ref={textRef}
    >
      {label}
    </text>
  );
};

export const TaskCenterLabel = memo(TaskCenterLabelInner);
