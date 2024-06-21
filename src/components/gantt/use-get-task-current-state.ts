import { useCallback } from "react";

import addMilliseconds from "date-fns/addMilliseconds";
import maxDate from "date-fns/max";
import minDate from "date-fns/min";

import { checkIsDescendant } from "../../helpers/check-is-descendant";

import type {
  AdjustTaskToWorkingDatesParams,
  BarMoveAction,
  ChangeInProgress,
  DateExtremity,
  GanttDateRounding,
  MapTaskToCoordinates,
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
  roundDate: (
    date: Date,
    action: BarMoveAction,
    dateExtremity: DateExtremity
  ) => Date;
  tasksMap: TaskMapByLevel;
  dateMoveStep: GanttDateRounding;
};

export const useGetTaskCurrentState = ({
  adjustTaskToWorkingDates,
  changeInProgress,
  isAdjustToWorkingDates,
  isMoveChildsWithParent,
  isUpdateDisabledParentsOnChange,
  mapTaskToCoordinates,
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
          // Get all the children of the current Task
          const childrenTasks = Array.from(
            tasksMap.get(currentOriginalTask.comparisonLevel || 1).values()
          )
            .filter(task => {
              return (
                task.parent == currentOriginalTask.id && task.type !== "empty"
              );
            })
            .map(task => task as Task);

          const startDates = childrenTasks.map(task => {
            if (task.id == changeInProgress.changedTask.id) {
              return getTaskCurrentState(task).start;
            } else {
              return task.start;
            }
          });
          const endDates = childrenTasks.map(task => {
            if (task.id == changeInProgress.changedTask.id) {
              return getTaskCurrentState(task).end;
            } else {
              return task.end;
            }
          });

          return {
            ...currentOriginalTask,
            start: minDate(startDates),
            end: maxDate(endDates),
          };
        }
      }

      const progressIsChanged =
        changeInProgress &&
        changeInProgress.changedTask.progress != currentOriginalTask.progress;
      if (progressIsChanged) {
        return {
          ...currentOriginalTask,
          progress: changeInProgress.changedTask.progress,
        };
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
      roundDate,
      tasksMap,
    ]
  );

  return getTaskCurrentState;
};
