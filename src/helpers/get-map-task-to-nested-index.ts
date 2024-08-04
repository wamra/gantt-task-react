import {
  ChildByLevelMap,
  MapTaskToNestedIndex,
  RootMapByLevel,
  TaskOrEmpty,
} from "../types/public-types";

const getMapTaskTo = (
  indexesOnLevel: Map<string, [number, string]>,
  taskId: string,
  level: number,
  collectedIndex: string,
  childTasksOnLevel: Map<string, TaskOrEmpty[]>,
) => {
  const childs = childTasksOnLevel.get(taskId);

  if (childs && childs.length > 0) {
    childs.forEach(({
      id: childId,
    }, index) => {
      const childIndex = `${collectedIndex}.${index + 1}`;
      indexesOnLevel.set(childId, [level, childIndex]);

      getMapTaskTo(
        indexesOnLevel,
        childId,
        level + 1,
        childIndex,
        childTasksOnLevel,
      );
    });
  }
};

export const getMapTaskToNestedIndex = (
  childTasksMap: ChildByLevelMap,
  rootTasksMap: RootMapByLevel,
): MapTaskToNestedIndex => {
  const res = new Map<number, Map<string, [number, string]>>();

  for (const [comparisonLevel, rootTasks] of rootTasksMap.entries()) {
    const indexesOnLevel = new Map<string, [number, string]>();
    const childTasksOnLevel = childTasksMap.get(comparisonLevel) || new Map<string, TaskOrEmpty[]>();
    
    rootTasks.forEach(({ id: rootId }, index) => {
      const rootIndex = `${index + 1}`;
      indexesOnLevel.set(rootId, [0, rootIndex]);

      getMapTaskTo(
        indexesOnLevel,
        rootId,
        1,
        rootIndex,
        childTasksOnLevel,
      );
    });

    res.set(comparisonLevel, indexesOnLevel);
  }

  return res;
};
