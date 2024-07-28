import {Task} from "../../types/public-types";

export const treeInfo = (tasks: Task[]) => {
  function buildTree(taskList: Task[]) {
    const taskMap = new Map<string, Task>();
    const childrenMap = new Map<string, string[]>();
    taskList.forEach((item: Task) => {
      taskMap.set(item.id, item);
      if (!childrenMap.has(item.id)) {
        childrenMap.set(item.id, []);
      }
      if (item.project) {
        if (!childrenMap.has(item.project)) {
          childrenMap.set(item.project, []);
        }
        childrenMap.get(item.project)?.push(item.id);
      }
    });

    return {taskMap, childrenMap};
  }

  function calculateDepths(nodeId: string, childrenMap: Map<string, string[]>, depths: Map<string, number>, depth = 0) {
    depths.set(nodeId, depth);
    const children = childrenMap.get(nodeId) || [];
    children.forEach(childId => calculateDepths(childId, childrenMap, depths, depth + 1));
  }

  const {taskMap, childrenMap} = buildTree(tasks);
  const depths = new Map<string, number>();
  tasks.forEach(item => {
    if (!item.project) {
      calculateDepths(item.id, childrenMap, depths, 0);
    }
  });

  return {taskMap, childrenMap, depths};
}

export const filterHiddenChildren = (nodeMap: Map<string, Task>, childrenMap: Map<string, string[]>): Task[] => {
  const result: string[] = [];

  function filterTaskChildren(taskId: string) {
    if (nodeMap.get(taskId)?.hideChildren) {
      result.push(taskId);
      return;
    }

    result.push(taskId);
    const children = childrenMap.get(taskId) || [];
    children.forEach((childId: string) => filterTaskChildren(childId));
  }

  nodeMap.forEach((task, taskId) => {
    if (!task.project) {
      filterTaskChildren(taskId);
    }
  });

  let tasks = result
    .map(taskId => nodeMap.get(taskId))
    .filter(t => !!t);

  return tasks as Task[];
};

