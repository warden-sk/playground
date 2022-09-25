/*
 * Copyright 2022 Marek Kobida
 */

import './design.css';
import './index.css';

import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import HorizontalNumberSliderComponent from './HorizontalNumberSlider';
import HorizontalSliderComponent from './HorizontalSlider';

function HorizontalNumberSlider() {
  const [price, updatePrice] = useState<[number, number]>([43.75, 81.25]);
  const [size, updateSize] = useState<[number, number]>([25, 100]);

  return (
    <div mY="8">
      <h2 fontSize="8">HorizontalNumberSlider</h2>
      <div onClick={() => updateSize([0, 50])}>zmeniť veľkosť</div>
      <div display="flex" justifyContent="space-between">
        <div>
          od <span fontWeight="600">{price[0]} €</span>
        </div>
        <div>
          do <span fontWeight="600">{price[1]} €</span>
        </div>
      </div>
      <HorizontalNumberSliderComponent onMove={updatePrice} onUp={updatePrice} size={size} value={price} />
    </div>
  );
}

function HorizontalSlider({ length }: { length: number }) {
  return (
    <div mY="8">
      <h2 fontSize="8">HorizontalSlider</h2>
      <HorizontalSliderComponent alignItems="center" chevronSize={48} display="flex" hasPercentage mX="!2">
        {[...new Array(length)].map(($, i) => (
          <a flex="none" href={`#${i}`} pX="2" width={['6/12', { '#': '4/12' }]}>
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
      </HorizontalSliderComponent>
    </div>
  );
}

function Client() {
  return (
    <div className="container" mX="auto" pX="4">
      <h1 fontSize="8" mY="8">
        Playground
      </h1>
      <HorizontalNumberSlider />
      <HorizontalSlider length={6} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('client')!).render(<Client />);
