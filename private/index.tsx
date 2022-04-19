/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import Game from './Game';
import HorizontalNumberSlider from './HorizontalNumberSlider';
import React from 'react';
import ReactDOM from 'react-dom/client';

function A() {
  const [price, updatePrice] = React.useState<[number, number]>([0, 0]);

  return (
    <div mY="8">
      <h1 alignItems="center" display="flex" fontSize="4" mB="4">
        HorizontalNumberSlider
        <div fontSize="2" mL="auto">
          {price[0].toFixed()} EUR
        </div>
      </h1>
      <HorizontalNumberSlider on={updatePrice} size={[25, 100]} />
    </div>
  );
}

function B() {
  const [price, updatePrice] = React.useState<[number, number]>([0, 0]);

  return (
    <div mY="8">
      <h1 alignItems="center" display="flex" fontSize="4" mB="4">
        HorizontalNumberSlider
        <div fontSize="2" mL="auto">
          {price[0].toFixed()}/{price[1].toFixed()} EUR
        </div>
      </h1>
      <HorizontalNumberSlider hasRight on={updatePrice} size={[25, 100]} />
    </div>
  );
}

function Client() {
  return (
    <div className="container" mX="auto" pX="4">
      <A />
      <B />
      <Game />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('client')!).render(<Client />);
