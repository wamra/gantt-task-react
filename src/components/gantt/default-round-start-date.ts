import {
  addDays,
  addHours,
  addMonths,
  addYears,
  addWeeks,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  startOfDay,
  startOfHour,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

import { ViewMode } from "../../types/public-types";

export const defaultRoundStartDate = (date: Date, viewMode: ViewMode) => {
  switch (viewMode) {
    case ViewMode.Hour: {
      const start = startOfHour(date);
      const diff = differenceInMinutes(date, start);

      if (diff < 30) {
        return start;
      }

      return addHours(start, 1);
    }

    case ViewMode.QuarterDay: {
      const start = startOfDay(date);
      const diff = differenceInHours(date, start);

      if (diff < 3) {
        return start;
      }

      if (diff < 9) {
        return addHours(start, 6);
      }

      if (diff < 15) {
        return addHours(start, 12);
      }

      if (diff < 21) {
        return addHours(start, 18);
      }

      return addDays(start, 1);
    }

    case ViewMode.HalfDay: {
      const start = startOfDay(date);
      const diff = differenceInHours(date, start);

      if (diff < 6) {
        return start;
      }

      if (diff < 18) {
        return addHours(start, 12);
      }

      return addDays(start, 1);
    }

    case ViewMode.Day: {
      const start = startOfDay(date);
      const diff = differenceInHours(date, start);

      if (diff < 12) {
        return start;
      }

      return addDays(start, 1);
    }

    case ViewMode.Week: {
      const start = startOfWeek(date);
      const diff = differenceInDays(date, start);

      if (diff < 4) {
        return start;
      }

      return addWeeks(start, 1);
    }

    case ViewMode.Month: {
      const start = startOfMonth(date);
      const diff = differenceInDays(date, start);

      if (diff < 15) {
        return start;
      }

      return addMonths(start, 1);
    }

    case ViewMode.Year: {
      const start = startOfYear(date);
      const diff = differenceInMonths(date, start);

      if (diff < 6) {
        return start;
      }

      return addYears(start, 1);
    }

    default:
      throw new Error(`Unknown viewMode: ${viewMode}`);
  }
};
