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

function CalendarDay({ date, i, test, updateDate }: P) {
  const enhancedDate = new EnhancedDate(date);

  return (
    <div
      className={['calendar__day', { calendar__day_current: i === enhancedDate.getDate(), calendar__day_test: test }]}
    >
      <div
        alignItems="center"
        display="flex"
        justifyContent="center"
        onClick={() => updateDate(enhancedDate.setDate(i))}
        style={{ height: '100%', position: 'absolute', width: '100%' }}
      >
        {i}
      </div>
    </div>
  );
}

export default CalendarDay;
