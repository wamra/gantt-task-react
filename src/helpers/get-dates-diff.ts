import differenceInDays from "date-fns/differenceInDays";
import differenceInHours from "date-fns/differenceInHours";
import differenceInMonths from "date-fns/differenceInMonths";
import differenceInWeeks from "date-fns/differenceInWeeks";
import differenceInYears from "date-fns/differenceInYears";

import { ViewMode } from "../types/public-types";

export const getDatesDiff = (
  dateFrom: Date,
  dateTo: Date,
  viewMode: ViewMode
) => {
  switch (viewMode) {
    case ViewMode.Day:
      return differenceInDays(dateFrom, dateTo);

    case ViewMode.TwoDays:
      return Math.round(differenceInDays(dateFrom, dateTo) / 2);

    case ViewMode.HalfDay:
      return Math.round(differenceInHours(dateFrom, dateTo) / 12);

    case ViewMode.QuarterDay:
      return Math.round(differenceInHours(dateFrom, dateTo) / 6);

    case ViewMode.Hour:
      return differenceInHours(dateFrom, dateTo);

    case ViewMode.Month:
      return differenceInMonths(dateFrom, dateTo);

    case ViewMode.Week:
      return differenceInWeeks(dateFrom, dateTo);

    case ViewMode.Year:
      return differenceInYears(dateFrom, dateTo);

    default:
      throw new Error("Unknown view mode");
  }
};
