import React from "react";

import { format } from "date-fns";

import { ColumnProps } from "../../../types/public-types";

export const DateEndColumn: React.FC<ColumnProps> = ({
  data: {
    dateSetup: { dateFormats, dateLocale },

    task,
  },
}) => {
  if (task.type === "empty") {
    return null;
  }

  try {
    return (
      <>
        {format(task.end, dateFormats.dateColumnFormat, {
          locale: dateLocale,
        })}
      </>
    );
  } catch (e) {
    return <>{task.end.toString()}</>;
  }
};
