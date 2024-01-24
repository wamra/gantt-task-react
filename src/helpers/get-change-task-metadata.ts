import { getDependentTasks } from "../change-metadata/get-dependent-tasks";
import { getTaskIndexes } from "../change-metadata/get-task-indexes";
import { changeStartAndEndDescendants } from "../suggestions/change-start-and-end-descendants";
import type {
  AdjustTaskToWorkingDatesParams,
  ChangeAction,
  ChangeMetadata,
  ChildByLevelMap,
  DependentMap,
  Task,
  TaskMapByLevel,
  TaskToGlobalIndexMap,
} from "../types/public-types";
import { collectParents } from "./collect-parents";
import { getAllDescendants } from "./get-all-descendants";
import { getSuggestedStartEndChanges } from "./get-suggested-start-end-changes";

const collectSuggestedParents = (
  changeAction: ChangeAction,
  tasksMap: TaskMapByLevel
) => {
  switch (changeAction.type) {
    case "add-childs":
      return [
        changeAction.parent,
        ...collectParents(changeAction.parent, tasksMap),
      ];

    case "change":
    case "change_start_and_end":
      return collectParents(changeAction.task, tasksMap);

    case "delete": {
      const resSet = new Set<Task>();

      changeAction.tasks.forEach(task => {
        const parents = collectParents(task, tasksMap);

        parents.forEach(parentTask => {
          resSet.add(parentTask);
        });
      });

      return [...resSet];
    }

    case "move-before":
      return [
        ...collectParents(changeAction.target, tasksMap),
        ...collectParents(changeAction.taskForMove, tasksMap),
      ];

    case "move-after":
      return [
        ...collectParents(changeAction.target, tasksMap),
        ...collectParents(changeAction.taskForMove, tasksMap),
      ];

    case "move-inside": {
      const resSet = new Set<Task>([changeAction.parent]);

      collectParents(changeAction.parent, tasksMap).forEach(parentTask => {
        resSet.add(parentTask);
      });

      changeAction.childs.forEach(child => {
        collectParents(child, tasksMap).forEach(parentTask => {
          resSet.add(parentTask);
        });
      });

      return [...resSet];
    }

    default:
      throw new Error(
        `Unknown change action: ${(changeAction as ChangeAction).type}`
      );
  }
};

type GetChangeTaskMetadataParams = {
  adjustTaskToWorkingDates: (params: AdjustTaskToWorkingDatesParams) => Task;
  changeAction: ChangeAction;
  childTasksMap: ChildByLevelMap;
  dependentMap: DependentMap;
  isMoveChildsWithParent: boolean;
  isRecountParentsOnChange: boolean;
  mapTaskToGlobalIndex: TaskToGlobalIndexMap;
  tasksMap: TaskMapByLevel;
};

export const getChangeTaskMetadata = ({
  adjustTaskToWorkingDates,
  changeAction,
  childTasksMap,
  dependentMap,
  isMoveChildsWithParent,
  isRecountParentsOnChange,
  mapTaskToGlobalIndex,
  tasksMap,
}: GetChangeTaskMetadataParams): ChangeMetadata => {
  const parentSuggestedTasks = isRecountParentsOnChange
    ? collectSuggestedParents(changeAction, tasksMap)
    : [];

  const computedCacheMap = new Map<Task, [Date, Date] | null>();

  const parentSuggestions = parentSuggestedTasks.map(parentTask =>
    getSuggestedStartEndChanges(
      computedCacheMap,
      parentTask,
      changeAction,
      childTasksMap,
      mapTaskToGlobalIndex
    )
  );

  const descendants =
    isMoveChildsWithParent && changeAction.type === "change_start_and_end"
      ? getAllDescendants(changeAction.task, childTasksMap, false)
      : [];

  const descendantSuggestions =
    changeAction.type === "change_start_and_end"
      ? changeStartAndEndDescendants({
          adjustTaskToWorkingDates,
          changedTask: changeAction.changedTask,
          descendants,
          mapTaskToGlobalIndex,
          originalTask: changeAction.originalTask,
        })
      : [];

  const suggestedTasks = [...parentSuggestedTasks, ...descendants];
  const suggestions = [...parentSuggestions, ...descendantSuggestions];

  const taskIndexes = getTaskIndexes(changeAction, mapTaskToGlobalIndex);
  const dependentTasks = getDependentTasks(changeAction, dependentMap);

  return [dependentTasks, taskIndexes, suggestedTasks, suggestions];
};
