import { useCallback } from "react";

import addMilliseconds from "date-fns/addMilliseconds";
import maxDate from "date-fns/max";
import minDate from "date-fns/min";

import { checkIsDescendant } from "../../helpers/check-is-descendant";

import type {
  AdjustTaskToWorkingDatesParams,
  ChangeInProgress,
  MapTaskToCoordinates,
  MinAndMaxChildsMap,
  Task,
  TaskMapByLevel,
} from "../../types/public-types";
import { roundTaskDates } from "../../helpers/round-task-dates";

type UseGetTaskCurrentStateParams = {
  adjustTaskToWorkingDates: (params: AdjustTaskToWorkingDatesParams) => Task;
  changeInProgress: ChangeInProgress | null;
  isAdjustToWorkingDates: boolean;
  isMoveChildsWithParent: boolean;
  isUpdateDisabledParentsOnChange: boolean;
  mapTaskToCoordinates: MapTaskToCoordinates;
  minAndMaxChildsMap: MinAndMaxChildsMap;
  roundEndDate: (date: Date) => Date;
  roundStartDate: (date: Date) => Date;
  tasksMap: TaskMapByLevel;
};

export const useGetTaskCurrentState = ({
  adjustTaskToWorkingDates,
  changeInProgress,
  isAdjustToWorkingDates,
  isMoveChildsWithParent,
  isUpdateDisabledParentsOnChange,
  mapTaskToCoordinates,
  minAndMaxChildsMap,
  roundEndDate,
  roundStartDate,
  tasksMap,
}: UseGetTaskCurrentStateParams) => {
  const getTaskCurrentState = useCallback(
    (dirtyTask: Task): Task => {
      const task = roundTaskDates(dirtyTask, roundStartDate, roundEndDate);

      if (changeInProgress) {
        if (changeInProgress.task === dirtyTask) {
          if (isAdjustToWorkingDates) {
            return adjustTaskToWorkingDates({
              action: changeInProgress.action,
              changedTask: roundTaskDates(
                changeInProgress.changedTask,
                roundStartDate,
                roundEndDate
              ),
              originalTask: dirtyTask,
            });
          }

          return changeInProgress.changedTask;
        }

        if (
          isMoveChildsWithParent &&
          changeInProgress.action === "move" &&
          checkIsDescendant(changeInProgress.task, task, tasksMap)
        ) {
          const { tsDiff } = changeInProgress;

          const movedTask: Task = {
            ...task,
            end: addMilliseconds(task.end, tsDiff),
            start: addMilliseconds(task.start, tsDiff),
          };

          if (isAdjustToWorkingDates) {
            return adjustTaskToWorkingDates({
              action: changeInProgress.action,
              changedTask: roundTaskDates(
                movedTask,
                roundStartDate,
                roundEndDate
              ),
              originalTask: task,
            });
          }

          return movedTask;
        }

        if (
          isUpdateDisabledParentsOnChange &&
          task.isDisabled &&
          task.id == changeInProgress.task.parent &&
          checkIsDescendant(task, changeInProgress.task, tasksMap)
        ) {
          const minAndMaxChildsOnLevelMap = minAndMaxChildsMap.get(
            task.comparisonLevel || 1
          );

          if (!minAndMaxChildsOnLevelMap) {
            throw new Error("Min and max childs on level are not defined");
          }

          const minAndMaxChilds = minAndMaxChildsOnLevelMap.get(task.id);

          if (!minAndMaxChilds) {
            throw new Error(
              `Min and max childs on level are not defined for task "${task.id}"`
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
              roundStartDate(changeInProgress.changedTask.start),
            ]);

            const maxEndDate = maxDate([
              firstMax.end,
              secondMax.end,
              roundEndDate(changeInProgress.changedTask.end),
            ]);

            return {
              ...task,
              end: maxEndDate,
              start: minStartDate,
            };
          }
        }
      }

      return task;
    },
    [
      adjustTaskToWorkingDates,
      changeInProgress,
      isAdjustToWorkingDates,
      isMoveChildsWithParent,
      isUpdateDisabledParentsOnChange,
      mapTaskToCoordinates,
      minAndMaxChildsMap,
      roundEndDate,
      roundStartDate,
      tasksMap,
    ]
  );

  return getTaskCurrentState;
};
