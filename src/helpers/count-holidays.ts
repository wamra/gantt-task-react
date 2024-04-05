import { isBefore } from "date-fns";
import { ViewMode } from "../types/public-types";
import { getDateByOffset } from "./get-date-by-offset";

export const countHolidays = (
  startFrom: Date,
  endDate: Date,
  checkIsHoliday: (date: Date) => boolean,
  viewMode: ViewMode
) => {
  let res = 0;

  for (
    let cur = startFrom;
    isBefore(cur, endDate);
    cur = getDateByOffset(cur, 1, viewMode)
  ) {
    if (checkIsHoliday(cur)) {
      ++res;
    }
  }

  return res;
};
