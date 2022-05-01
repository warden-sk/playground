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
      <h1 alignItems="center" display="flex" fontSize="4" mB="4" style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
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
        <div fontSize="2" mL="auto">
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
      <h1 fontSize="4" mB="4">
        HorizontalSlider
      </h1>
      <HorizontalSlider SIZE={48} alignItems="center" display="flex">
        {[...new Array(6)].map(() => (
          <div flex="none" pX="2" width={['6/12', { '#': '4/12' }]}>
            <div
              style={{
                backgroundColor: 'hsl(0, 0%, 25%)',
                borderRadius: '0.125rem',
                paddingBottom: '150%',
              }}
            />
          </div>
        ))}
      </HorizontalSlider>
    </div>
  );
}

function C() {
  const [date, updateDate] = useState<number>(+new Date());

  return (
    <div mY="8">
      <h1 fontSize="4" mB="4">
        Calendar
      </h1>
      <div mX="auto" width={['100', { '##': '6/12' }]}>
        <Calendar date={date} updateDate={updateDate} />
      </div>
    </div>
  );
}

function Client() {
  return (
    <div className="container" mX="auto" pX="4">
      <A />
      <B />
      <C />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('client')!).render(<Client />);
