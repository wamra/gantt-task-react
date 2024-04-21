import { format } from "date-fns";

import { DateSetup, ViewMode } from "../../types";

const getDayText = (date: Date, dateSetup: DateSetup) => {
  try {
    return format(date, dateSetup.dateFormats.dayTopHeaderFormat, {
      locale: dateSetup.dateLocale,
    });
  } catch (e) {
    return String(date.getDate());
  }
};

const getMonthText = (date: Date, dateSetup: DateSetup) => {
  try {
    return format(date, dateSetup.dateFormats.monthTopHeaderFormat, {
      locale: dateSetup.dateLocale,
    });
  } catch (e) {
    return date.toLocaleString("default", { month: "long" });
  }
};

export const defaultRenderTopHeader = (
  date: Date,
  viewMode: ViewMode,
  dateSetup: DateSetup
): string => {
  switch (viewMode) {
    case ViewMode.Year:
    case ViewMode.Month:
      return date.getFullYear().toString();

    case ViewMode.Week:
      return `${getMonthText(date, dateSetup)}, ${date.getFullYear()}`;

    case ViewMode.Day:
      return getMonthText(date, dateSetup);

    case ViewMode.QuarterDay:
    case ViewMode.HalfDay:
      return `${getDayText(date, dateSetup)} ${getMonthText(date, dateSetup)}`;

    case ViewMode.Hour:
      return `${getDayText(date, dateSetup)} ${getMonthText(date, dateSetup)}`;

    default:
      throw new Error("Unknown viewMode");
  }
};
