import {
  BarMoveAction,
  DateExtremity,
  GanttDateRounding,
  Task,
} from "../types/public-types";
import { countHolidays } from "./count-holidays";
import {
  ONE_DAY_DURATION,
  ONE_HOUR_DURATION,
  getStepTime,
} from "./round-task-dates";

type AdjustTaskToWorkingDatesParams = {
  action: BarMoveAction;
  changedTask: Task;
  checkIsHoliday: (date: Date, dateExtremity: DateExtremity) => boolean;
  getNextWorkingDate: (
    date: Date,
    action: BarMoveAction,
    dateExtremity: DateExtremity
  ) => Date;
  getPreviousWorkingDate: (
    date: Date,
    action: BarMoveAction,
    dateExtremity: DateExtremity
  ) => Date;
  originalTask: Task;
  dateMoveStep: GanttDateRounding;
};

export const adjustTaskToWorkingDates = ({
  action,
  changedTask,
  checkIsHoliday,
  getNextWorkingDate,
  getPreviousWorkingDate,
  originalTask,
  dateMoveStep,
}: AdjustTaskToWorkingDatesParams) => {
  switch (changedTask.type) {
    case "milestone":
      if (
        checkIsHoliday(
          new Date(changedTask.start.getTime() + 1000 * 3600),
          "startOfTask"
        )
      ) {
        const nextWorkingDate = getNextWorkingDate(
          changedTask.start,
          action,
          "startOfTask"
        );

        return {
          ...changedTask,
          start: nextWorkingDate,
          end: nextWorkingDate,
        };
      }

      return changedTask;

    default:
      switch (action) {
        case "end": {
          if (checkIsHoliday(changedTask.end, "endOfTask")) {
            const moveEndDelta =
              changedTask.end.getTime() - originalTask.end.getTime();
            const endDate =
              moveEndDelta < 0
                ? getPreviousWorkingDate(changedTask.end, action, "endOfTask")
                : getNextWorkingDate(changedTask.end, action, "endOfTask");
            return {
              ...changedTask,
              end: endDate,
            };
          }

          return changedTask;
        }

        case "start": {
          if (
            checkIsHoliday(
              new Date(changedTask.start.getTime() + 1000 * 3600),
              "startOfTask"
            )
          ) {
            const moveStartDelta =
              changedTask.start.getTime() - originalTask.start.getTime();
            return {
              ...changedTask,
              start:
                moveStartDelta > 0
                  ? getNextWorkingDate(changedTask.start, action, "startOfTask")
                  : getPreviousWorkingDate(
                      changedTask.start,
                      action,
                      "startOfTask"
                    ),
            };
          }

          return changedTask;
        }

        case "move": {
          let newStart = changedTask.start;
          let newEnd = changedTask.end;

          const moveDelta =
            changedTask.start.getTime() - originalTask.start.getTime();
          if (moveDelta !== 0) {
            const durationWithoutHolidays = getDuration(
              originalTask.start,
              originalTask.end,
              checkIsHoliday
            );
            // For performance matter, we consider 1 hours as minimal value for step time
            // The only consequence is having the duration rounding -+ 1 hour according to the move position
            const stepTime = Math.max(
              getStepTime(dateMoveStep),
              ONE_HOUR_DURATION
            );

            const movingToTheRight = moveDelta >= 0;
            if (movingToTheRight) {
              if (checkIsHoliday(changedTask.start, "startOfTask")) {
                newStart = getNextWorkingDate(
                  changedTask.start,
                  action,
                  "startOfTask"
                );
              }
              newEnd = new Date(newStart.getTime() + durationWithoutHolidays);
              if (checkIsHoliday(newEnd, "endOfTask")) {
                newEnd = getNextWorkingDate(newStart, action, "endOfTask");
              }

              let newDurationWithoutHolidays = getDuration(
                newStart,
                newEnd,
                checkIsHoliday
              );

              while (
                newDurationWithoutHolidays < durationWithoutHolidays ||
                checkIsHoliday(newEnd, "endOfTask")
              ) {
                newEnd = new Date(newEnd.getTime() + stepTime);

                newDurationWithoutHolidays = getDuration(
                  newStart,
                  newEnd,
                  checkIsHoliday
                );
              }
            } else {
              if (checkIsHoliday(changedTask.end, "endOfTask")) {
                newEnd = getPreviousWorkingDate(
                  changedTask.end,
                  action,
                  "endOfTask"
                );
              }

              newStart = new Date(newEnd.getTime() - durationWithoutHolidays);
              if (checkIsHoliday(newStart, "startOfTask")) {
                newStart = getPreviousWorkingDate(
                  newStart,
                  action,
                  "startOfTask"
                );
              }
              let newDurationWithoutHolidays = getDuration(
                newStart,
                newEnd,
                checkIsHoliday
              );

              while (newDurationWithoutHolidays < durationWithoutHolidays) {
                newStart = new Date(newStart.getTime() - stepTime);

                newDurationWithoutHolidays = getDuration(
                  newStart,
                  newEnd,
                  checkIsHoliday
                );
              }
            }
          }
          return {
            ...changedTask,
            start: newStart,
            end: newEnd,
          };
        }

        default:
          return changedTask;
      }
  }
};

const getDuration = (
  startDate: Date,
  endDate: Date,
  checkIsHoliday: (date: Date, dateExtremity: DateExtremity) => boolean
) => {
  const newHolidaysLength = countHolidays(startDate, endDate, checkIsHoliday);
  const newDurationWithoutHolidays =
    endDate.getTime() -
    startDate.getTime() -
    newHolidaysLength * ONE_DAY_DURATION;

  return newDurationWithoutHolidays;
};
