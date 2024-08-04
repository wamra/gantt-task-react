import differenceInDays from "date-fns/differenceInDays";
import differenceInHours from "date-fns/differenceInHours";
import differenceInMinutes from "date-fns/differenceInMinutes";
import differenceInMonths from "date-fns/differenceInMonths";
import endOfDay from "date-fns/endOfDay";
import endOfHour from "date-fns/endOfHour";
import endOfMonth from "date-fns/endOfMonth";
import endOfWeek from "date-fns/endOfISOWeek";
import endOfQuarter from "date-fns/endOfQuarter";
import endOfYear from "date-fns/endOfYear";
import subDays from "date-fns/subDays";
import subHours from "date-fns/subHours";
import subMonths from "date-fns/subMonths";
import subWeeks from "date-fns/subWeeks";
import subYears from "date-fns/subYears";
import subQuarters from "date-fns/subQuarters";

import { ViewMode } from "../../types/public-types";

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

    case ViewMode.QuarterYear:{
      const end = endOfQuarter(date);
      const diff = differenceInMonths(end, date);

      if (diff < 1.5) {
        return end;
      }

      return subQuarters(end, 1);
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
