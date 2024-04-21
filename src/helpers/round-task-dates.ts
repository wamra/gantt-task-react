import type { Task } from "../types";

export const roundTaskDates = (
  task: Task,
  roundStartDate: (date: Date) => Date,
  roundEndDate: (date: Date) => Date
): Task => {
  switch (task.type) {
    case "milestone": {
      const newMilestoneStartDate = roundEndDate(task.start);
      let newMilestoneEndDate = roundEndDate(task.end);
      newMilestoneEndDate =
        newMilestoneStartDate.getTime() !== newMilestoneEndDate.getTime()
          ? newMilestoneStartDate
          : newMilestoneEndDate;
      return {
        ...task,
        end: newMilestoneEndDate,
        start: newMilestoneStartDate,
      };
    }
    default: {
      let newStartDate = roundStartDate(task.start);
      const newEndDate = roundEndDate(task.end);
      if (newStartDate.getTime() > newEndDate.getTime()) {
        newStartDate = newEndDate;
      }

      return {
        ...task,
        end: newEndDate,
        start: newStartDate,
      };
    }
  }
};
