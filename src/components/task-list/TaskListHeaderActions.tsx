import React from "react";
import { UnfoldLess, UnfoldMore, UnfoldMoreDouble } from "@mui/icons-material";
import { createTheme, IconButton, Theme, ThemeOptions, ThemeProvider, Tooltip } from "@mui/material";
import style from "./TaskListHeaderActions.module.css";
import { ColorStyles } from "../../types/public-types";

export type TaskListHeaderActionsProps = {
  onCollapseAll: () => void;
  onExpandFirstLevel: () => void;
  onExpandAll: () => void;
  colors: Partial<ColorStyles>
};

export const TaskListHeaderActions: React.FC<TaskListHeaderActionsProps> =
  ({
     onCollapseAll,
     onExpandFirstLevel,
     onExpandAll,
     colors
   }) => {

    let themeOptions: ThemeOptions = {
      palette: {
        primary: {
          main: colors.barLabelColor // Maps to a primary color (e.g., task bar background)
        },
        secondary: {
          main: colors.barLabelColor // Maps to a secondary color (e.g., task progress)
        },
        background: {
          default: colors.evenTaskBackgroundColor, // Background color for even tasks
          paper: colors.oddTaskBackgroundColor // Background color for odd tasks or paper elements
        },
        text: {
          primary: colors.barLabelColor, // Main text color (bar labels, etc.)
          secondary: colors.barLabelColor // Context menu text color
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              color: colors.barLabelColor // Use the bar label color for button text
            }
          }
        },
        MuiTooltip: {
          styleOverrides: {
            tooltip: {
              backgroundColor: colors.contextMenuBgColor, // Tooltip background color
              color: colors.contextMenuTextColor // Tooltip text color
            }
          }
        },
        MuiSvgIcon: {
          styleOverrides: {
            root: {
              color: colors.barLabelColor, // Apply primary icon color to all icons
              '&.MuiSvgIcon-colorSecondary': {
                color:  colors.barLabelWhenOutsideColor, // Apply secondary color to icons
              },
            },
          },
        },
      }
    };
    const materialLightTheme: Theme = createTheme(themeOptions);

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
