import {
  addYears,
  addMonths,
  addDays,
  addHours,
  subYears,
  subMonths,
  subDays,
  subHours,
  subWeeks,
  startOfYear,
  startOfMonth,
  startOfDay,
  startOfHour,
  startOfWeek,
} from "date-fns";

import { TaskOrEmpty, ViewMode } from "../types/public-types";
import { getDatesDiff } from "./get-dates-diff";

export const ganttDateRange = (
  tasks: readonly TaskOrEmpty[],
  viewMode: ViewMode,
  preStepsCount: number
): [Date, Date, number] => {
  let minTaskDate: Date | null = null;
  let maxTaskDate: Date | null = null;
  for (const task of tasks) {
    if (task.type !== "empty") {
      if (!minTaskDate || task.start < minTaskDate) {
        minTaskDate = task.start;
      }

      if (!maxTaskDate || task.end > maxTaskDate) {
        maxTaskDate = task.end;
      }
    }
  }

  if (!minTaskDate || !maxTaskDate) {
    return [new Date(), new Date(), 2];
  }

  let newStartDate: Date | null = null;
  let newEndDate: Date | null = null;

  switch (viewMode) {
    case ViewMode.Year:
      newStartDate = subYears(minTaskDate, preStepsCount);
      newStartDate = startOfYear(newStartDate);
      newEndDate = addYears(maxTaskDate, 1);
      newEndDate = startOfYear(newEndDate);
      break;
    case ViewMode.Month:
      newStartDate = subMonths(minTaskDate, preStepsCount);
      newStartDate = startOfMonth(newStartDate);
      newEndDate = addYears(maxTaskDate, 1);
      newEndDate = startOfYear(newEndDate);
      break;
    case ViewMode.Week:
      newStartDate = startOfWeek(minTaskDate);
      newStartDate = subWeeks(newStartDate, preStepsCount);
      newEndDate = startOfDay(maxTaskDate);
      newEndDate = addMonths(newEndDate, 1.5);
      break;
    case ViewMode.Day:
      newStartDate = startOfDay(minTaskDate);
      newStartDate = subDays(newStartDate, preStepsCount);
      newEndDate = startOfDay(maxTaskDate);
      newEndDate = addDays(newEndDate, 19);
      break;
    case ViewMode.QuarterDay:
      newStartDate = startOfDay(minTaskDate);
      newStartDate = subHours(newStartDate, preStepsCount * 6);
      newEndDate = startOfDay(maxTaskDate);
      newEndDate = addHours(newEndDate, 66); // 24(1 day)*3 - 6
      break;
    case ViewMode.HalfDay:
      newStartDate = startOfDay(minTaskDate);
      newStartDate = subHours(newStartDate, preStepsCount * 12);
      newEndDate = startOfDay(maxTaskDate);
      newEndDate = addHours(newEndDate, 108); // 24(1 day)*5 - 12
      break;
    case ViewMode.Hour:
      newStartDate = startOfHour(minTaskDate);
      newStartDate = subHours(newStartDate, preStepsCount);
      newEndDate = startOfDay(maxTaskDate);
      newEndDate = addDays(newEndDate, 1);
      break;
  }

  return [
    newStartDate,
    minTaskDate,
    getDatesDiff(newEndDate, newStartDate, viewMode),
  ];
};

export const getWeekNumberISO8601 = (date: Date) => {
  const tmpDate = new Date(date.valueOf());
  const dayNumber = (tmpDate.getDay() + 6) % 7;
  tmpDate.setDate(tmpDate.getDate() - dayNumber + 3);
  const firstThursday = tmpDate.valueOf();
  tmpDate.setMonth(0, 1);
  if (tmpDate.getDay() !== 4) {
    tmpDate.setMonth(0, 1 + ((4 - tmpDate.getDay() + 7) % 7));
  }
  const weekNumber = (
    1 + Math.ceil((firstThursday - tmpDate.valueOf()) / 604800000)
  ).toString();

  if (weekNumber.length === 1) {
    return `0${weekNumber}`;
  } else {
    return weekNumber;
  }
};

export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};
