/*
 * Copyright 2022 Marek Kobida
 */

import './Percentage.css';

import React from 'react';

interface P {
  percentage: number;
}

function Percentage({ percentage }: P) {
  return (
    <div className="t-percentage" mT="4">
      <div className="t-percentage__div" style={{ width: `${percentage}%` }} />
    </div>
  );
}

export default Percentage;
