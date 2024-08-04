import type {
  TaskMapByLevel,
  TaskOrEmpty,
} from '../types/public-types';

export const getSelectedTasks = (
  selectedIdsMirror: Readonly<Record<string, true>>,
  tasksMap: TaskMapByLevel,
) => {
  const res: TaskOrEmpty[] = [];

  const tasksAtFirstLevel = tasksMap.get(1);

  if (tasksAtFirstLevel) {
    Object.keys(selectedIdsMirror).forEach((taskId) => {
      const task = tasksAtFirstLevel.get(taskId);

      if (task) {
        res.push(task);
      }
    });
  }

  return res;
};
