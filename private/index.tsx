/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import HorizontalNumberSlider from './HorizontalNumberSlider';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Test from './Test';

function Client() {
  const [hasRight, updateHasRight] = React.useState<boolean>(false);
  const [price, updatePrice] = React.useState<[number, number]>([0, 0]);

  return (
    <div className="container" mX="auto" pX="4">
      <div mY="8">
        <h1 fontSize="4" mB="4">
          Test
        </h1>
        <div mX="!2">
          <Test SIZE={72} display="flex">
            {[...new Array(12)].map(() => (
              <div flex="none" pX="2" width="4/12">
                <div className="filler" />
              </div>
            ))}
          </Test>
        </div>
      </div>
      <div mY="8">
        <h1 alignItems="baseline" display="flex" fontSize="4" mB="4" style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
          HorizontalNumberSlider
          <div
            className={['variable', { variable_active: hasRight }]}
            fontSize="1"
            mX="4"
            onClick={() => updateHasRight(!hasRight)}
            pX="2"
          >
            hasRight
          </div>
          <div fontSize="2" mL="auto">
            {hasRight ? `od ${price[0].toFixed()} do ${price[1].toFixed()}` : `od ${price[0].toFixed()}`} EUR
          </div>
        </h1>
        <HorizontalNumberSlider hasRight={hasRight} on={updatePrice} size={[25, 100]} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('client')!).render(<Client />);
