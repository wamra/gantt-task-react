import { GanttTheme } from "../../types/public-types";
import { DEFAULT_THEME } from "./default-theme";

function isObject(item: object) {
  return item && typeof item === "object" && !Array.isArray(item);
}

function mergeDeep(target: any, ...sources: any[]) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export const buildGanttTheme = (theme?: Partial<GanttTheme>): GanttTheme => {
  return mergeDeep({}, DEFAULT_THEME, theme);
};
