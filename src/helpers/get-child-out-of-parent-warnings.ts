import {
  TaskOrEmpty,
  TaskOutOfParentWarnings,
  ChildOutOfParentWarnings,
  ChildByLevelMap,
  Task,
} from "../types/public-types";
import { compareDates } from "./compare-dates";

export const getChildOutOfParentWarnings = (
  tasks: readonly TaskOrEmpty[],
  childTasksMap: ChildByLevelMap,
): ChildOutOfParentWarnings => {
  const res = new Map<number, Map<string, TaskOutOfParentWarnings>>();

  tasks.forEach((task) => {
    if (task.type === 'empty') {
      return;
    }

    const {
      id,
      comparisonLevel = 1,
      start: taskStart,
      end: taskEnd,
    } = task;

    const childsByLevel = childTasksMap.get(comparisonLevel);

    if (!childsByLevel) {
      return;
    }

    const childs = childsByLevel.get(id);

    if (!childs) {
      return;
    }

    const notEmptyChilds = childs.filter(({ type }) => type !== "empty") as Task[];

    if (notEmptyChilds.length === 0) {
      return;
    }

    let {
      start,
      end,
    } = notEmptyChilds[0];

    for (let i = 1; i < notEmptyChilds.length; ++i) {
      const {
        start: childStart,
        end: childEnd,
      } = notEmptyChilds[i];

      if (start.getTime() > childStart.getTime()) {
        start = childStart;
      }

      if (end.getTime() < childEnd.getTime()) {
        end = childEnd;
      }
    }

    const startComparisonResult = compareDates(taskStart, start);
    const endComparisonResult = compareDates(taskEnd, end);

    if (startComparisonResult !== 0 || endComparisonResult !== 0) {
      const warnings: TaskOutOfParentWarnings = {};

      if (startComparisonResult !== 0) {
        warnings.start = {
          isOutside: startComparisonResult > 0,
          date: start,
        };
      }

      if (endComparisonResult !== 0) {
        warnings.end = {
          isOutside: endComparisonResult < 0,
          date: end,
        };
      }

      const resByLevel = res.get(comparisonLevel) || new Map<string, TaskOutOfParentWarnings>();
      resByLevel.set(id, warnings);
      res.set(comparisonLevel, resByLevel);
    }
  });

  return res;
};
