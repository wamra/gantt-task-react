import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import style from "./task-label.module.css";
import { TaskLabelProps } from "./types";

interface Props extends TaskLabelProps {
  alwaysOutline?: boolean;
}

const TaskResponsiveLabelInner: React.FC<Props> = props => {
  const {
    alwaysOutline,
    arrowIndent,
    rtl,
    label,
    taskHeight,
    taskYOffset,
    width,
    x1,
  } = props;

  const textRef = useRef<SVGTextElement>(null);
  const [isTextInside, setIsTextInside] = useState(true);

  useEffect(() => {
    if (textRef.current) {
      setIsTextInside(textRef.current.getBBox().width < width);
    }
  }, [textRef, width]);

  const calculatedX = useMemo(() => {
    if (isTextInside && !alwaysOutline) {
      return x1 + width * 0.5;
    }

    if (rtl && textRef.current) {
      return x1 - textRef.current.getBBox().width - arrowIndent * 0.8;
    }

    return x1 + width + arrowIndent * 1.2;
  }, [alwaysOutline, x1, width, isTextInside, rtl, arrowIndent]);

  return (
    <text
      x={calculatedX}
      y={taskYOffset + taskHeight * 0.5}
      className={
        isTextInside && !alwaysOutline
          ? style.barLabel
          : style.barLabel && style.barLabelOutside
      }
      ref={textRef}
    >
      {label}
    </text>
  );
};

export const TaskResponsiveLabel = memo(TaskResponsiveLabelInner);
