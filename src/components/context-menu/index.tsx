// import type { MutableRefObject, ReactElement } from "react";
import type {ReactElement} from "react";
import React, {useCallback, useEffect, useMemo, useRef} from "react";

import {autoUpdate, flip, shift} from "@floating-ui/dom";
import {useDismiss, useFloating, useFocus, useInteractions, useRole,} from "@floating-ui/react";

import type {
  ActionMetaType,
  CheckIsAvailableMetaType,
  ColorStyles,
  ContextMenuOptionType,
  ContextMenuType,
  Distances,
  TaskOrEmpty,
} from "../../types/public-types";

import {MenuOption} from "./menu-option";

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

export function ContextMenu(props: ContextMenuProps): ReactElement {
  const {
    checkHasCopyTasks,
    checkHasCutTasks,

    colors,
    colors: {contextMenuBgColor, contextMenuBoxShadow},

    contextMenu: {task, x, y},

    distances,
    handleAction,
    handleCloseContextMenu,
    options,
  } = props;
  const optionsForRender = useMemo(() => {
    if (!task) {
      return [];
    }

    const meta: CheckIsAvailableMetaType = {
      task,
      checkHasCopyTasks,
      checkHasCutTasks,
    };

    return options.filter(({checkIsAvailable}) => {
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
    refs,
    context,
  } = useFloating({
    open: Boolean(task),
    onOpenChange: (isOpen) => {
      if (!isOpen) {
        handleCloseContextMenu()
      }
    },
    strategy: 'fixed',
    placement: "bottom-start",
    middleware: [flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const {setFloating, setReference} = refs;

  useEffect(() => {
    if (task) {
      context.update();
    }
  }, [task, x, y]);

  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, {role: "tooltip"});

  const {getReferenceProps, getFloatingProps} = useInteractions([
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
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            zIndex: 1,
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
