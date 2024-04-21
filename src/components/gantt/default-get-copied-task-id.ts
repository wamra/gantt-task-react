import type { GetCopiedTaskId } from "../../types";

export const defaultGetCopiedTaskId: GetCopiedTaskId = (task, checkExists) => {
  const { id } = task;

  const prefix = `${id}_copy`;

  for (let i = 1; ; ++i) {
    const nextName = i === 1 ? prefix : `${prefix}(${i})`;

    if (!checkExists(nextName)) {
      return nextName;
    }
  }
};
