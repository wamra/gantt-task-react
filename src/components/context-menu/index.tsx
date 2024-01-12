import { useCallback, useEffect, useMemo, useRef } from "react";
// import type { MutableRefObject, ReactElement } from "react";
import type { ReactElement } from "react";

import { autoUpdate, flip, shift } from "@floating-ui/dom";
import {
  useFloating,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
} from "@floating-ui/react";

// import { useOutsideClick } from 'use-dom-outside-click';

import type {
  ActionMetaType,
  CheckIsAvailableMetaType,
  ColorStyles,
  ContextMenuOptionType,
  ContextMenuType,
  Distances,
  TaskOrEmpty,
} from "../../types/public-types";

import { MenuOption } from "./menu-option";

type ContextMenuProps = {
  checkHasCopyTasks: () => boolean;
  checkHasCutTasks: () => boolean;
  contextMenu: ContextMenuType;
  colors: ColorStyles;
  distances: Distances;
  handleAction: (
    task: TaskOrEmpty,
    action: (meta: ActionMetaType) => void
  ) => void;
  handleCloseContextMenu: () => void;
  options: ContextMenuOptionType[];
};

export function ContextMenu({
  checkHasCopyTasks,
  checkHasCutTasks,

  colors,
  colors: { contextMenuBgColor, contextMenuBoxShadow },

  contextMenu: { task, x, y },

  distances,
  handleAction,
  handleCloseContextMenu,
  options,
}: ContextMenuProps): ReactElement {
  const optionsForRender = useMemo(() => {
    if (!task) {
      return [];
    }

    const meta: CheckIsAvailableMetaType = {
      task,
      checkHasCopyTasks,
      checkHasCutTasks,
    };

    return options.filter(({ checkIsAvailable }) => {
      if (!checkIsAvailable) {
        return true;
      }

      return checkIsAvailable(meta);
    });
  }, [task, checkHasCopyTasks, checkHasCutTasks, options]);

  const handleOptionAction = useCallback(
    (option: ContextMenuOptionType) => {
      handleCloseContextMenu();

      if (!task) {
        return;
      }

      handleAction(task, option.action);
    },
    [handleAction, handleCloseContextMenu, task]
  );

  const {
    x: menuX,
    y: menuY,
    strategy,
    refs: { setFloating, setReference },
    context,
  } = useFloating({
    open: Boolean(task),
    placement: "bottom-start",
    middleware: [flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (task) {
      context.update();
    }
  }, [task, x, y]);

  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    focus,
    dismiss,
    role,
  ]);

  const floatingRef = useRef<HTMLDivElement>();

  const setFloatingRef = useCallback(
    (el: HTMLDivElement | null) => {
      floatingRef.current = el || undefined;
      setFloating(el);
    },
    [setFloating]
  );

  // useOutsideClick(floatingRef as MutableRefObject<HTMLDivElement>, () => {
  //   handleCloseContextMenu();
  // });

  return (
    <>
      <div
        {...getReferenceProps()}
        style={{
          position: "absolute",
          left: x,
          top: y,
        }}
        ref={setReference}
      />

      {task && (
        <div
          ref={setFloatingRef}
          style={{
            position: strategy,
            top: menuY ?? 0,
            left: menuX ?? 0,
            width: "max-content",
            backgroundColor: contextMenuBgColor,
            boxShadow: contextMenuBoxShadow,
          }}
          {...getFloatingProps()}
        >
          {optionsForRender.map((option, index) => (
            <MenuOption
              colors={colors}
              distances={distances}
              handleAction={handleOptionAction}
              option={option}
              key={index}
            />
          ))}
        </div>
      )}
    </>
  );
}
