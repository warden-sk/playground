/*
 * Copyright 2022 Marek Kobida
 */

import HorizontalNumberSlider from './HorizontalNumberSlider';
import React from 'react';
import ReactDOM from 'react-dom';

function Client() {
  const [price, updatePrice] = React.useState<number>(0);

  return (
    <div className="container" mX="auto" p="4">
      <HorizontalNumberSlider on={updatePrice} size={[25, 100]} step={25} />
      <div mT="4" textAlign="center">
        {price.toFixed()} EUR
      </div>
    </div>
  );
}

typeof window !== 'undefined' && ReactDOM.hydrate(<Client />, document.getElementById('client'));

export default <div id="client" />;
