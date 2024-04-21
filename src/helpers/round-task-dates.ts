import type { Task } from "../types";

export const roundTaskDates = (
  task: Task,
  roundStartDate: (date: Date) => Date,
  roundEndDate: (date: Date) => Date
): Task => {
  switch (task.type) {
    case "milestone":
      return {
        ...task,
        end: roundEndDate(task.end),
        start: roundEndDate(task.start),
      };

    default:
      return {
        ...task,
        end: roundEndDate(task.end),
        start: roundStartDate(task.start),
      };
  }
};
