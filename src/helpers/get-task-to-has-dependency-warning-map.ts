import type {
  DependencyMargins,
  TaskToHasDependencyWarningMap,
} from "../types/public-types";

const checkTaskHasWarning = (dependencyMarginsForTask: Map<string, number>) => {
  for (const value of dependencyMarginsForTask.values()) {
    if (value < 0) {
      return true;
    }
  }

  return false;
};

export const getTaskToHasDependencyWarningMap = (
  dependencyMarginsMap: DependencyMargins,
): TaskToHasDependencyWarningMap => {
  const res = new Map<number, Set<string>>();

  for (const [comparisonLevel, marginsByLevel] of dependencyMarginsMap.entries()) {
    const resAtLevel = new Set<string>();

    for (const [taskId, dependencyMarginsForTask] of marginsByLevel.entries()) {
      if (checkTaskHasWarning(dependencyMarginsForTask)) {
        resAtLevel.add(taskId);
      }
    }

    res.set(comparisonLevel, resAtLevel);
  }

  return res;
};
