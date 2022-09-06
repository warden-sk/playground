/*
 * Copyright 2022 Marek Kobida
 */

import './design.css';
import './index.css';

import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import HorizontalNumberSlider from './HorizontalNumberSlider';
import HorizontalSlider from './HorizontalSlider';

function A() {
  const [price, updatePrice] = useState<[number, number]>([0, 0]);

  function $(price: number): string {
    return price.toFixed();
  }

  return (
    <div mY="8">
      <h1 alignItems="center" display="flex" fontSize="6" mB="4" style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
        HorizontalNumberSlider
        <div fontSize="4" mL="auto">
          from {$(price[0])} to {$(price[1])}
        </div>
      </h1>
      <HorizontalNumberSlider onMove={updatePrice} size={[25, 100]} value={[43.75, 81.25]} />
    </div>
  );
}

function B({ length }: { length: number }) {
  return (
    <div mY="8">
      <h1 fontSize="6" mB="4">
        HorizontalSlider
      </h1>
      <HorizontalSlider alignItems="center" chevronSize={48} display="flex" hasPercentage mX="!2">
        {[...new Array(length)].map(() => (
          <a flex="none" href="https://google.sk" pX="2" width={['6/12', { '#': '4/12' }]}>
            <div
              alignItems="center"
              display="flex"
              justifyContent="center"
              style={{
                aspectRatio: '1/1.5',
                backgroundColor: 'hsl(0, 0%, 50%)',
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
      <A />
      <B length={6} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('client')!).render(<Client />);
