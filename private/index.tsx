/*
 * Copyright 2022 Marek Kobida
 */

import HorizontalNumberSlider from './HorizontalNumberSlider';
import React from 'react';
import ReactDOM from 'react-dom';

function Client() {
  const [price, updatePrice] = React.useState<number>(0);

  return (
    <div className="container" mX="auto" pX="4">
      <div mX="auto" width="6/12">
        <HorizontalNumberSlider mY="4" on={updatePrice} size={[25, 100]} />
        <div textAlign="center">{price.toFixed()} EUR</div>
      </div>
    </div>
  );
}

typeof window !== 'undefined' && ReactDOM.hydrate(<Client />, document.getElementById('client'));

export default <div id="client" />;
