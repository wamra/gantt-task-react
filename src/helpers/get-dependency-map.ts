import type {
  DependencyMap,
  DependencyMargins,
  DependentMap,
  ExpandedDependency,
  ExpandedDependent,
  MapTaskToCoordinates,
  TaskMapByLevel,
  TaskOrEmpty,
} from "../types";
import {
  getCoordinatesOnLevel,
  getMapTaskToCoordinatesOnLevel,
} from "./get-task-coordinates";

export const getDependencyMap = (
  tasks: readonly TaskOrEmpty[],
  visibleTasksMirror: Readonly<Record<string, true>>,
  tasksMap: TaskMapByLevel,
  mapTaskToCoordinates: MapTaskToCoordinates,
  fullRowHeight: number,
  isShowCriticalPath: boolean
): [DependencyMap, DependentMap, DependencyMargins] => {
  const dependencyRes = new Map<number, Map<string, ExpandedDependency[]>>();
  const dependentRes = new Map<number, Map<string, ExpandedDependent[]>>();
  const marginsRes = new Map<number, Map<string, Map<string, number>>>();

  const isCollectMargins = isShowCriticalPath;

  tasks.forEach(task => {
    if (task.type === "empty") {
      return;
    }

    const { id, dependencies, comparisonLevel = 1 } = task;

    if (!visibleTasksMirror[id]) {
      return;
    }

    const tasksByLevel = tasksMap.get(comparisonLevel);

    if (!dependencies || !tasksByLevel) {
      return;
    }

    const coordinatesOnLevelMap = getMapTaskToCoordinatesOnLevel(
      task,
      mapTaskToCoordinates
    );

    const dependenciesByLevel =
      dependencyRes.get(comparisonLevel) ||
      new Map<string, ExpandedDependency[]>();
    const dependentsByLevel =
      dependentRes.get(comparisonLevel) ||
      new Map<string, ExpandedDependent[]>();
    const marginsByLevel =
      marginsRes.get(comparisonLevel) || new Map<string, Map<string, number>>();

    const dependenciesByTask = dependenciesByLevel.get(id) || [];
    const marginsByTask = marginsByLevel.get(id) || new Map<string, number>();

    const { y: toY } = getCoordinatesOnLevel(id, coordinatesOnLevelMap);

    dependencies.forEach(({ sourceId, sourceTarget, ownTarget }) => {
      if (!visibleTasksMirror[sourceId]) {
        return;
      }

      const source = tasksByLevel.get(sourceId);

      if (!source) {
        console.error(`Warning: dependency with id "${sourceId}" is not found`);
        return;
      }

      if (source.type === "empty") {
        return;
      }

      const { y: fromY } = getCoordinatesOnLevel(
        sourceId,
        coordinatesOnLevelMap
      );

      const minY = Math.min(fromY, toY);
      const maxY = Math.max(fromY, toY);
      const containerY = (Math.floor(minY / fullRowHeight) - 1) * fullRowHeight;
      const containerHeight = maxY - containerY + fullRowHeight;

      let marginBetweenTasks = null;

      if (isCollectMargins) {
        const taskTime =
          ownTarget === "startOfTask"
            ? task.start.getTime()
            : task.end.getTime();

        const sourceTime =
          sourceTarget === "startOfTask"
            ? source.start.getTime()
            : source.end.getTime();

        marginBetweenTasks = taskTime - sourceTime;
        marginsByTask.set(sourceId, marginBetweenTasks);
      }

      const innerFromY = fromY - containerY;
      const innerToY = toY - containerY;

      dependenciesByTask.push({
        containerHeight,
        containerY,
        innerFromY,
        innerToY,
        marginBetweenTasks,
        source,
        sourceTarget,
        ownTarget,
      });

      const dependentsByTask = dependentsByLevel.get(sourceId) || [];
      dependentsByTask.push({
        containerHeight,
        containerY,
        innerFromY,
        innerToY,
        marginBetweenTasks,
        dependent: task,
        dependentTarget: ownTarget,
        ownTarget: sourceTarget,
      });
      dependentsByLevel.set(sourceId, dependentsByTask);
    });

    dependenciesByLevel.set(id, dependenciesByTask);
    dependencyRes.set(comparisonLevel, dependenciesByLevel);
    dependentRes.set(comparisonLevel, dependentsByLevel);

    if (isCollectMargins) {
      marginsByLevel.set(id, marginsByTask);
      marginsRes.set(comparisonLevel, marginsByLevel);
    }
  });

  return [dependencyRes, dependentRes, marginsRes];
};
