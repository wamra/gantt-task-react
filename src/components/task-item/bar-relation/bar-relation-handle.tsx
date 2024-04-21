import React, { memo } from "react";

import styles from "./bar-relation.module.css";

type BarRelationHandleProps = {
  dataTestId: string;
  isRelationDrawMode: boolean;
  radius: number;
  startDrawRelation: () => void;
  x: number;
  y: number;
};

const BarRelationHandleInner: React.FC<BarRelationHandleProps> = ({
  dataTestId,
  isRelationDrawMode,
  radius,
  startDrawRelation,
  x,
  y,
}) => {
  return (
    <circle
      data-testid={dataTestId}
      cx={x}
      cy={y}
      r={radius}
      className={`${styles.barRelationHandle} ${
        isRelationDrawMode ? styles.barRelationHandle_drawMode : ""
      }`}
      onMouseDown={startDrawRelation}
      onTouchStart={startDrawRelation}
    />
  );
};

export const BarRelationHandle = memo(BarRelationHandleInner);
