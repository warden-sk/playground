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

interface P {
  chevronSize?: number;
  children?: React.ReactNode;
  hasPercentage?: boolean;
  isDevelopment?: boolean;
}

export interface State {
  childElement: () => HTMLDivElement;
  endX: number;
  isDown: boolean;
  parentElement: () => HTMLDivElement;
  percentage: number;
  setTranslateX: (state: State, x: number) => void;
  startTime: number;
  startX: number;
  velocityX: number;
  width: number;
}

function HorizontalSlider({
  chevronSize,
  children,
  hasPercentage,
  isDevelopment,
  ...$
}: EnhancedElement<JSX.IntrinsicElements['div']> & P) {
  const [chevron, updateChevron] = useState<[left: boolean, right: boolean]>([false, false]),
    [state, updateState] = useState<State>({
      childElement: () => childElement.current!,
      endX: 0,
      isDown: false,
      parentElement: () => parentElement.current!,
      percentage: 0,
      setTranslateX,
      startTime: 0,
      startX: 0,
      velocityX: 0,
      width: 0,
    }),
    childElement = useRef<HTMLDivElement>(null),
    parentElement = useRef<HTMLDivElement>(null);

  const onMouseDown2 = onMouseDown(state, updateState);
  const onMouseLeave2 = onMouseLeave(state, updateState);
  const onMouseMove2 = onMouseMove(state, updateState);
  const onMouseUp2 = onMouseUp(state, updateState);

  function setTranslateX(state: State, x: number) {
    x = x < 0 ? x : 0;
    x = x > state.width * -1 ? x : state.width * -1;

    new Translate(state.childElement()).write(x);

    update(x);
  }

  function update(translateX: number) {
    updateState(state => ({ ...state, percentage: ((translateX * -1) / state.width) * 100 }));

    updateChevron(() => [translateX !== 0, translateX !== state.width * -1]);
  }

  useEffect(() => {
    updateState(state => ({ ...state, width: state.childElement().scrollWidth - state.childElement().clientWidth }));
  }, []);

  useEffect(() => {
    state.width && update(0);
  }, [state.width]);

  useEffect(() => {
    let $$ = 0;
    let idOfInertia = 0;

    /* (1) */
    if (state.isDown) {
      cancelAnimationFrame(idOfInertia);

      const [translateX] = new Translate(state.childElement()).read();

      updateState(state => ({ ...state, endX: translateX }));
    }

    /* (2) */
    if (!state.isDown && state.startTime) {
      function inertia() {
        const x = state.endX + (state.velocityX - $$);

        setTranslateX(state, x);

        $$ *= 0.75;

        if (Math.abs($$) > 0.5) {
          idOfInertia = requestAnimationFrame(inertia);
        }
      }

      function startInertia() {
        $$ = state.velocityX;

        idOfInertia = requestAnimationFrame(inertia);
      }

      const endTime = +new Date();

      if (endTime - state.startTime < 375) {
        startInertia();
      }
    }
  }, [state.isDown]);

  useEffect(() => {
    (['mousedown', 'touchstart'] as const).forEach(type => state.parentElement().addEventListener(type, onMouseDown2));

    state.parentElement().addEventListener('mouseleave', onMouseLeave2);

    (['mousemove', 'touchmove'] as const).forEach(type => state.parentElement().addEventListener(type, onMouseMove2));

    (['mouseup', 'touchend'] as const).forEach(type => state.parentElement().addEventListener(type, onMouseUp2));

    return () => {
      (['mousedown', 'touchstart'] as const).forEach(type =>
        state.parentElement().removeEventListener(type, onMouseDown2)
      );

      state.parentElement().removeEventListener('mouseleave', onMouseLeave2);

      (['mousemove', 'touchmove'] as const).forEach(type =>
        state.parentElement().removeEventListener(type, onMouseMove2)
      );

      (['mouseup', 'touchend'] as const).forEach(type => state.parentElement().removeEventListener(type, onMouseUp2));
    };
  }, [children, state.endX, state.isDown, state.startX]);

  return (
    <div>
      {isDevelopment && (
        <div display="flex" flexWrap="wrap" justifyContent="center" p="1">
          {[
            ['endX', `${state.endX}px`],
            ['isDown', state.isDown.toString()],
            ['percentage', `${state.percentage}%`],
            ['startX', `${state.startX}px`],
          ].map(([left, right]) => (
            <div p="1">
              <div className="t-development" fontSize="1" pX="1">
                {left} · {right}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="t">
        {chevron[0] && <ChevronLeft className="t-chevron-left" size={chevronSize} />}
        <div ref={parentElement} style={{ overflowX: 'hidden' }}>
          <div {...$} ref={childElement}>
            {children}
          </div>
        </div>
        {chevron[1] && <ChevronRight className="t-chevron-right" size={chevronSize} />}
      </div>
      {hasPercentage && <Percentage percentage={state.percentage} />}
    </div>
  );
}

export default HorizontalSlider;
