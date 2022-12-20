/*
 * Copyright 2023 Marek Kobida
 */

import './index.css';

import { Calendar } from '../index';
import HorizontalNumberSliderComponent from './HorizontalNumberSlider';
import HorizontalSliderComponent from './HorizontalSlider';
import React from 'react';

function HorizontalNumberSlider() {
  const [price, updatePrice] = React.useState<[number, number]>([43.75, 81.25]);
  const [size, updateSize] = React.useState<[number, number]>([25, 100]);

  return (
    <div mY="8">
      <h2 fontSize="8" mB="4">
        HorizontalNumberSlider
      </h2>
      <div onClick={() => updateSize([0, 50])}>zmeniť veľkosť</div>
      <div display="flex" justifyContent="space-between">
        <div>
          od <span fontWeight="600">{price[0]} €</span>
        </div>
        <div>
          do <span fontWeight="600">{price[1]} €</span>
        </div>
      </div>
      <HorizontalNumberSliderComponent
        onMove={updatePrice}
        onUp={updatePrice}
        size={size}
        test={[size]}
        value={price}
      />
    </div>
  );
}

function HorizontalSlider({ length }: { length: number }) {
  return (
    <div mY="8">
      <h2 fontSize="8" mB="4">
        HorizontalSlider
      </h2>
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

function Playground() {
  const [date, updateDate] = React.useState<number>(+new Date());

  return (
    <div id="playground">
      <div className="container" mX="auto" pX="4">
        <div mY="8">
          <h2 fontSize="8" mB="4">
            Calendar
          </h2>
          <div width="6/12">
            <Calendar date={date} updateDate={updateDate} />
          </div>
        </div>
        <HorizontalNumberSlider />
        <HorizontalSlider length={6} />
      </div>
    </div>
  );
}

export default Playground;
