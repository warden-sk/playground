/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import { ChevronLeft, ChevronRight } from '@warden-sk/icons';
import CalendarDay from './CalendarDay';
import EnhancedDate from '../helpers/EnhancedDate';
import React from 'react';

interface P extends B<JSX.IntrinsicElements['div']> {
  date: number;
  updateDate: (date: number) => void;
}

let lastPageX = 0;

function Calendar({ date, updateDate }: P) {
  const enhancedDate = new EnhancedDate(date);

  function move(x: number) {
    const calendar = document.querySelector('.calendar')!;

    // left
    if (lastPageX < x) {
      if (x - lastPageX > calendar.clientWidth / 7) {
        moveLeft();
      }
    }

    // right
    if (x < lastPageX) {
      if (lastPageX - x > calendar.clientWidth / 7) {
        moveRight();
      }
    }
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

  function $(i: number): number[] {
    return [...new Array(i)].map((...[, j]) => j + 1);
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
      onMouseDown={e => (lastPageX = e.pageX)}
      onMouseUp={e => move(e.pageX)}
      onTouchEnd={e => move(e.touches[0].pageX)}
      onTouchStart={e => (lastPageX = e.touches[0].pageX)}
      pX="3"
      pY="6"
      textAlign="center"
    >
      <div alignItems="center" display="flex" fontSize="3" justifyContent="center" mB="6" style={{ gridColumn: '1/8' }}>
        <ChevronLeft onClick={() => moveLeft()} />
        <div mX="3" onClick={() => updateDate(+new Date())}>
          {enhancedDate.to('DDDD D. MMMM YYYY')}
        </div>
        <ChevronRight onClick={() => moveRight()} />
      </div>
      {['Pon', 'Uto', 'Str', 'Štv', 'Pia', 'Sob', 'Ned'].map(day => (
        <div key={day} mY="3">
          {day}
        </div>
      ))}
      {BEFORE.map(i => (
        <CalendarDay date={+new EnhancedDate(enhancedDate).addMonths(-1)} i={i} key={i} test updateDate={updateDate} />
      ))}
      {$(DAYS_IN_CURRENT_MONTH).map(i => (
        <CalendarDay date={+enhancedDate} i={i} key={i} updateDate={updateDate} />
      ))}
      {AFTER.map(i => (
        <CalendarDay date={+new EnhancedDate(enhancedDate).addMonths(1)} i={i} key={i} test updateDate={updateDate} />
      ))}
    </div>
  );
}

export default Calendar;
