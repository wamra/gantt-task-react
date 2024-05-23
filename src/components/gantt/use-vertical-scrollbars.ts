import { useRef } from "react";
import type { RefObject, SyntheticEvent } from "react";

export const useVerticalScrollbars = (): [
  RefObject<HTMLDivElement>,
  RefObject<HTMLDivElement>,
  (nextScrollY: number) => void,
  (event: SyntheticEvent<HTMLDivElement>) => void
] => {
  const ganttTaskContentRef = useRef<HTMLDivElement>(null);
  const taskListContentRef = useRef<HTMLDivElement>(null);

  const setScrollYProgrammatically = (nextScrollY: number) => {
    if (taskListContentRef.current) {
      // The following line will trigger onScrollVertically
      taskListContentRef.current.scrollTop = nextScrollY;
    }
  };

  /*
   * The aim of this trigger is to synchronize taskListContentRef and ganttTaskContentRef vertical scrollbar
   */
  const onScrollVertically = (event: SyntheticEvent<HTMLDivElement>) => {
    if (event.currentTarget === ganttTaskContentRef.current) {
      taskListContentRef.current.scrollTop =
        ganttTaskContentRef.current.scrollTop;
      //  On chrome, if a horizontal scrollbar is displayed in ganttTaskContentRef then the size of the gantt
      // is greater. So, when scrolling gantt to the bottom it goes more in the bottom
      // than the taskListContent part can. In this case, ganttTaskContentRef.current.scrollTop is too high
      // The line below allow to lower ganttTaskContentRef.current.scrollTop
      ganttTaskContentRef.current.scrollTop =
        taskListContentRef.current.scrollTop;
    } else {
      ganttTaskContentRef.current.scrollTop =
        taskListContentRef.current.scrollTop;
      taskListContentRef.current.scrollTop =
        ganttTaskContentRef.current.scrollTop;
    }
  };

  return [
    ganttTaskContentRef,
    taskListContentRef,
    setScrollYProgrammatically,
    onScrollVertically,
  ];
};
