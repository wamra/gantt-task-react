import { BarMoveAction, Task, ViewMode } from "../types";
import { countHolidays } from "./count-holidays";

type AdjustTaskToWorkingDatesParams = {
  action: BarMoveAction;
  changedTask: Task;
  checkIsHoliday: (date: Date) => boolean;
  getNextWorkingDate: (date: Date) => Date;
  getPreviousWorkingDate: (date: Date) => Date;
  originalTask: Task;
  viewMode: ViewMode;
};

export const adjustTaskToWorkingDates = ({
  action,
  changedTask,
  checkIsHoliday,
  getNextWorkingDate,
  getPreviousWorkingDate,
  originalTask,
  viewMode,
}: AdjustTaskToWorkingDatesParams) => {
  switch (changedTask.type) {
    case "milestone":
      if (checkIsHoliday(changedTask.start)) {
        const nextWorkingDate = getNextWorkingDate(changedTask.start);

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
          if (checkIsHoliday(changedTask.end)) {
            return {
              ...changedTask,
              end: getNextWorkingDate(changedTask.end),
            };
          }

          return changedTask;
        }

        case "start": {
          if (checkIsHoliday(changedTask.start)) {
            return {
              ...changedTask,
              start: getPreviousWorkingDate(changedTask.start),
            };
          }

          return changedTask;
        }

        case "move": {
          let newStart = changedTask.start;
          let newEnd = changedTask.end;
          const movingToTheRight =
            changedTask.start.getTime() - originalTask.start.getTime() > 0;

          const originalHolidaysLength = countHolidays(
            originalTask.start,
            originalTask.end,
            checkIsHoliday,
            viewMode
          );
          const durationWithoutHolidays =
            originalTask.end.getTime() -
            originalTask.start.getTime() -
            originalHolidaysLength * 24 * 3600 * 1000;
          if (movingToTheRight) {
            if (checkIsHoliday(changedTask.start)) {
              newStart = getNextWorkingDate(changedTask.start);
            }

            newEnd = new Date(newStart.getTime() + durationWithoutHolidays);
            const newHolidaysLength = countHolidays(
              newStart,
              newEnd,
              checkIsHoliday,
              viewMode
            );
            if (checkIsHoliday(newEnd) || newHolidaysLength > 0) {
              newEnd = new Date(newEnd.getTime() + 2 * 24 * 3600 * 1000);
            }
          } else {
            if (checkIsHoliday(changedTask.end)) {
              newEnd = getPreviousWorkingDate(changedTask.end);
            }
            newStart = new Date(newEnd.getTime() - durationWithoutHolidays);

            const newHolidaysLength = countHolidays(
              newStart,
              newEnd,
              checkIsHoliday,
              viewMode
            );
            if (checkIsHoliday(newStart) || newHolidaysLength > 0) {
              newStart = new Date(newStart.getTime() - 2 * 24 * 3600 * 1000);
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
