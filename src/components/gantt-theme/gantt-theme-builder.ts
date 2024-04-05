import { GanttPartialTheme, GanttTheme } from "../../types/public-types";
import { DEFAULT_THEME } from "./default-theme";
import { mergeDeepObj } from "../../helpers/obj-helper";

export const buildGanttTheme = (theme?: GanttPartialTheme): GanttTheme => {
  return mergeDeepObj({}, DEFAULT_THEME, theme);
};
