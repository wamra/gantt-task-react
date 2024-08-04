import React from "react";
import { UnfoldLess, UnfoldMore, UnfoldMoreDouble } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import style from "./TaskListHeaderActions.module.css";

export type TaskListHeaderActionsProps = {
  onCollapseAll: () => void;
  onExpandFirstLevel: () => void;
  onExpandAll: () => void;
};

export const TaskListHeaderActions: React.FC<TaskListHeaderActionsProps> =
  ({
     onCollapseAll,
     onExpandFirstLevel,
     onExpandAll
   }) => {
    return (
      <div className={style.taskListHeaderAction}>
        <Tooltip title={"Collapse All"}>
          <IconButton onClick={onCollapseAll}>
            <UnfoldLess />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Expand First Level"}>
          <IconButton onClick={onExpandFirstLevel}>
            <UnfoldMore />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Expand All"}>
          <IconButton onClick={onExpandAll}>
            <UnfoldMoreDouble />
          </IconButton>
        </Tooltip>
      </div>
    );
  };
