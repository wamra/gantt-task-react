import { GanttTheme } from "../../types/public-types";
import { DEFAULT_THEME } from "./default-theme";
import { mergeDeepObj } from "../../helpers/obj-helper";

export const buildGanttTheme = (theme?: Partial<GanttTheme>): GanttTheme => {
  return mergeDeepObj({}, DEFAULT_THEME, theme);
};
