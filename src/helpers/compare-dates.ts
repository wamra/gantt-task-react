export const compareDates = (
  date1: Date,
  date2: Date,
): number => {
  const time1 = date1.getTime();
  const time2 = date2.getTime();

  if (time1 < time2) {
    return -1;
  }

  if (time1 > time2) {
    return 1;
  }

  return 0;
};
