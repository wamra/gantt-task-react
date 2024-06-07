import { useCallback } from "react";

import { adjustTaskToWorkingDates as defaultAdjustTaskToWorkingDates } from "../../helpers/adjust-task-to-working-dates";
import { getNextWorkingDate as defaultGetNextWorkingDate } from "../../helpers/get-previous-next-working-date";
import { getPreviousWorkingDate as defaultGetPreviousWorkingDate } from "../../helpers/get-previous-next-working-date";

import {
  AdjustTaskToWorkingDatesParams,
  DateExtremity,
  DateSetup,
} from "../../types/public-types";
import { BarMoveAction } from "../../types/gantt-task-actions";
import { getStepTime } from "../../helpers/round-task-dates";

type UseHolidaysParams = {
  checkIsHolidayProp: (
    date: Date,
    minTaskDate: Date,
    dateSetup: DateSetup,
    dateExtremity: DateExtremity
  ) => boolean;
  dateSetup: DateSetup;
  isAdjustToWorkingDates: boolean;
  minTaskDate: Date;
  roundDate: (
    date: Date,
    action: BarMoveAction,
    dateExtremity: DateExtremity
  ) => Date;
  dateMoveStep: String;
};

export const useHolidays = ({
  checkIsHolidayProp,
  dateSetup,
  isAdjustToWorkingDates,
  minTaskDate,
  roundDate,
  dateMoveStep,
}: UseHolidaysParams) => {
  const checkIsHoliday = useCallback(
    (date: Date, dateExtremity: DateExtremity) =>
      checkIsHolidayProp(date, minTaskDate, dateSetup, dateExtremity),
    [checkIsHolidayProp, dateSetup, minTaskDate]
  );

  const getNextWorkingDate = (
    date: Date,
    action: BarMoveAction,
    dateExtremity: DateExtremity
  ) =>
    defaultGetNextWorkingDate(
      date,
      action,
      roundDate,
      dateExtremity,
      checkIsHoliday,
      dateMoveStep
    );

  const getPreviousWorkingDate = (
    date: Date,
    action: BarMoveAction,
    dateExtremity: DateExtremity
  ) =>
    defaultGetPreviousWorkingDate(
      date,
      action,
      roundDate,
      dateExtremity,
      checkIsHoliday,
      dateMoveStep
    );

  const adjustTaskToWorkingDates = ({
    action,
    changedTask,
    originalTask,
  }: AdjustTaskToWorkingDatesParams) => {
    const nbDaysTimeStep = getStepTime(dateMoveStep) / (1000 * 3600 * 24);
    // There are too much corner cases when the step time is greater than 2 days
    // for example when reducing a task, the moved date can be on a holidays which trigger a new shift to find the next date date not in holidays
    // that can lead to unexpected behavior from user point of view
    // TODO -> delegate adjustTaskToWorkingDates to the gantt api consumer coherently with the checkHoliday
    if (isAdjustToWorkingDates && nbDaysTimeStep <= 2) {
      return defaultAdjustTaskToWorkingDates({
        action,
        changedTask,
        checkIsHoliday,
        getNextWorkingDate,
        getPreviousWorkingDate,
        originalTask,
      });
    }

    return changedTask;
  };

  return {
    checkIsHoliday,
    adjustTaskToWorkingDates,
  };
};
