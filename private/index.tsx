/*
 * Copyright 2022 Marek Kobida
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Test from './Test';

function Client() {
  const [price, updatePrice] = React.useState<number>(0);

  return (
    <>
      <Test on={updatePrice} size={[25, 100]} step={25} />
      <div className="price">{price.toFixed()} EUR</div>
    </>
  );
}

typeof window !== 'undefined' && ReactDOM.hydrate(<Client />, document.getElementById('client'));

export default <div id="client" />;
