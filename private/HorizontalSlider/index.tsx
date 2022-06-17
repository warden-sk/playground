/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import { ChevronLeft, ChevronRight } from '@warden-sk/icons';
import React, { useEffect, useRef, useState } from 'react';
import Percentage from './Percentage';
import Translate from '../helpers/Translate';
import inertia from './helpers/inertia';
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
  idOfInertia: number;
  isDown: boolean;
  isMoving: (isMoving: boolean) => void;
  lastTranslateX: number;
  percentage: number;
  setTranslateX: (x: number) => void;
  startTime: number;
  startX: number;
  translate: () => Translate;
  whereToGo: [number, number];
  width: number;
}

function HorizontalSlider({ chevronSize, children, hasPercentage, ...$ }: P) {
  const [chevron, updateChevron] = useState<[left: boolean, right: boolean]>([false, false]),
    childElement = useRef<HTMLDivElement>(null),
    parentElement = useRef<HTMLDivElement>(null),
    state = useRef<State>({
      idOfInertia: 0,
      isDown: false,
      isMoving: isMoving =>
        isMoving
          ? parentElement.current!.classList.add('t-moving')
          : parentElement.current!.classList.remove('t-moving'),
      lastTranslateX: 0,
      percentage: 0,
      setTranslateX,
      startTime: 0,
      startX: 0,
      translate: () => new Translate(childElement.current!),
      whereToGo: [0, 0],
      width: 0,
    });

  function setTranslateX(x: number) {
    x = x < 0 ? x : 0;
    x = x > state.current.width * -1 ? x : state.current.width * -1;

    state.current.translate().write(x);

    update(x);
  }

  function update(translateX: number) {
    updateChevron(() => [translateX !== 0, translateX !== state.current.width * -1]);
    updateState(state => ({ ...state, percentage: ((translateX * -1) / state.width) * 100 }));
  }

  function updateState(on: (state: State) => State) {
    state.current = on(state.current);
  }

  function updateWidth() {
    updateState(state => ({ ...state, width: childElement.current!.scrollWidth - childElement.current!.clientWidth }));
  }

  useEffect(() => {
    updateWidth();
  }, []);

  useEffect(() => {
    const onMouseDown2 = onMouseDown(() => state.current, updateState);
    const onMouseLeave2 = onMouseLeave(() => state.current, updateState);
    const onMouseMove2 = onMouseMove(() => state.current);
    const onMouseUp2 = onMouseUp(() => state.current, updateState);

    (['mousedown', 'touchstart'] as const).forEach(type => parentElement.current!.addEventListener(type, onMouseDown2));

    parentElement.current!.addEventListener('mouseleave', onMouseLeave2);

    (['mousemove', 'touchmove'] as const).forEach(type => parentElement.current!.addEventListener(type, onMouseMove2));

    (['mouseup', 'touchend'] as const).forEach(type => parentElement.current!.addEventListener(type, onMouseUp2));

    new ResizeObserver(() => {
      const [translateX] = state.current.translate().read();

      const percentage = ((translateX * -1) / state.current.width) * 100;

      updateWidth();

      setTranslateX((state.current.width / 100) * percentage * -1);
    }).observe(parentElement.current!);

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
        {chevron[0] && (
          <ChevronLeft
            className="t-chevron-left"
            onClick={() => {
              const [translateX] = state.current.translate().read();

              const whereToGo: [number, number] = [0, 0];
              whereToGo[0] = state.current.width * 0.25;
              whereToGo[1] = whereToGo[0];

              updateState(state => ({ ...state, lastTranslateX: translateX, whereToGo }));

              inertia(() => state.current, updateState)();
            }}
            size={chevronSize}
          />
        )}
        <div ref={parentElement} style={{ overflowX: 'hidden' }}>
          <div {...$} ref={childElement}>
            {children}
          </div>
        </div>
        {chevron[1] && (
          <ChevronRight
            className="t-chevron-right"
            onClick={() => {
              const [translateX] = state.current.translate().read();

              const whereToGo: [number, number] = [0, 0];
              whereToGo[0] = state.current.width * 0.25 * -1;
              whereToGo[1] = whereToGo[0];

              updateState(state => ({ ...state, lastTranslateX: translateX, whereToGo }));

              inertia(() => state.current, updateState)();
            }}
            size={chevronSize}
          />
        )}
      </div>
      {hasPercentage && <Percentage mT="4" percentage={state.current.percentage} />}
    </div>
  );
}

export default HorizontalSlider;
