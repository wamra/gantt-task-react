import React from "react";
import { UnfoldLess, UnfoldMore, UnfoldMoreDouble } from "@mui/icons-material";
import { createTheme, IconButton, ThemeProvider, Tooltip } from "@mui/material";
import style from "./TaskListHeaderActions.module.css";

export type TaskListHeaderActionsProps = {
  onCollapseAll: () => void;
  onExpandFirstLevel: () => void;
  onExpandAll: () => void;
};

const materialLightTheme = createTheme({
  palette: {
    mode: "light"
  }
});

export const TaskListHeaderActions: React.FC<TaskListHeaderActionsProps> =
  ({
     onCollapseAll,
     onExpandFirstLevel,
     onExpandAll
   }) => {

    return (
      <ThemeProvider theme={materialLightTheme}>
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
      </ThemeProvider>
    );
  };
