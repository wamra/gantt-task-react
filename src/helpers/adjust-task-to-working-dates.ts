import { BarMoveAction } from "../types/gantt-task-actions";
import { DateExtremity, Task } from "../types/public-types";
import { countHolidays } from "./count-holidays";

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
};

export const adjustTaskToWorkingDates = ({
  action,
  changedTask,
  checkIsHoliday,
  getNextWorkingDate,
  getPreviousWorkingDate,
  originalTask,
}: AdjustTaskToWorkingDatesParams) => {
  switch (changedTask.type) {
    case "milestone":
      if (
        checkIsHoliday(
          new Date(changedTask.start.getTime() + 1000 * 3600),
          "start"
        )
      ) {
        const nextWorkingDate = getNextWorkingDate(
          changedTask.start,
          action,
          "start"
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
          if (checkIsHoliday(changedTask.end, "end")) {
            const moveEndDelta =
              changedTask.end.getTime() - originalTask.end.getTime();
            const endDate =
              moveEndDelta < 0
                ? getPreviousWorkingDate(changedTask.end, action, "end")
                : getNextWorkingDate(changedTask.end, action, "end");
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
              "start"
            )
          ) {
            const moveStartDelta =
              changedTask.start.getTime() - originalTask.start.getTime();
            return {
              ...changedTask,
              start:
                moveStartDelta > 0
                  ? getNextWorkingDate(changedTask.start, action, "start")
                  : getPreviousWorkingDate(changedTask.start, action, "start"),
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
            const durationWithoutHolidays = getDurationAndHolidays(
              originalTask.start,
              originalTask.end,
              checkIsHoliday
            );

            const movingToTheRight = moveDelta >= 0;
            if (movingToTheRight) {
              if (checkIsHoliday(changedTask.start, "start")) {
                newStart = getNextWorkingDate(
                  changedTask.start,
                  action,
                  "start"
                );
              }
              newEnd = new Date(newStart.getTime() + durationWithoutHolidays);

              let newDurationWithoutHolidays = getDurationAndHolidays(
                newStart,
                newEnd,
                checkIsHoliday
              );

              while (
                newDurationWithoutHolidays < durationWithoutHolidays ||
                checkIsHoliday(newEnd, "end")
              ) {
                //shift with one day
                newEnd = new Date(newEnd.getTime() + 24 * 3600 * 1000); // à modifier . voir aussi de ne plus passer de roundDate comme prop (dateMoveStep pourrait suffire)

                newDurationWithoutHolidays = getDurationAndHolidays(
                  newStart,
                  newEnd,
                  checkIsHoliday
                );
              }
            } else {
              if (checkIsHoliday(changedTask.end, "end")) {
                newEnd = getPreviousWorkingDate(changedTask.end, action, "end");
              }
              let newDurationWithoutHolidays = getDurationAndHolidays(
                newStart,
                newEnd,
                checkIsHoliday
              );

              while (newDurationWithoutHolidays < durationWithoutHolidays) {
                newStart = new Date(newStart.getTime() - 1 * 24 * 3600 * 1000);

                newDurationWithoutHolidays = getDurationAndHolidays(
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

const getDurationAndHolidays = (
  startDate: Date,
  endDate: Date,
  checkIsHoliday: (date: Date, dateExtremity: DateExtremity) => boolean
) => {
  const newHolidaysLength = countHolidays(startDate, endDate, checkIsHoliday);
  const newDurationWithoutHolidays =
    endDate.getTime() -
    startDate.getTime() -
    newHolidaysLength * 24 * 3600 * 1000;

  return newDurationWithoutHolidays;
};
