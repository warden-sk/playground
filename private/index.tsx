/*
 * Copyright 2022 Marek Kobida
 */

import HorizontalNumberSlider from './HorizontalNumberSlider';
import React from 'react';
import ReactDOM from 'react-dom/client';

function Client() {
  const [price, updatePrice] = React.useState<number>(0);

  return (
    <div alignItems="center" className="test" display="flex" justifyContent="center">
      <div width="8/12">
        <HorizontalNumberSlider mY="2" on={updatePrice} size={[25, 100]} />
        <div textAlign="center">{price.toFixed()} EUR</div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('client')!).render(<Client />);
