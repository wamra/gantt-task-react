import React from "react";

import format from "date-fns/format";

import { ColumnProps } from "../../../types/public-types";

export const DateStartColumn: React.FC<ColumnProps> = ({
  data: {
    dateSetup: {
      dateFormats,
      dateLocale,
    },
    style,
    task,
  },
}) => {
  if (task.type === "empty") {
    return null
  }

  try {
    return (
      <div style={{
        "color": style.barLabelColor
      }}>
        {format(task.start, dateFormats.dateColumnFormat, {
          locale: dateLocale,
        })}
      </div>
    );
  } catch (e) {
    return (
      <div style={{
        "color": style.barLabelColor
      }}>
        {task.start.toString()}
      </div>
    );
  }
};
