/*
 * Copyright 2023 Marek Kobida
 */

import './Percentage.css';

import React from 'react';

interface P extends EnhancedJSXElement<'div'> {
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
