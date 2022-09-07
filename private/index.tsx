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

  return (
    <div mY="8">
      <h1 fontSize="8">HorizontalNumberSlider</h1>
      <div display="flex" justifyContent="space-between" mY="4">
        <div>
          od <span fontWeight="600">{price[0]} €</span>
        </div>
        <div>
          do <span fontWeight="600">{price[1]} €</span>
        </div>
      </div>
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
      {/* <B length={6} /> */}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('client')!).render(<Client />);
