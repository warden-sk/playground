/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import { ChevronLeft, ChevronRight } from '@warden-sk/icons';
import CalendarDay from './CalendarDay';
import EnhancedDate from '../helpers/EnhancedDate';
import React from 'react';
import readElementWidth from '../helpers/readElementWidth';

interface P extends B<JSX.IntrinsicElements['div']> {
  date: number;
  updateDate: (date: number) => void;
}

function Calendar({ date, updateDate }: P) {
  const calendar = React.useRef<HTMLDivElement>(null);
  const enhancedDate = new EnhancedDate(date);
  let lastPageX = 0;

  function $(i: number): number[] {
    return [...new Array(i)].map((...[, j]) => j + 1);
  }

  function moveLeft() {
    if (enhancedDate.getMonth() === 0) {
      enhancedDate.setFullYear(enhancedDate.getFullYear() - 1);
      enhancedDate.setMonth(11);
    } else {
      enhancedDate.addMonths(-1);
    }

    update();
  }

  function moveRight() {
    if (enhancedDate.getMonth() === 11) {
      enhancedDate.setFullYear(enhancedDate.getFullYear() + 1);
      enhancedDate.setMonth(0);
    } else {
      enhancedDate.addMonths(1);
    }

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
    // left
    if (lastPageX < x) {
      if (x - lastPageX > readElementWidth(calendar.current!) / 6) {
        moveLeft();
      }
    }

    // right
    if (x < lastPageX) {
      if (lastPageX - x > readElementWidth(calendar.current!) / 6) {
        moveRight();
      }
    }
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

  const DAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'] as const;

  const MONTHS = [
    'Január',
    'Február',
    'Marec',
    'Apríl',
    'Máj',
    'Jún',
    'Júl',
    'August',
    'September',
    'Október',
    'November',
    'December',
  ] as const;

  return (
    <div
      className="calendar"
      display="inline-grid"
      fontSize="-1"
      onMouseDown={e => (lastPageX = e.pageX)}
      onMouseUp={e => onUp(e.pageX)}
      onTouchEnd={e => onUp(e.touches[0].pageX)}
      onTouchStart={e => (lastPageX = e.touches[0].pageX)}
      p="4"
      ref={calendar}
      textAlign="center"
    >
      <div alignItems="center" display="flex" mB="2" style={{ gridColumn: '1/8' }}>
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
          date={+new EnhancedDate(enhancedDate).addMonths(-1)}
          i={i}
          isDifferentMonth
          key={i}
          updateDate={updateDate}
        />
      ))}
      {$(DAYS_IN_CURRENT_MONTH).map(i => (
        <CalendarDay date={+enhancedDate} i={i} key={i} updateDate={updateDate} />
      ))}
      {AFTER.map(i => (
        <CalendarDay
          date={+new EnhancedDate(enhancedDate).addMonths(1)}
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
