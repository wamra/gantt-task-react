import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  endOfDay,
  endOfHour,
  endOfMonth,
  endOfWeek,
  endOfYear,
  subDays,
  subHours,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";

import { ViewMode } from "../../types";

export const defaultRoundEndDate = (date: Date, viewMode: ViewMode) => {
  switch (viewMode) {
    case ViewMode.Hour: {
      const end = endOfHour(date);
      const diff = differenceInMinutes(end, date);

      if (diff < 30) {
        return end;
      }

      return subHours(end, 1);
    }

    case ViewMode.QuarterDay: {
      const end = endOfDay(date);
      const diff = differenceInHours(end, date);

      if (diff < 3) {
        return end;
      }

      if (diff < 9) {
        return subHours(end, 6);
      }

      if (diff < 15) {
        return subHours(end, 12);
      }

      if (diff < 21) {
        return subHours(end, 18);
      }

      return subDays(end, 1);
    }

    case ViewMode.HalfDay: {
      const end = endOfDay(date);
      const diff = differenceInHours(end, date);

      if (diff < 6) {
        return end;
      }

      if (diff < 18) {
        return subHours(end, 12);
      }

      return subDays(end, 1);
    }

    case ViewMode.Day: {
      const end = endOfDay(date);
      const diff = differenceInHours(end, date);

      if (diff < 12) {
        return end;
      }

      return subDays(end, 1);
    }

    case ViewMode.Week: {
      const end = endOfWeek(date);
      const diff = differenceInDays(end, date);

      if (diff < 4) {
        return end;
      }

      return subWeeks(end, 1);
    }

    case ViewMode.Month: {
      const end = endOfMonth(date);
      const diff = differenceInDays(end, date);

      if (diff < 15) {
        return end;
      }

      return subMonths(end, 1);
    }

    case ViewMode.Year: {
      const end = endOfYear(date);
      const diff = differenceInMonths(end, date);

      if (diff < 6) {
        return end;
      }

      return subYears(end, 1);
    }

    default:
      throw new Error(`Unknown viewMode: ${viewMode}`);
  }
};
