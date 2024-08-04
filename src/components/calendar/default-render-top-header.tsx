import format from "date-fns/format";

import {DateSetup, ViewMode} from "../../types/public-types";

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

const getQuarterText = (date: Date) => {
  // Calculate the quarter number (1-4)
  const quarter = Math.ceil((date.getMonth() + 1) / 3);
  return `Q${quarter}`;
};

export const defaultRenderTopHeader = (
  date: Date,
  viewMode: ViewMode,
  dateSetup: DateSetup
): string => {
  switch (viewMode) {
    case ViewMode.Year:
      return date.getFullYear().toString();

    case ViewMode.QuarterYear:
      return `${getQuarterText(date)} ${date.getFullYear()}`;

    case ViewMode.Month:
      return date.getFullYear().toString();

    case ViewMode.Week:
      return `${getMonthText(date, dateSetup)}, ${date.getFullYear()}`;

    case ViewMode.TwoDays:
      return getMonthText(date, dateSetup);

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
