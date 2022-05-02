/*
 * Copyright 2022 Marek Kobida
 */

import './CalendarDay.css';

import EnhancedDate from '../helpers/EnhancedDate';
import React from 'react';

interface P extends B<JSX.IntrinsicElements['div']> {
  date: number;
  i: number;
  isDifferentMonth?: boolean;
  updateDate: (date: number) => void;
}

function CalendarDay({ className, date, i, isDifferentMonth, updateDate, ...attributes }: P) {
  const enhancedDate = new EnhancedDate(date);

  return (
    <div
      {...attributes}
      className={[
        className,
        'calendar__day',
        {
          'calendar__day_is-current': i === enhancedDate.getDate(),
          'calendar__day_is-different-month': isDifferentMonth,
        },
      ]}
    >
      <div
        alignItems="center"
        className="calendar__day__i"
        display="flex"
        justifyContent="center"
        onClick={() => updateDate(enhancedDate.setDate(i))}
      >
        {i}
      </div>
    </div>
  );
}

export default CalendarDay;
