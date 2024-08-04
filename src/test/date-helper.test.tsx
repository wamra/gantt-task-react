import addMonths from 'date-fns/addMonths';
import addDays from 'date-fns/addDays';

import {
  getWeekNumberISO8601,
} from "../helpers/date-helper";

describe("add to date", () => {
  test("add month", () => {
    expect(addMonths(new Date(2020, 0, 1), 40)).toEqual(
      new Date(2023, 4, 1)
    );
  });

  test("add day", () => {
    expect(addDays(new Date(2020, 0, 1), 40)).toEqual(
      new Date(2020, 1, 10)
    );
  });
});

test("get week number", () => {
  expect(getWeekNumberISO8601(new Date(2019, 11, 31))).toEqual("01");
  expect(getWeekNumberISO8601(new Date(2021, 0, 1))).toEqual("53");
  expect(getWeekNumberISO8601(new Date(2020, 6, 20))).toEqual("30");
});
