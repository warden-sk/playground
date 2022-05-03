/*
 * Copyright 2022 Marek Kobida
 */

import './CalendarDay.css';

import React from 'react';

interface P extends B<JSX.IntrinsicElements['div']> {
  date: Date;
  i: number;
  isDifferentMonth?: boolean;
  updateDate: (date: number) => void;
}

function CalendarDay({ className, date, i, isDifferentMonth, updateDate, ...attributes }: P) {
  return (
    <div
      {...attributes}
      className={[
        className,
        'calendar__day',
        {
          'calendar__day_is-current': i === date.getDate() && !isDifferentMonth,
          'calendar__day_is-different-month': isDifferentMonth,
        },
      ]}
    >
      <div
        alignItems="center"
        className="calendar__day__i"
        display="flex"
        justifyContent="center"
        onClick={() => updateDate(date.setDate(i))}
      >
        {i}
      </div>
    </div>
  );
}

export default CalendarDay;
