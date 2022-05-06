/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import { ChevronLeft, ChevronRight } from '@warden-sk/icons';
import { DAYS, MONTHS } from './constants';
import React, { useRef, useState } from 'react';
import CalendarDay from './CalendarDay';
import EnhancedDate from '../helpers/EnhancedDate';
import readElementWidth from '../helpers/readElementWidth';

interface P extends EnhancedElement<JSX.IntrinsicElements['div']> {
  date: number;
  updateDate: (date: number) => void;
}

function Calendar({ date, updateDate }: P) {
  const [downX, updateDownX] = useState<number>(0);
  const calendar = useRef<HTMLDivElement>(null);
  const enhancedDate = new EnhancedDate(date);

  function $(i: number): number[] {
    return [...new Array(i)].map((...[, j]) => j + 1);
  }

  function moveLeft() {
    enhancedDate.moveLeft();

    update();
  }

  function moveRight() {
    enhancedDate.moveRight();

    update();
  }

  function update() {
    updateDate(
      +new Date(
        enhancedDate.getFullYear(),
        enhancedDate.getMonth(),
        enhancedDate.getMonth() === new Date().getMonth() ? new Date().getDate() : 1,
        enhancedDate.getHours(),
        enhancedDate.getMinutes()
      )
    );
  }

  function onUp(x: number) {
    const w: number = readElementWidth(calendar.current!) * 0.25;

    // left
    x > downX && x - downX > w && moveLeft();

    // right
    x < downX && downX - x > w && moveRight();
  }

  const DAYS_IN_CURRENT_MONTH = enhancedDate.daysInMonth(); // January 2022 has 31 days
  const DAYS_IN_PREVIOUS_MONTH = enhancedDate.daysInMonth(-1); // December 2021 has 31 days

  let FIRST_DAY_IN_CURRENT_MONTH = new Date(enhancedDate.getFullYear(), enhancedDate.getMonth()).getDay(); // Saturday (6)

  // Sunday from 0 to 7
  FIRST_DAY_IN_CURRENT_MONTH = FIRST_DAY_IN_CURRENT_MONTH === 0 ? 7 : FIRST_DAY_IN_CURRENT_MONTH;

  const BEFORE = $(DAYS_IN_PREVIOUS_MONTH).filter(i => i > DAYS_IN_PREVIOUS_MONTH - (FIRST_DAY_IN_CURRENT_MONTH - 1)); // 5 days before

  const MIN_DAYS = BEFORE.length + DAYS_IN_CURRENT_MONTH; // 36 days
  const ROWS = Math.ceil(MIN_DAYS / 7); // 6 rows
  const MAX_DAYS = ROWS * 7; // 42 days

  const AFTER = $(MAX_DAYS - MIN_DAYS); // 6 days after

  return (
    <div
      className="calendar"
      display="grid"
      fontSize="2"
      onMouseDown={e => updateDownX(e.clientX)}
      onMouseUp={e => onUp(e.clientX)}
      onTouchEnd={e => onUp(e.touches[0].clientX)}
      onTouchStart={e => updateDownX(e.touches[0].clientX)}
      p="2"
      ref={calendar}
      textAlign="center"
    >
      <div alignItems="center" className="calendar__header" display="flex" mB="2">
        <ChevronLeft onClick={() => moveLeft()} />
        <div mX="auto" onClick={() => updateDate(+new Date())}>
          {MONTHS[enhancedDate.getMonth()]} {enhancedDate.getFullYear()}
        </div>
        <ChevronRight onClick={() => moveRight()} />
      </div>
      {DAYS.map(day => (
        <div key={day} p="2">
          {day}
        </div>
      ))}
      {BEFORE.map(i => (
        <CalendarDay
          date={new EnhancedDate(enhancedDate).addMonths(-1)}
          i={i}
          isDifferentMonth
          key={i}
          updateDate={updateDate}
        />
      ))}
      {$(DAYS_IN_CURRENT_MONTH).map(i => (
        <CalendarDay date={enhancedDate} i={i} key={i} updateDate={updateDate} />
      ))}
      {AFTER.map(i => (
        <CalendarDay
          date={new EnhancedDate(enhancedDate).addMonths(1)}
          i={i}
          isDifferentMonth
          key={i}
          updateDate={updateDate}
        />
      ))}
    </div>
  );
}

export default Calendar;
