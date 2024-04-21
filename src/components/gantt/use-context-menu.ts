import type { RefObject } from "react";
import { useCallback, useState } from "react";

import { ContextMenuType, Task, TaskOrEmpty } from "../../types";

export const useContextMenu = (
  wrapperRef: RefObject<HTMLDivElement>,
  scrollToTask: (task: Task) => void
) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuType>({
    task: null,
    x: 0,
    y: 0,
  });

  const handleOpenContextMenu = useCallback(
    (task: TaskOrEmpty, clientX: number, clientY: number) => {
      const wrapperNode = wrapperRef.current;

      if (!wrapperNode) {
        return;
      }

      const { top, left } = wrapperNode.getBoundingClientRect();

      setContextMenu({
        task,
        x: clientX - left,
        y: clientY - top,
      });

      if (task.type !== "empty") {
        scrollToTask(task);
      }
    },
    [wrapperRef, scrollToTask]
  );

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu({
      task: null,
      x: 0,
      y: 0,
    });
  }, []);

  return {
    contextMenu,
    handleCloseContextMenu,
    handleOpenContextMenu,
  };
};
