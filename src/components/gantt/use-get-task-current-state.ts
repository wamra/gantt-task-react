import { useCallback } from "react";

import addMilliseconds from "date-fns/addMilliseconds";
import maxDate from "date-fns/max";
import minDate from "date-fns/min";

import { checkIsDescendant } from "../../helpers/check-is-descendant";

import type {
  AdjustTaskToWorkingDatesParams,
  ChangeInProgress,
  DateExtremity,
  MapTaskToCoordinates,
  MinAndMaxChildsMap,
  Task,
  TaskMapByLevel,
} from "../../types/public-types";
import { roundTaskDates } from "../../helpers/round-task-dates";
import { BarMoveAction } from "../../types/gantt-task-actions";

type UseGetTaskCurrentStateParams = {
  adjustTaskToWorkingDates: (params: AdjustTaskToWorkingDatesParams) => Task;
  changeInProgress: ChangeInProgress | null;
  isAdjustToWorkingDates: boolean;
  isMoveChildsWithParent: boolean;
  isUpdateDisabledParentsOnChange: boolean;
  mapTaskToCoordinates: MapTaskToCoordinates;
  minAndMaxChildsMap: MinAndMaxChildsMap;
  roundDate: (
    date: Date,
    action: BarMoveAction,
    dateExtremity: DateExtremity
  ) => Date;
  tasksMap: TaskMapByLevel;
  dateMoveStep: String;
};

export const useGetTaskCurrentState = ({
  adjustTaskToWorkingDates,
  changeInProgress,
  isAdjustToWorkingDates,
  isMoveChildsWithParent,
  isUpdateDisabledParentsOnChange,
  mapTaskToCoordinates,
  minAndMaxChildsMap,
  roundDate,
  tasksMap,
  dateMoveStep,
}: UseGetTaskCurrentStateParams) => {
  const getTaskCurrentState = useCallback(
    (currentOriginalTask: Task): Task => {
      // ----------------------------------------------------------
      // The aim of getTaskCurrentState is to return the task to display in real time
      //  + currentOriginalTask is the task as it was before begining to change it
      //  + changeInProgress.changedTask is the task that corresponds to the exact move on the full task or the start/end date handlers
      //  + the task is then rounded
      //  + and then ajusted to working days if required

      const taskIsChanged =
        changeInProgress &&
        (changeInProgress.changedTask.start != currentOriginalTask.start ||
          changeInProgress.changedTask.end != currentOriginalTask.end);

      if (taskIsChanged) {
        // ------------------------------------------------------------------------------
        // the aim of this part is to manage the being moved task
        // It rounds the date and then adjusts it to working dates

        if (changeInProgress.originalTask === currentOriginalTask) {
          const roundedTask = roundTaskDates(
            changeInProgress.changedTask,
            roundDate,
            changeInProgress.action,
            dateMoveStep
          );
          const roundTaskIsDifferentFromOriginal =
            roundedTask.start != currentOriginalTask.start ||
            roundedTask.end != currentOriginalTask.end;
          if (isAdjustToWorkingDates && roundTaskIsDifferentFromOriginal) {
            return adjustTaskToWorkingDates({
              action: changeInProgress.action,
              changedTask: roundedTask,
              originalTask: currentOriginalTask,
              roundDate,
            });
          }

          return roundedTask;
        }

        // ------------------------------------------------------------------------------
        // the aim of this part is to update child of the being moved task
        if (
          isMoveChildsWithParent &&
          changeInProgress.action === "move" &&
          checkIsDescendant(
            changeInProgress.originalTask,
            currentOriginalTask,
            tasksMap
          )
        ) {
          const { tsDiff } = changeInProgress;

          const movedTask: Task = {
            ...currentOriginalTask,
            end: addMilliseconds(currentOriginalTask.end, tsDiff),
            start: addMilliseconds(currentOriginalTask.start, tsDiff),
          };

          const roundedTask = roundTaskDates(
            movedTask,
            roundDate,
            changeInProgress.action,
            dateMoveStep
          );
          const roundTaskIsDifferentFromOriginal =
            roundedTask.start != currentOriginalTask.start ||
            roundedTask.end != currentOriginalTask.end;
          if (isAdjustToWorkingDates && roundTaskIsDifferentFromOriginal) {
            return adjustTaskToWorkingDates({
              action: changeInProgress.action,
              changedTask: roundedTask,
              originalTask: currentOriginalTask,
              roundDate,
            });
          }

          return roundedTask;
        }

        // ------------------------------------------------------------------------------
        // the aim of this part is to update parents of the being moved task
        if (
          isUpdateDisabledParentsOnChange &&
          currentOriginalTask.isDisabled &&
          currentOriginalTask.id == changeInProgress.originalTask.parent &&
          checkIsDescendant(
            currentOriginalTask,
            changeInProgress.originalTask,
            tasksMap
          )
        ) {
          const minAndMaxChildsOnLevelMap = minAndMaxChildsMap.get(
            currentOriginalTask.comparisonLevel || 1
          );

          if (!minAndMaxChildsOnLevelMap) {
            throw new Error("Min and max childs on level are not defined");
          }

          const minAndMaxChilds = minAndMaxChildsOnLevelMap.get(
            currentOriginalTask.id
          );

          if (!minAndMaxChilds) {
            throw new Error(
              `Min and max childs on level are not defined for task "${currentOriginalTask.id}"`
            );
          }

          const [
            [firstMinBeforeChange, secondMinBeforeChange],
            [firstMaxBeforeChange, secondMaxBeforeChange],
          ] = minAndMaxChilds;

          if (firstMinBeforeChange && firstMaxBeforeChange) {
            const firstMin = getTaskCurrentState(firstMinBeforeChange);
            const secondMin = getTaskCurrentState(
              secondMinBeforeChange || firstMinBeforeChange
            );

            const firstMax = getTaskCurrentState(firstMaxBeforeChange);
            const secondMax = getTaskCurrentState(
              secondMaxBeforeChange || firstMaxBeforeChange
            );

            const minStartDate = minDate([
              firstMin.start,
              secondMin.start,
              roundDate(
                changeInProgress.changedTask.start,
                changeInProgress.action,
                "start"
              ),
            ]);

            const maxEndDate = maxDate([
              firstMax.end,
              secondMax.end,
              roundDate(
                changeInProgress.changedTask.end,
                changeInProgress.action,
                "end"
              ),
            ]);

            return {
              ...currentOriginalTask,
              end: maxEndDate,
              start: minStartDate,
            };
          }
        }
      }
      return currentOriginalTask;
    },
    [
      adjustTaskToWorkingDates,
      changeInProgress,
      isAdjustToWorkingDates,
      isMoveChildsWithParent,
      isUpdateDisabledParentsOnChange,
      mapTaskToCoordinates,
      minAndMaxChildsMap,
      roundDate,
      tasksMap,
    ]
  );

  return getTaskCurrentState;
};
