import {
  BarMoveAction,
  DateExtremity,
  GanttDateRounding,
} from "../types/public-types";
import { decrementDate, incrementDate } from "./round-task-dates";

export const getNextWorkingDate = (
  date: Date,
  action: BarMoveAction,
  roundDate: (
    date: Date,
    action: BarMoveAction,
    dateExtremity: DateExtremity
  ) => Date,
  dateExtremity: DateExtremity,
  checkIsHoliday: (date: Date, dateExtremity: DateExtremity) => boolean,
  dateMoveStep: GanttDateRounding
) => {
  let currentDate = incrementDate(
    date,
    action,
    roundDate,
    dateExtremity,
    dateMoveStep,
    false
  );

  while (checkIsHoliday(currentDate, dateExtremity)) {
    const incrementedDate = incrementDate(
      currentDate,
      action,
      roundDate,
      dateExtremity,
      dateMoveStep,
      true
    );
    if (incrementedDate <= currentDate) {
      // Avoid infinite loop in case of corner case in checkIsHoliday/incrementDate
      break;
    } else {
      currentDate = incrementedDate;
    }
  }
  return currentDate;
};

export const getPreviousWorkingDate = (
  date: Date,
  action: BarMoveAction,
  roundDate: (
    date: Date,
    action: BarMoveAction,
    dateExtremity: DateExtremity
  ) => Date,
  dateExtremity: DateExtremity,
  checkIsHoliday: (date: Date, dateExtremity: DateExtremity) => boolean,
  dateMoveStep: GanttDateRounding
) => {
  let currentDate = decrementDate(
    date,
    action,
    roundDate,
    dateExtremity,
    dateMoveStep,
    false
  );

  while (checkIsHoliday(currentDate, dateExtremity)) {
    const decrementedDate = decrementDate(
      currentDate,
      action,
      roundDate,
      dateExtremity,
      dateMoveStep,
      true
    );
    if (decrementedDate >= currentDate) {
      // Avoid infinite loop in case of corner case in checkIsHoliday/incrementDate
      break;
    } else {
      currentDate = decrementedDate;
    }
  }

  return currentDate;
};
