import { differenceInDays, isWeekend } from "date-fns";

import { DateSetup, ViewMode } from "../../types";

const viewModesForDetectHolidays = new Set([
  ViewMode.Day,
  ViewMode.HalfDay,
  ViewMode.QuarterDay,
  ViewMode.Hour,
]);

export const defaultCheckIsHoliday = (
  date: Date,
  minTaskDate: Date,
  dateSetup: DateSetup
) => {
  if (!viewModesForDetectHolidays.has(dateSetup.viewMode)) {
    return false;
  }

  if (dateSetup.isUnknownDates) {
    const daysDiff = differenceInDays(date, minTaskDate);
    const rest = daysDiff % 7;

    if (daysDiff >= 0) {
      return rest === 5 || rest === 6;
    }

    return rest === -1 || rest === -2;
  }

  return isWeekend(date);
};
