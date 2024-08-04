import React, {
  memo,
  useMemo,
} from 'react';

import { TaskOutOfParentWarnings } from '../../types/public-types';

type TaskWarningProps = {
  rtl: boolean;
  outOfParentWarnings?: TaskOutOfParentWarnings;
  hasDependencyWarning: boolean;
  taskWarningOffset: number;
  taskHalfHeight: number;
  taskYOffset: number;
  x1: number;
  x2: number;
};

const TaskWarningInner: React.FC<TaskWarningProps> = ({
  rtl,
  outOfParentWarnings = undefined,
  hasDependencyWarning,
  taskWarningOffset,
  taskHalfHeight,
  taskYOffset,
  x1,
  x2,
}) => {
  const isError = useMemo(
    () => {
      if (hasDependencyWarning) {
        return true;
      }

      if (outOfParentWarnings) {
        const {
          start,
          end,
        } = outOfParentWarnings;
  
        return Boolean(start?.isOutside || end?.isOutside);
      }

      return false;
    },
    [outOfParentWarnings, hasDependencyWarning],
  );

  const centerX = useMemo(() => {
    if (rtl) {
      return x1 - taskWarningOffset;
    }

    return x2 + taskWarningOffset;
  }, [
    rtl,
    taskWarningOffset,
    x1,
    x2,
  ]);

  return (
    <g>
      <circle
        cx={centerX}
        cy={taskYOffset + taskHalfHeight}
        r={12}
        fill={isError ? "#ff0000" : "#e1ca24"}
        strokeWidth={5}
      />

      <rect
        fill="#ffffff"
        x={centerX - 2}
        y={taskYOffset + taskHalfHeight - 7}
        width={4}
        height={4}
      />

      <rect
        fill="#ffffff"
        x={centerX - 2}
        y={taskYOffset + taskHalfHeight}
        width={4}
        height={8}
      />
    </g>
  );
};

export const TaskWarning = memo(TaskWarningInner);
