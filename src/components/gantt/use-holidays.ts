import { useCallback } from "react";

import { adjustTaskToWorkingDates as defaultAdjustTaskToWorkingDates } from "../../helpers/adjust-task-to-working-dates";
import { getNextWorkingDate as defaultGetNextWorkingDate } from "../../helpers/get-next-working-date";
import { getPreviousWorkingDate as defaultGetPreviousWorkingDate } from "../../helpers/get-previous-working-date";

import { AdjustTaskToWorkingDatesParams, DateSetup } from "../../types";

type UseHolidaysParams = {
  checkIsHolidayProp: (
    date: Date,
    minTaskDate: Date,
    dateSetup: DateSetup
  ) => boolean;
  dateSetup: DateSetup;
  isAdjustToWorkingDates: boolean;
  minTaskDate: Date;
};

export const useHolidays = ({
  checkIsHolidayProp,
  dateSetup,
  isAdjustToWorkingDates,
  minTaskDate,
}: UseHolidaysParams) => {
  const checkIsHoliday = useCallback(
    (date: Date) => checkIsHolidayProp(date, minTaskDate, dateSetup),
    [checkIsHolidayProp, dateSetup, minTaskDate]
  );

  const getNextWorkingDate = useCallback(
    (date: Date) =>
      defaultGetNextWorkingDate(date, checkIsHoliday, dateSetup.viewMode),
    [checkIsHoliday, dateSetup]
  );

  const getPreviousWorkingDate = useCallback(
    (date: Date) =>
      defaultGetPreviousWorkingDate(date, checkIsHoliday, dateSetup.viewMode),
    [checkIsHoliday, dateSetup]
  );

  const adjustTaskToWorkingDates = useCallback(
    ({ action, changedTask, originalTask }: AdjustTaskToWorkingDatesParams) => {
      if (isAdjustToWorkingDates) {
        return defaultAdjustTaskToWorkingDates({
          action,
          changedTask,
          checkIsHoliday,
          getNextWorkingDate,
          getPreviousWorkingDate,
          originalTask,
          viewMode: dateSetup.viewMode,
        });
      }

      return changedTask;
    },
    [
      checkIsHoliday,
      dateSetup,
      getNextWorkingDate,
      getPreviousWorkingDate,
      isAdjustToWorkingDates,
    ]
  );

  return {
    checkIsHoliday,
    adjustTaskToWorkingDates,
  };
};
