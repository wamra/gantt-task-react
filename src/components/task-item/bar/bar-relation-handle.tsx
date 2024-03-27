import React, { memo } from "react";

import styles from "./bar-relation-handle.module.css";

type BarRelationHandleProps = {
  dataTestid: string;
  isRelationDrawMode: boolean;
  radius: number;
  startDrawRelation: () => void;
  x: number;
  y: number;
};

const BarRelationHandleInner: React.FC<BarRelationHandleProps> = ({
  dataTestid,
  isRelationDrawMode,
  radius,
  startDrawRelation,
  x,
  y,
}) => {
  return (
    <circle
      data-testid={dataTestid}
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
