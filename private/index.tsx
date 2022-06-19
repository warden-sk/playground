/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import React, { useState } from 'react';
import HorizontalNumberSlider from './HorizontalNumberSlider';
import HorizontalSlider from './HorizontalSlider';
import ReactDOM from 'react-dom/client';

function A() {
  const [price, updatePrice] = useState<[number, number]>([0, 0]);
  const [value, updateValue] = useState<[number, number]>([43.75, 81.25]);

  return (
    <div mY="8">
      <h1 alignItems="center" display="flex" fontSize="6" mB="4" style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
        HorizontalNumberSlider
        <a fontSize="2" href="#" onClick={() => updateValue([0, 0])} pX="2">
          to start
        </a>
        <div fontSize="4" mL="auto">
          from {price[0]} to {price[1]}
        </div>
      </h1>
      <HorizontalNumberSlider onMove={updatePrice} size={[25, 100]} value={value} />
    </div>
  );
}

function B() {
  return (
    <div mY="8">
      <h1 fontSize="6" mB="4">
        HorizontalSlider
      </h1>
      <HorizontalSlider alignItems="center" chevronSize={48} display="flex" hasPercentage>
        {[...new Array(16)].map(() => (
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
            />
          </a>
        ))}
      </HorizontalSlider>
    </div>
  );
}

function Client() {
  return (
    <div className="container" mX="auto" pX="4">
      <h1 fontSize="8" mB="4">
        Playground
      </h1>
      <div fontSize="4" mB="8">
        Miesto, kde na mieru vytvárame a testujeme znovu použiteľné komponenty.
      </div>
      <A />
      <B />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('client')!).render(<Client />);
