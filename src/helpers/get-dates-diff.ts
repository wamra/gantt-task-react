import {
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
} from "date-fns";

import { ViewMode } from "../types";

export const getDatesDiff = (
  dateFrom: Date,
  dateTo: Date,
  viewMode: ViewMode
) => {
  switch (viewMode) {
    case ViewMode.Day:
      return differenceInDays(dateFrom, dateTo);

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
