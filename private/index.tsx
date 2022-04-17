/*
 * Copyright 2022 Marek Kobida
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Test from './Test';

function Client() {
  const [[price], updatePrice] = React.useState<[x: number, y: number]>([0, 0]);

  return (
    <>
      <Test on={updatePrice} />
      <div className="price">{price} EUR</div>
    </>
  );
}

typeof window !== 'undefined' && ReactDOM.hydrate(<Client />, document.getElementById('client'));

export default <div id="client" />;
