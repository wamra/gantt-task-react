import React, { memo, PropsWithChildren } from "react";

import styles from "./bar-relation.module.css";

interface Props extends PropsWithChildren {
  className?: string;
}

const BarRelationWrapperInner: React.FC<Props> = ({ className, children }) => {
  return (
    <g
      tabIndex={0}
      className={`${styles.barRelationHandleWrapper} ${className || ""}`}
    >
      {children}
    </g>
  );
};

export const BarRelationWrapper = memo(BarRelationWrapperInner);
export * from "./bar-relation-handle";
