/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import HorizontalNumberSlider from './HorizontalNumberSlider';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Test from './Test';

function Client() {
  const [price, updatePrice] = React.useState<number>(0);

  return (
    <div className="container" mX="auto">
      <div mY="8">
        <h1 fontSize="4" mB="4">
          Test
        </h1>
        <Test SIZE={72} display="flex" mX="!4">
          {[...new Array(12)].map(() => (
            <div flex="none" pX="4" width="4/12">
              <div className="filler" />
            </div>
          ))}
        </Test>
      </div>
      <div mY="8">
        <h1 fontSize="4" mB="4">
          HorizontalNumberSlider
        </h1>
        <HorizontalNumberSlider mY="4" on={updatePrice} size={[25, 100]} />
        <div textAlign="center">{price.toFixed()} EUR</div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('client')!).render(<Client />);
