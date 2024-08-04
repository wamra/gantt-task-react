import { DateExtremity } from "../types/public-types";

export const countHolidays = (
  startDate: Date,
  endDate: Date,
  checkIsHoliday: (date: Date, dateExtremity: DateExtremity) => boolean
) => {
  let holidayCount = checkIsHoliday(startDate, "startOfTask") ? 1 : 0;

  let currentStartDate = new Date(startDate);
  currentStartDate.setHours(0);
  currentStartDate.setMinutes(0);
  currentStartDate.setSeconds(0);
  currentStartDate.setDate(currentStartDate.getDate() + 1);

  let currentEndDate = new Date(endDate);
  currentEndDate.setHours(0);
  currentEndDate.setMinutes(0);
  currentEndDate.setSeconds(0);

  while (currentStartDate <= currentEndDate) {
    if (checkIsHoliday(new Date(currentStartDate.getTime()), "endOfTask")) {
      holidayCount++;
    }
    // Move to the next day
    currentStartDate.setDate(currentStartDate.getDate() + 1);
  }

  return holidayCount;
};
