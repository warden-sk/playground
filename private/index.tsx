/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import React, { useState } from 'react';
import Calendar from './Calendar';
import { ChevronLeft } from '@warden-sk/icons';
import HorizontalNumberSlider from './HorizontalNumberSlider';
import HorizontalSlider from './HorizontalSlider';
import ReactDOM from 'react-dom/client';

function A() {
  const [hasRightSlider, updateHasRightSlider] = useState<boolean>(true);
  const [price, updatePrice] = useState<[number, number]>([0, 0]);
  const [value, updateValue] = useState<[number, number]>([43.75, 81.25]);

  return (
    <div mY="8">
      <h1 alignItems="center" display="flex" fontSize="6" mB="4" style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
        HorizontalNumberSlider
        <div display="flex">
          <div
            className={['variable', { variable_active: hasRightSlider }]}
            fontSize="1"
            mX="2"
            mY="auto"
            onClick={() => updateHasRightSlider(!hasRightSlider)}
            pX="2"
          >
            hasRightSlider
          </div>
          <div
            alignItems="center"
            className="variable"
            display="flex"
            fontSize="1"
            mX="2"
            onClick={() => updateValue([0, 0])}
            pX="2"
          >
            <ChevronLeft />
          </div>
        </div>
        <div fontSize="4" mL="auto">
          {hasRightSlider ? `from ${price[0]} to ${price[1]}` : `from ${price[0]}`} EUR
        </div>
      </h1>
      <HorizontalNumberSlider hasRightSlider={hasRightSlider} onMove={updatePrice} size={[25, 100]} value={value} />
    </div>
  );
}

function B() {
  return (
    <div mY="8">
      <HorizontalSlider alignItems="center" chevronSize={48} display="flex" hasPercentage isDevelopment>
        {[...new Array(16)].map(($, i) => (
          <a flex="none" href="https://google.sk" pX="2" width={['6/12', { '#': '4/12' }]}>
            <div
              alignItems="center"
              display="flex"
              justifyContent="center"
              style={{
                aspectRatio: '1/1.5',
                backgroundColor: 'hsl(0, 0%, 25%)',
                borderRadius: '0.125rem',
                boxShadow: '0 0 0.5rem rgba(0, 0, 0, 0.25)',
              }}
            >
              {i + 1}
            </div>
          </a>
        ))}
      </HorizontalSlider>
    </div>
  );
}

function C() {
  const [date, updateDate] = useState<number>(+new Date());

  return (
    <div mY="8">
      <h1 fontSize="6" mB="4">
        Calendar
      </h1>
      <Calendar date={date} updateDate={updateDate} />
    </div>
  );
}

function Client() {
  return (
    <div className="container" mX="auto" pX="4">
      <B />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('client')!).render(<Client />);
