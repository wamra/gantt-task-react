import {useCallback} from "react";
import type {ReactElement} from "react";

import type {
  ContextMenuOptionType,
  Distances,
} from "../../types/public-types";

import styles from "./menu-option.module.css";

type MenuOptionProps = {
  distances: Distances;
  handleAction: (option: ContextMenuOptionType) => void;
  option: ContextMenuOptionType;
};

export function MenuOption(props: MenuOptionProps): ReactElement {
  const {
    distances: {
      contextMenuIconWidth,
      contextMenuOptionHeight,
      contextMenuSidePadding,
    },
    handleAction,
    option,
    option: {icon, label},
  } = props;
  const onClick = useCallback(() => {
    handleAction(option);
  }, [handleAction, option]);

  return (
    <button
      className={styles.menuOption}
      style={{
        height: contextMenuOptionHeight,
        paddingLeft: contextMenuSidePadding,
        paddingRight: contextMenuSidePadding,
        color: 'var(--gantt-context-menu-text-color)',
      }}
      onClick={onClick}
    >
      <div
        className={styles.icon}
        style={{
          width: contextMenuIconWidth,
          color: 'var(--gantt-context-menu-text-color)',
          opacity: 0.5
        }}
      >
        {icon}
      </div>

      <div className={styles.label}>{label}</div>
    </button>
  );
}
