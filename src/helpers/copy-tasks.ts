import type {
  CheckTaskIdExistsAtLevel,
  GetCopiedTaskId,
  TaskOrEmpty,
} from "../types";

export const copyTasks = (
  tasks: readonly TaskOrEmpty[],
  getCopiedTaskId: GetCopiedTaskId,
  checkExistsAtLevel: CheckTaskIdExistsAtLevel
) => {
  // comparison level -> original id -> new id
  const idToCopiedIdMap = new Map<number, Map<string, string>>();

  tasks.forEach(originalTask => {
    const { comparisonLevel = 1 } = originalTask;

    const idToCopiedIdAtLevelMap =
      idToCopiedIdMap.get(comparisonLevel) || new Map<string, string>();

    idToCopiedIdAtLevelMap.set(
      originalTask.id,
      getCopiedTaskId(originalTask, taskId =>
        checkExistsAtLevel(taskId, comparisonLevel)
      )
    );

    idToCopiedIdMap.set(comparisonLevel, idToCopiedIdAtLevelMap);
  });

  return tasks.map<TaskOrEmpty>(originalTask => {
    const { id: originalId, comparisonLevel = 1, parent } = originalTask;

    const idToCopiedIdAtLevelMap = idToCopiedIdMap.get(comparisonLevel);

    if (!idToCopiedIdAtLevelMap) {
      throw new Error(`Ids are not found at level ${comparisonLevel}`);
    }

    const newId = idToCopiedIdAtLevelMap.get(originalId);

    if (!newId) {
      throw new Error(`NEw id is not found for task "${originalId}"`);
    }

    const nextParent = parent ? idToCopiedIdAtLevelMap.get(parent) : undefined;

    if (originalTask.type === "empty") {
      return {
        ...originalTask,
        id: newId,
        parent: nextParent,
      };
    }

    const { dependencies } = originalTask;

    return {
      ...originalTask,
      id: newId,
      dependencies: dependencies
        ? dependencies.map(dependency => {
            const mappedId = idToCopiedIdAtLevelMap.get(dependency.sourceId);

            if (mappedId) {
              return {
                ...dependency,
                sourceId: mappedId,
              };
            }

            return dependency;
          })
        : undefined,

      parent: nextParent,
    };
  });
};
