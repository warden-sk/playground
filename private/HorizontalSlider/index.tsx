/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import { ChevronLeft, ChevronRight } from '@warden-sk/icons';
import React, { useEffect, useRef, useState } from 'react';
import test, { O } from './test';

interface P {
  SIZE?: number;
  VELOCITY?: number;
  children?: React.ReactNode;
}

function HorizontalSlider({ SIZE, VELOCITY = 0.75, children, ..._1 }: B<JSX.IntrinsicElements['div']> & P) {
  const [isLeft, updateIsLeft] = useState<boolean>(false);
  const [isRight, updateIsRight] = useState<boolean>(false);
  const [o, updateO] = useState<O>();
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const oo = test({ ELEMENT: element.current!, IS_LEFT: updateIsLeft, IS_RIGHT: updateIsRight, VELOCITY });

    updateO(oo);

    /* (1) */ oo.updateSize();
    /* (2) */ oo.update();

    window.addEventListener('resize', () => {
      /* (1) */ oo.updateSize();
      /* (2) */ oo.update();
    });
  }, []);

  useEffect(() => {
    /* (1) */ o?.updateSize();
    /* (2) */ o?.update();
  }, [children]);

  return (
    <div className="t">
      {isLeft && <ChevronLeft className="t-chevron-left" size={SIZE} />}
      <div style={{ overflow: 'hidden' }}>
        <div {..._1} ref={element}>
          {children}
        </div>
      </div>
      {isRight && <ChevronRight className="t-chevron-right" size={SIZE} />}
    </div>
  );
}

export default HorizontalSlider;
