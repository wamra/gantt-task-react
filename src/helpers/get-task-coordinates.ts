import { MapTaskToCoordinates, Task, TaskCoordinates } from "../types/public-types";

export const getMapTaskToCoordinatesOnLevel = (
  task: Task,
  mapTaskToCoordinates: MapTaskToCoordinates,
) => {
  const {
    comparisonLevel = 1,
  } = task;

  const mapTaskToCoordinatesOnLevel = mapTaskToCoordinates.get(comparisonLevel);

  if (!mapTaskToCoordinatesOnLevel) {
    throw new Error(`Coordinates on level ${comparisonLevel} are not found`);
  }

  return mapTaskToCoordinatesOnLevel;
};

export const getCoordinatesOnLevel = (
  taskId: string,
  mapTaskToCoordinatesOnLevel: Map<string, TaskCoordinates>,
) => {
  const coordinates = mapTaskToCoordinatesOnLevel.get(taskId);

  if (!coordinates) {
    throw new Error(`Coordinates are not found for task ${taskId}`);
  }

  return coordinates;
};

export const getTaskCoordinates = (
  task: Task,
  mapTaskToCoordinates: MapTaskToCoordinates,
) => {
  const {
    id,
  } = task;

  const mapTaskToCoordinatesOnLevel = getMapTaskToCoordinatesOnLevel(task, mapTaskToCoordinates);

  return getCoordinatesOnLevel(id, mapTaskToCoordinatesOnLevel);
};
