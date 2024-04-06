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
  addWeeks,
} from "date-fns";

import { Distances, TaskOrEmpty, ViewMode } from "../types/public-types";
import { getDatesDiff } from "./get-dates-diff";

export const ganttDateRange = (
  tasks: readonly TaskOrEmpty[],
  distances: Distances,
  viewMode: ViewMode,
  preStepsCount: number
): [Date, Date, number] => {
  let minTaskDate: Date | null = null;
  let maxTaskDate: Date | null = null;

  const {
    viewModeYearOffsetYears = 2,
    viewModeMonthOffsetMonths = 2,
    viewModeWeekOffsetWeeks = 2,
    viewModeDayOffsetDays = 2,
    viewModeHourOffsetHours = 66,
  } = distances;

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
      newStartDate = addYears(
        startOfYear(newStartDate),
        -viewModeYearOffsetYears / 2
      );
      newEndDate = addYears(maxTaskDate, 1);
      newEndDate = addYears(startOfYear(newEndDate), viewModeYearOffsetYears);
      break;
    case ViewMode.Month:
      newStartDate = subMonths(minTaskDate, preStepsCount);
      newStartDate = addMonths(
        startOfMonth(newStartDate),
        -viewModeMonthOffsetMonths / 2
      );
      newEndDate = addYears(maxTaskDate, 1);
      newEndDate = addMonths(
        startOfYear(newEndDate),
        viewModeMonthOffsetMonths
      );
      break;
    case ViewMode.Week:
      newStartDate = startOfWeek(minTaskDate);
      newStartDate = addWeeks(
        subWeeks(newStartDate, preStepsCount),
        -viewModeWeekOffsetWeeks / 2
      );
      newEndDate = startOfDay(maxTaskDate);
      newEndDate = addWeeks(newEndDate, viewModeWeekOffsetWeeks);
      break;
    case ViewMode.Day:
      newStartDate = startOfDay(minTaskDate);
      newStartDate = addDays(
        subDays(newStartDate, preStepsCount),
        -viewModeDayOffsetDays / 2
      );
      newEndDate = startOfDay(maxTaskDate);
      newEndDate = addDays(newEndDate, viewModeDayOffsetDays);
      break;
    case ViewMode.QuarterDay:
      newStartDate = startOfDay(minTaskDate);
      newStartDate = subHours(newStartDate, preStepsCount * 6);
      newEndDate = startOfDay(maxTaskDate);
      newEndDate = addHours(newEndDate, viewModeHourOffsetHours); // 24(1 day)*3 - 6
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

export const getWeekNumberISO8601 = (date: Date): number => {
  const tmpDate = new Date(date.valueOf());
  const dayNumber = (tmpDate.getDay() + 6) % 7;
  tmpDate.setDate(tmpDate.getDate() - dayNumber + 3);
  const firstThursday = tmpDate.valueOf();
  tmpDate.setMonth(0, 1);
  if (tmpDate.getDay() !== 4) {
    tmpDate.setMonth(0, 1 + ((4 - tmpDate.getDay() + 7) % 7));
  }
  return (
    1 + Math.ceil((firstThursday - tmpDate.valueOf()) / 604800000)
  );
};

export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};
