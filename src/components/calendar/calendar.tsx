import React, { RefObject, useCallback, useEffect, useRef } from "react";
import type { ReactNode } from "react";

import {
  DateSetup,
  ViewMode,
  RenderTopHeader,
  RenderBottomHeader,
  Distances,
} from "../../types/public-types";
import { TopPartOfCalendar } from "./top-part-of-calendar";
import { getDaysInMonth } from "../../helpers/date-helper";
import { defaultRenderBottomHeader } from "./default-render-bottom-header";
import { defaultRenderTopHeader } from "./default-render-top-header";

import styles from "./calendar.module.css";

export type CalendarProps = {
  scrollRef: RefObject<HTMLDivElement>;
  additionalLeftSpace: number;
  dateSetup: DateSetup;
  distances: Distances;
  endColumnIndex: number;
  fullSvgWidth: number;
  getDate: (index: number) => Date;
  isUnknownDates: boolean;
  renderBottomHeader?: RenderBottomHeader;
  renderTopHeader?: RenderTopHeader;
  rtl: boolean;
  startColumnIndex: number;
};

interface MouseDragState {
  scrollLeft: number;
  scrollTop: number;
  clientX: number;
  clientY: number;
}

export const Calendar: React.FC<CalendarProps> = ({
  additionalLeftSpace,
  dateSetup,
  scrollRef,
  distances: { columnWidth, headerHeight },
  endColumnIndex,
  getDate,
  isUnknownDates,
  fullSvgWidth,
  renderBottomHeader = defaultRenderBottomHeader,
  renderTopHeader = defaultRenderTopHeader,
  rtl,
  startColumnIndex,
}) => {
  const calendarRef = React.useRef<SVGSVGElement>(null);
  const renderBottomHeaderByDate = useCallback(
    (date: Date, index: number) =>
      renderBottomHeader(
        date,
        dateSetup.viewMode,
        dateSetup,
        index,
        isUnknownDates
      ),
    [renderBottomHeader, dateSetup, isUnknownDates]
  );

  const renderTopHeaderByDate = useCallback(
    (date: Date) => renderTopHeader(date, dateSetup.viewMode, dateSetup),
    [renderTopHeader, dateSetup]
  );

  const renderBottomText = (
    x: number,
    y: number,
    key: string | number,
    text: ReactNode
  ): ReactNode => {
    return (
      <g key={key} className={styles.calendarBottomText}>
        <text y={y} x={x} fontFamily={"var(--gantt-font-family)"}>
          {text}
        </text>
      </g>
    );
  };

  const getCalendarValuesForYear = () => {
    const topValues: ReactNode[] = [];
    const bottomValues: ReactNode[] = [];

    for (let i = startColumnIndex; i <= endColumnIndex; i++) {
      const date = getDate(i);

      const bottomValue = renderBottomHeaderByDate(date, i);

      bottomValues.push(
        renderBottomText(
          columnWidth * i + columnWidth * 0.5,
          headerHeight * 0.8,
          date.getFullYear(),
          bottomValue
        )
      );

      if (
        !isUnknownDates &&
        (i === startColumnIndex ||
          date.getFullYear() !== getDate(i - 1).getFullYear())
      ) {
        const topValue = date.getFullYear().toString();

        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={null}
            x1Line={additionalLeftSpace + columnWidth * i}
            y1Line={0}
            y2Line={headerHeight}
            xText={0}
            yText={0}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForMonth = () => {
    const topValues: ReactNode[] = [];
    const bottomValues: ReactNode[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    for (let i = startColumnIndex; i <= endColumnIndex; i++) {
      const date = getDate(i);

      const bottomValue = renderBottomHeaderByDate(date, i);

      bottomValues.push(
        renderBottomText(
          additionalLeftSpace + columnWidth * i + columnWidth * 0.5,
          headerHeight * 0.8,
          `${date.getMonth()}-${date.getFullYear()}`,
          bottomValue
        )
      );

      const fullYear = date.getFullYear();

      if (
        !isUnknownDates &&
        (i === startColumnIndex || fullYear !== getDate(i - 1).getFullYear())
      ) {
        const topValue = renderTopHeaderByDate(date);
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getMonth() + 1) * columnWidth;
        } else {
          xText = (6 + i - date.getMonth()) * columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={fullYear}
            value={topValue}
            x1Line={additionalLeftSpace + columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={additionalLeftSpace + xText}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForWeek = () => {
    const topValues: ReactNode[] = [];
    const bottomValues: ReactNode[] = [];
    let weeksCount: number = 1;
    const topDefaultHeight = headerHeight * 0.5;
    for (let i = endColumnIndex; i >= startColumnIndex; i--) {
      const date = getDate(i);

      const month = date.getMonth();
      const fullYear = date.getFullYear();

      let topValue: ReactNode = "";
      if (
        !isUnknownDates &&
        (i === startColumnIndex || month !== getDate(i - 1).getMonth())
      ) {
        // top
        topValue = renderTopHeaderByDate(date);
      }
      // bottom
      const bottomValue = renderBottomHeaderByDate(date, i);

      bottomValues.push(
        renderBottomText(
          additionalLeftSpace + columnWidth * (i + +rtl),
          headerHeight * 0.8,
          date.getTime(),
          bottomValue
        )
      );

      if (topValue) {
        topValues.push(
          <TopPartOfCalendar
            key={`${month}_${fullYear}`}
            value={topValue}
            x1Line={
              additionalLeftSpace + columnWidth * i + weeksCount * columnWidth
            }
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={
              additionalLeftSpace +
              columnWidth * i +
              columnWidth * weeksCount * 0.5
            }
            yText={topDefaultHeight * 0.9}
          />
        );

        weeksCount = 0;
      }
      weeksCount++;
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForDay = () => {
    const topValues: ReactNode[] = [];
    const bottomValues: ReactNode[] = [];
    const topDefaultHeight = headerHeight * 0.5;

    const renderedMonths = new Set<string>();

    for (let i = startColumnIndex; i <= endColumnIndex; i++) {
      const date = getDate(i);

      const bottomValue = renderBottomHeaderByDate(date, i);

      const month = date.getMonth();
      const fullYear = date.getFullYear();

      bottomValues.push(
        renderBottomText(
          additionalLeftSpace + columnWidth * i + columnWidth * 0.5,
          headerHeight * 0.8,
          date.getTime(),
          bottomValue
        )
      );

      const monthKey = `${month}/${fullYear}`;

      if (!isUnknownDates && !renderedMonths.has(monthKey)) {
        renderedMonths.add(monthKey);
        const topValue = renderTopHeaderByDate(date);

        const startIndex = i + 1 - date.getDate();
        const endIndex = startIndex + getDaysInMonth(month, fullYear);

        const startIndexOrZero = Math.max(startIndex, 0);

        topValues.push(
          <TopPartOfCalendar
            key={`${month}_${fullYear}`}
            value={topValue}
            x1Line={additionalLeftSpace + columnWidth * endIndex}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={
              additionalLeftSpace +
              columnWidth *
                (startIndexOrZero + (endIndex - startIndexOrZero) / 2)
            }
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForPartOfDay = () => {
    const topValues: ReactNode[] = [];
    const bottomValues: ReactNode[] = [];
    const ticks = dateSetup.viewMode === ViewMode.HalfDay ? 2 : 4;
    const topDefaultHeight = headerHeight * 0.5;
    for (let i = startColumnIndex; i <= endColumnIndex; i++) {
      const date = getDate(i);

      const bottomValue = renderBottomHeaderByDate(date, i);

      bottomValues.push(
        renderBottomText(
          additionalLeftSpace + columnWidth * (i + +rtl),
          headerHeight * 0.8,
          date.getTime(),
          bottomValue
        )
      );

      const dayOfMonth = date.getDate();
      const prevDate = getDate(i - 1);

      if (!isUnknownDates && dayOfMonth !== prevDate.getDate()) {
        const topValue = renderTopHeaderByDate(date);
        const widthMultiplier = i - 1;

        topValues.push(
          <TopPartOfCalendar
            key={`${prevDate.getDate()}_${prevDate.getMonth()}_${prevDate.getFullYear()}`}
            value={topValue}
            x1Line={
              additionalLeftSpace +
              columnWidth * widthMultiplier +
              ticks * columnWidth
            }
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={
              additionalLeftSpace +
              columnWidth * widthMultiplier +
              ticks * columnWidth * 0.5
            }
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }

    return [topValues, bottomValues];
  };

  const getCalendarValuesForHour = () => {
    const topValues: ReactNode[] = [];
    const bottomValues: ReactNode[] = [];
    const topDefaultHeight = headerHeight * 0.5;

    const renderedDates = new Set<string>();

    for (let i = startColumnIndex; i <= endColumnIndex; i++) {
      const date = getDate(i);

      const bottomValue = renderBottomHeaderByDate(date, i);

      bottomValues.push(
        renderBottomText(
          additionalLeftSpace + columnWidth * (i + +rtl),
          headerHeight * 0.8,
          date.getTime(),
          bottomValue
        )
      );

      const dayOfMonth = date.getDate();

      const dateKey = `${dayOfMonth}/${date.getMonth()}/${date.getFullYear()}`;

      if (!isUnknownDates && !renderedDates.has(dateKey)) {
        renderedDates.add(dateKey);

        const topValue = renderTopHeaderByDate(date);

        const topPosition = date.getHours() / 2;

        topValues.push(
          <TopPartOfCalendar
            key={dateKey}
            value={topValue}
            x1Line={additionalLeftSpace + columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={additionalLeftSpace + columnWidth * (i + topPosition)}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }

    return [topValues, bottomValues];
  };

  let topValues: ReactNode[] | null = [];
  let bottomValues: ReactNode[] | null = [];
  switch (dateSetup.viewMode) {
    case ViewMode.Year:
      [topValues, bottomValues] = getCalendarValuesForYear();
      break;
    case ViewMode.Month:
      [topValues, bottomValues] = getCalendarValuesForMonth();
      break;
    case ViewMode.Week:
      [topValues, bottomValues] = getCalendarValuesForWeek();
      break;
    case ViewMode.Day:
      [topValues, bottomValues] = getCalendarValuesForDay();
      break;
    case ViewMode.QuarterDay:
    case ViewMode.HalfDay:
      [topValues, bottomValues] = getCalendarValuesForPartOfDay();
      break;
    case ViewMode.Hour:
      [topValues, bottomValues] = getCalendarValuesForHour();
  }

  const moveStateRef = useRef<MouseDragState | null>(null);

  // https://stackoverflow.com/questions/40926181/react-scrolling-a-div-by-dragging-the-mouse
  useEffect(() => {
    if (!calendarRef.current) {
      return () => {};
    }

    const calendarContainer = calendarRef.current;

    const onScrollStart = (event: MouseEvent) => {
      event.preventDefault();
      moveStateRef.current = {
        clientX: event.clientX,
        clientY: event.clientY,
        scrollLeft: scrollRef.current.scrollLeft,
        scrollTop: scrollRef.current.scrollTop,
      }
      calendarContainer.classList.add(styles.calendarDragging);
    };

    const onScrollMove = (event: MouseEvent) => {
      if (!moveStateRef.current) {
        return;
      }

      event.preventDefault();
      const {clientX, scrollLeft, scrollTop, clientY} = moveStateRef.current;
      const scrollContainer = scrollRef.current;
      scrollContainer.scrollLeft = scrollLeft + clientX - event.clientX;
      scrollContainer.scrollTop = scrollTop + clientY - event.clientY;
    };

    const onScrollEnd = (event: MouseEvent) => {
      event.preventDefault();
      moveStateRef.current = null;
      calendarContainer.classList.remove(styles.calendarDragging);
    };

    calendarContainer.addEventListener("mousemove", onScrollMove);
    calendarContainer.addEventListener("mousedown", onScrollStart);
    calendarContainer.addEventListener("mouseup", onScrollEnd);
    calendarContainer.addEventListener("mouseout", onScrollEnd);

    return () => {
      calendarContainer.removeEventListener("mousemove", onScrollMove);
      calendarContainer.removeEventListener("mousedown", onScrollStart);
      calendarContainer.removeEventListener("mouseup", onScrollEnd);
      calendarContainer.removeEventListener("mouseout", onScrollEnd);
    };
  }, [scrollRef]);

  return (
    <g
      ref={calendarRef}
      className={`${styles.calendar} calendar`}
      fontSize={"var(--gantt-font-size)"}
      fontFamily={"var(--gantt-font-family)"}
    >
      <rect
        x={0}
        y={0}
        width={fullSvgWidth}
        height={headerHeight}
        className={styles.calendarHeader}
      />

      {topValues}
      {bottomValues}
    </g>
  );
};
