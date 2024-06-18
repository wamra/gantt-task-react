import {
  GanttDateRoundingTimeUnit,
  type BarMoveAction,
  type DateExtremity,
  type GanttDateRounding,
  type Task,
} from "../types/public-types";

export const ONE_HOUR_DURATION: number = 1000 * 3600 * 1;
export const ONE_DAY_DURATION: number = 1000 * 3600 * 24;

export const roundTaskDates = (
  task: Task,
  roundDate: (
    date: Date,
    action: BarMoveAction,
    dateExtremity: DateExtremity
  ) => Date,
  action: BarMoveAction,
  dateMoveStep: GanttDateRounding
): Task => {
  switch (task.type) {
    case "milestone":
      return {
        ...task,
        end: roundDate(task.end, action, "endOfTask"),
        start: roundDate(task.start, action, "endOfTask"),
      };

    default:
      let start = roundDate(task.start, action, "startOfTask");
      let end = roundDate(task.end, action, "endOfTask");
      //Avoid having start and end at the same date
      if (action == "start" && start.getTime() == end.getTime()) {
        start = decrementDate(
          start,
          action,
          roundDate,
          "startOfTask",
          dateMoveStep,
          true
        );
      } else if (action == "end" && start.getTime() == end.getTime()) {
        end = incrementDate(
          end,
          action,
          roundDate,
          "endOfTask",
          dateMoveStep,
          true
        );
      }

      return {
        ...task,
        start,
        end,
      };
  }
};

export const incrementDate = (
  date: Date,
  action: BarMoveAction,
  roundDate: (
    date: Date,
    action: BarMoveAction,
    dateExtremity: DateExtremity
  ) => Date,
  dateExtremity: DateExtremity,
  dateMoveStep: GanttDateRounding,
  limitDateMoveToOneDay: boolean
) => {
  const stepTime = getStepTime(dateMoveStep);
  let incrementedDate = date;
  if (limitDateMoveToOneDay && stepTime > ONE_DAY_DURATION) {
    // this check allow to not have a major shit in case of rounding/step greater than one day
    incrementedDate = new Date(date.getTime() + ONE_DAY_DURATION);
  } else {
    incrementedDate = new Date(date.getTime() + stepTime);
    incrementedDate = roundDate(incrementedDate, action, dateExtremity);
  }
  return incrementedDate;
};

export const decrementDate = (
  date: Date,
  action: BarMoveAction,
  roundDate: (
    date: Date,
    action: BarMoveAction,
    dateExtremity: DateExtremity
  ) => Date,
  dateExtremity: DateExtremity,
  dateMoveStep: GanttDateRounding,
  limitDateMoveToOneDay: boolean
) => {
  const stepTime = getStepTime(dateMoveStep);
  let decrementedDate = date;
  if (limitDateMoveToOneDay && stepTime > ONE_DAY_DURATION) {
    // this check allow to not have a major shit in case of rounding/step greater than one day
    decrementedDate = new Date(date.getTime() - ONE_DAY_DURATION);
  } else {
    decrementedDate = new Date(date.getTime() - stepTime);
    decrementedDate = roundDate(decrementedDate, action, dateExtremity);
  }
  return decrementedDate;
};

export const getStepTime = (dateMoveStep: GanttDateRounding) => {
  let stepTime = ONE_HOUR_DURATION; // default is one hour

  const value = dateMoveStep.value;
  const dimension = dateMoveStep.timeUnit;
  if (dimension == GanttDateRoundingTimeUnit.DAY) {
    stepTime = 1000 * 3600 * 24 * value;
  } else if (dimension == GanttDateRoundingTimeUnit.HOUR) {
    stepTime = 1000 * 3600 * value;
  } else if (dimension == GanttDateRoundingTimeUnit.MINUTE) {
    stepTime = 1000 * 60 * 24 * value;
  }
  return stepTime;
};
