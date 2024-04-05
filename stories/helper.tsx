import {
  format,
  isValid,
  parse,
  startOfMinute,
  startOfDay,
  endOfDay,
} from "date-fns";

import { Task, TaskOrEmpty } from "../src";

const dateFormat = "dd/MM/yyyy HH:mm";

export function initTasks() {
  const currentDate = new Date();
  const tasks: TaskOrEmpty[] = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Some Project",
      id: "ProjectSample",
      progress: 25,
      type: "project",
      hideChildren: false,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        2,
        12,
        28
      ),
      name: "Idea",
      id: "Idea",
      progress: 45,
      type: "task",
      parent: "ProjectSample",
    },
    {
      id: "taskWithoutDateId",
      type: "empty",
      name: "TaskWithoutDate",
      parent: "ProjectSample",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      name: "Research",
      id: "Research",
      progress: 25,
      dependencies: [
        {
          sourceId: "Idea",
          sourceTarget: "endOfTask",
          ownTarget: "startOfTask",
        },
      ],
      type: "task",
      parent: "ProjectSample",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      name: "Discussion with team",
      id: "Discussion",
      progress: 10,
      dependencies: [
        {
          sourceId: "Research",
          sourceTarget: "endOfTask",
          ownTarget: "startOfTask",
        },
      ],
      type: "task",
      parent: "ProjectSample",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        10,
        0,
        0
      ),
      name: "Developing",
      id: "developing",
      progress: 50,
      dependencies: [
        {
          sourceId: "Discussion",
          sourceTarget: "endOfTask",
          ownTarget: "startOfTask",
        },
      ],
      type: "project",
      parent: "ProjectSample",
      isDisabled: true,
      hideChildren: true,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9),
      name: "Code",
      id: "code",
      type: "task",
      progress: 40,
      parent: "developing",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9),
      name: "Frontend",
      id: "frontend",
      type: "task",
      progress: 40,
      parent: "code",
      assignees: ["Bob", "Peter"],
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9),
      name: "Backend",
      id: "backend",
      type: "task",
      progress: 40,
      parent: "code",
      assignees: ["Marc"],
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      name: "Review",
      id: "review",
      type: "task",
      progress: 70,
      parent: "developing",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Release",
      id: "release",
      progress: currentDate.getMonth(),
      type: "milestone",
      dependencies: [
        {
          sourceId: "review",
          sourceTarget: "endOfTask",
          ownTarget: "startOfTask",
        },
      ],
      parent: "ProjectSample",
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      name: "Party Time",
      id: "party",
      progress: 0,
      isDisabled: true,
      type: "task",
    },
  ];

  return tasks.map(taskOrEmpty => {
    const task = taskOrEmpty as Task;
    if (task) {
      return {
        ...task,
        end: endOfDay(task.end),
        start: startOfDay(task.start),
      };
    } else {
      return taskOrEmpty;
    }
  });
}

export const getTaskFields = (initialValues: {
  name?: string;
  start?: Date | null;
  end?: Date | null;
}) => {
  const name = prompt("Name", initialValues.name);

  const startDateStr =
    prompt(
      "Start date",
      initialValues.start ? format(initialValues.start, dateFormat) : ""
    ) || "";

  const startDate = startOfMinute(parse(startDateStr, dateFormat, new Date()));

  const endDateStr =
    prompt(
      "End date",
      initialValues.end ? format(initialValues.end, dateFormat) : ""
    ) || "";

  const endDate = startOfMinute(parse(endDateStr, dateFormat, new Date()));

  return {
    name,
    start: isValid(startDate) ? startDate : null,
    end: isValid(endDate) ? endDate : null,
  };
};

export const onAddTask = (parentTask: Task) => {
  const taskFields = getTaskFields({
    start: parentTask.start,
    end: parentTask.end,
  });

  const nextTask: TaskOrEmpty =
    taskFields.start && taskFields.end
      ? {
          type: "task",
          start: taskFields.start,
          end: taskFields.end,
          comparisonLevel: parentTask.comparisonLevel,
          id: String(Date.now()),
          name: taskFields.name || "",
          progress: 0,
          parent: parentTask.id,
          styles: parentTask.styles,
        }
      : {
          type: "empty",
          comparisonLevel: parentTask.comparisonLevel,
          id: String(Date.now()),
          name: taskFields.name || "",
          parent: parentTask.id,
          styles: parentTask.styles,
        };

  return Promise.resolve(nextTask);
};

export const onEditTask = (task: TaskOrEmpty) => {
  const taskFields = getTaskFields({
    name: task.name,
    start: task.type === "empty" ? null : task.start,
    end: task.type === "empty" ? null : task.end,
  });

  const nextTask: TaskOrEmpty =
    task.type === "task" || task.type === "empty"
      ? taskFields.start && taskFields.end
        ? {
            type: "task",
            start: taskFields.start,
            end: taskFields.end,
            comparisonLevel: task.comparisonLevel,
            id: task.id,
            name: taskFields.name || task.name,
            progress: task.type === "empty" ? 0 : task.progress,
            dependencies: task.type === "empty" ? undefined : task.dependencies,
            parent: task.parent,
            styles: task.styles,
            isDisabled: task.isDisabled,
          }
        : {
            type: "empty",
            comparisonLevel: task.comparisonLevel,
            id: task.id,
            name: taskFields.name || task.name,
            parent: task.parent,
            styles: task.styles,
            isDisabled: task.isDisabled,
          }
      : {
          ...task,
          name: taskFields.name || task.name,
          start: taskFields.start || task.start,
          end: taskFields.end || task.end,
        };

  return Promise.resolve(nextTask);
};
