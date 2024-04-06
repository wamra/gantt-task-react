import {
  ChildByLevelMap,
  RootMapByLevel,
  TaskOrEmpty,
} from "../types/public-types";


export const getChildsAndRoots = (
  tasks: readonly TaskOrEmpty[],
  checkIsRoot: ((task: TaskOrEmpty) => boolean) | null,
): [ChildByLevelMap, RootMapByLevel] => {
  const childRes = new Map<number, Map<string, TaskOrEmpty[]>>();
  const rootRes = new Map<number, TaskOrEmpty[]>();

  tasks.forEach((task) => {
    const {
      parent,
      comparisonLevel = 1,
    } = task;

    if (!parent || (checkIsRoot && checkIsRoot(task))) {
      const rootOnLevel = rootRes.get(comparisonLevel) || [];
      rootRes.set(comparisonLevel, [...rootOnLevel, task]);

      return;
    }

    const parentsByLevel = childRes.get(comparisonLevel) || new Map<string, TaskOrEmpty[]>();
    const prevValue = parentsByLevel.get(parent) || [];

    parentsByLevel.set(parent, [...prevValue, task]);
    childRes.set(comparisonLevel, parentsByLevel);
  });

  return [childRes, rootRes];
};
