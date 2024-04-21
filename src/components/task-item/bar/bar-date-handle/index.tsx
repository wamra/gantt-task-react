import React from "react";

type BarDateHandleProps = {
  className?: string;
  dataTestId: string;
  barCornerRadius: number;
  height: number;
  startMove: (clientX: number) => void;
  width: number;
  x: number;
  y: number;
};

export const BarDateHandle: React.FC<BarDateHandleProps> = ({
  dataTestId,
  className,
  barCornerRadius,
  height,
  startMove,
  width,
  x,
  y,
}) => {
  return (
    <rect
      data-testid={dataTestId}
      x={x}
      y={y}
      width={width}
      height={height}
      className={className}
      ry={barCornerRadius}
      rx={barCornerRadius}
      onMouseDown={e => {
        startMove(e.clientX);
      }}
      onTouchStart={e => {
        const firstTouch = e.touches[0];

        if (firstTouch) {
          startMove(firstTouch.clientX);
        }
      }}
    />
  );
};
