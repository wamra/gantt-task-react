import { DateExtremity, ViewMode } from "../../types/public-types";

import { defaultRoundEndDate } from "./default-round-end-date";
import { defaultRoundStartDate } from "./default-round-start-date";

export const defaultRoundDate = (
  date: Date,
  viewMode: ViewMode,
  dateExtremity: DateExtremity
) => {
  if (dateExtremity == "startOfTask") {
    return defaultRoundStartDate(date, viewMode);
  } else {
    return defaultRoundEndDate(date, viewMode);
  }
};
