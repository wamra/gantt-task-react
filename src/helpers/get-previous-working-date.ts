import { ViewMode } from "../types";
import { getDateByOffset } from "./get-date-by-offset";

export const getPreviousWorkingDate = (
  date: Date,
  checkIsHoliday: (date: Date) => boolean,
  viewMode: ViewMode
) => {
  let currentDate = getDateByOffset(date, -1, viewMode);

  while (checkIsHoliday(currentDate)) {
    currentDate = getDateByOffset(currentDate, -1, viewMode);
  }

  return currentDate;
};
