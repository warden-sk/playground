/*
 * Copyright 2022 Marek Kobida
 */

import EnhancedDate from '../helpers/EnhancedDate';
import React from 'react';

interface P extends B<JSX.IntrinsicElements['div']> {
  date: number;
  i: number;
  test?: boolean;
  updateDate: (date: number) => void;
}

function CalendarDay({ className, date, i, test, updateDate, ...attributes }: P) {
  const enhancedDate = new EnhancedDate(date);

  return (
    <div
      {...attributes}
      className={[
        className,
        'calendar__day',
        {
          calendar__day_current: i === enhancedDate.getDate(),
          calendar__day_test: test,
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
