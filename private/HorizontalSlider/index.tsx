/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import { ChevronLeft, ChevronRight } from '@warden-sk/icons';
import React, { useEffect, useRef, useState } from 'react';
import Percentage from './Percentage';
import Translate from '../helpers/Translate';
import onMouseDown from './helpers/onMouseDown';
import onMouseLeave from './helpers/onMouseLeave';
import onMouseMove from './helpers/onMouseMove';
import onMouseUp from './helpers/onMouseUp';

interface P extends EnhancedElement<JSX.IntrinsicElements['div']> {
  chevronSize?: number;
  children?: React.ReactNode;
  hasPercentage?: boolean;
}

export interface State {
  childElement: () => HTMLDivElement;
  endX: number;
  idOfInertia: number;
  isDown: boolean;
  parentElement: () => HTMLDivElement;
  percentage: number;
  setTranslateX: (x: number) => void;
  startTime: number;
  startX: number;
  velocityX: [number, number];
  width: number;
}

function HorizontalSlider({ chevronSize, children, hasPercentage, ...$ }: P) {
  const [chevron, updateChevron] = useState<[left: boolean, right: boolean]>([false, false]),
    childElement = useRef<HTMLDivElement>(null),
    parentElement = useRef<HTMLDivElement>(null),
    state = useRef<State>({
      childElement: () => childElement.current!,
      endX: 0,
      idOfInertia: 0,
      isDown: false,
      parentElement: () => parentElement.current!,
      percentage: 0,
      setTranslateX,
      startTime: 0,
      startX: 0,
      velocityX: [0, 0],
      width: 0,
    });

  function setTranslateX(x: number) {
    x = x < 0 ? x : 0;
    x = x > state.current.width * -1 ? x : state.current.width * -1;

    new Translate(state.current.childElement()).write(x);

    update(x);
  }

  function update(translateX: number) {
    updateState(state => ({ ...state, percentage: ((translateX * -1) / state.width) * 100 }));

    updateChevron(() => [translateX !== 0, translateX !== state.current.width * -1]);
  }

  function updateState(on: (state: State) => State) {
    state.current = on(state.current);
  }

  useEffect(() => {
    updateState(state => ({ ...state, width: state.childElement().scrollWidth - state.childElement().clientWidth }));

    update(0);
  }, []);

  useEffect(() => {
    const onMouseDown2 = onMouseDown(() => state.current, updateState);
    const onMouseLeave2 = onMouseLeave(() => state.current, updateState);
    const onMouseMove2 = onMouseMove(() => state.current, updateState);
    const onMouseUp2 = onMouseUp(() => state.current, updateState);

    (['mousedown', 'touchstart'] as const).forEach(type => parentElement.current!.addEventListener(type, onMouseDown2));

    parentElement.current!.addEventListener('mouseleave', onMouseLeave2);

    (['mousemove', 'touchmove'] as const).forEach(type => parentElement.current!.addEventListener(type, onMouseMove2));

    (['mouseup', 'touchend'] as const).forEach(type => parentElement.current!.addEventListener(type, onMouseUp2));

    function updateWidth() {
      const translate = new Translate(childElement.current!);

      const [translateX] = translate.read();

      const percentage = ((translateX * -1) / state.current.width) * 100;

      updateState(state => ({ ...state, width: state.childElement().scrollWidth - state.childElement().clientWidth }));

      setTranslateX((state.current.width / 100) * percentage * -1);
    }

    new ResizeObserver(updateWidth).observe(parentElement.current!);

    return () => {
      (['mousedown', 'touchstart'] as const).forEach(type =>
        parentElement.current!.removeEventListener(type, onMouseDown2)
      );

      parentElement.current!.removeEventListener('mouseleave', onMouseLeave2);

      (['mousemove', 'touchmove'] as const).forEach(type =>
        parentElement.current!.removeEventListener(type, onMouseMove2)
      );

      (['mouseup', 'touchend'] as const).forEach(type => parentElement.current!.removeEventListener(type, onMouseUp2));
    };
  }, [children]);

  return (
    <div>
      <div className="t">
        {chevron[0] && <ChevronLeft className="t-chevron-left" size={chevronSize} />}
        <div ref={parentElement} style={{ overflowX: 'hidden' }}>
          <div {...$} ref={childElement}>
            {children}
          </div>
        </div>
        {chevron[1] && <ChevronRight className="t-chevron-right" size={chevronSize} />}
      </div>
      {hasPercentage && <Percentage percentage={state.current.percentage} />}
    </div>
  );
}

export default HorizontalSlider;
