/*
 * Copyright 2022 Marek Kobida
 */

import './Percentage.css';

import React from 'react';

interface P extends EnhancedElement<JSX.IntrinsicElements['div']> {
  percentage: number;
}

function Percentage({ className, percentage, ...$ }: P) {
  return (
    <div {...$} className={[className, 't-percentage']}>
      <div height="100" style={{ width: `${percentage}%` }} />
    </div>
  );
}

export default Percentage;
