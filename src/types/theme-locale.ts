import type { Locale as DateLocale } from "date-fns";

export interface GanttLocale {
  /**
   * Locale of date-fns
   */
  dateLocale?: DateLocale;
  suffix: {
    days: string;
  };
  tooltip: {
    duration: string;
    progress: string;
  };
  table: {
    columns: {
      name: string;
      startDate: string;
      endDate: string;
      dependencies: string;
      progress: string;
    };
  };
  context: {
    edit: string;
    copy: string;
    cut: string;
    paste: string;
    delete: string;
  };
}
