/*
 * Copyright 2022 Marek Kobida
 */

import './CalendarDay.css';

import React from 'react';

interface P extends EnhancedJSXElement<'div'> {
  date: Date;
  i: number;
  isDifferentMonth?: boolean;
  updateDate: (date: number) => void;
}

function CalendarDay({ className, date, i, isDifferentMonth, updateDate, ...attributes }: P) {
  const isCurrent = i === date.getDate() && !isDifferentMonth;

  return (
    <div
      {...attributes}
      className={[
        className,
        'calendar__day',
        {
          'calendar__day_is-current': isCurrent,
          'calendar__day_is-different-month': isDifferentMonth,
        },
      ]}
    >
      <div
        alignItems="center"
        className="calendar__day__i"
        cursor="pointer"
        display="flex"
        fontWeight={isCurrent && '600'}
        justifyContent="center"
        onClick={() => updateDate(date.setDate(i))}
      >
        {i}
      </div>
    </div>
  );
}

export default CalendarDay;
