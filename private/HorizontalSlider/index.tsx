/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import { ChevronLeft, ChevronRight } from '@warden-sk/icons';
import React, { useEffect, useRef, useState } from 'react';
import Translate from '../helpers/Translate';
import onMouseDown from './helpers/onMouseDown';
import onMouseMove from './helpers/onMouseMove';
import onMouseUp from './helpers/onMouseUp';

interface P {
  chevronSize?: number;
  children?: React.ReactNode;
  hasPercentage?: boolean;
}

export interface State {
  childElement: HTMLDivElement;
  endInertia: () => void;
  endX: number;
  isDown: boolean;
  parentElement: HTMLDivElement;
  setTranslateX: (x: number) => void;
  startInertia: () => void;
  startTime: number;
  startX: number;
  velocityX: [number, number];
  width: number;
}

function HorizontalSlider({
  chevronSize,
  children,
  hasPercentage,
  ...$
}: EnhancedElement<JSX.IntrinsicElements['div']> & P) {
  const [chevron, updateChevron] = useState<[left: boolean, right: boolean]>([false, false]),
    childElement = useRef<HTMLDivElement>(null),
    parentElement = useRef<HTMLDivElement>(null),
    [percentage, updatePercentage] = useState<number>(0);

  useEffect(() => {
    const state: State = {
      childElement: childElement.current!,
      endInertia,
      endX: 0,
      isDown: false,
      parentElement: parentElement.current!,
      setTranslateX,
      startInertia,
      startTime: +new Date(),
      startX: 0,
      velocityX: [0, 0],
      width: childElement.current!.scrollWidth - childElement.current!.clientWidth,
    };

    function setTranslateX(x: number) {
      x = x < 0 ? x : 0;
      x = x > state.width * -1 ? x : state.width * -1;

      new Translate(state.childElement).write(x);

      update(x);
    }

    function update(translateX: number) {
      updatePercentage(((translateX * -1) / state.width) * 100);

      if (translateX === 0) {
        updateChevron(chevron => [false, chevron[1]]);
      } else {
        updateChevron(chevron => [true, chevron[1]]);
      }

      if (translateX === state.width * -1) {
        updateChevron(chevron => [chevron[0], false]);
      } else {
        updateChevron(chevron => [chevron[0], true]);
      }
    }

    function updateWidth() {
      const translate = new Translate(childElement.current!);

      const [translateX] = translate.read();

      const percentage = ((translateX * -1) / state.width) * 100;

      state.width = childElement.current!.scrollWidth - childElement.current!.clientWidth;

      state.setTranslateX((state.width / 100) * percentage * -1);
    }

    (['mousedown', 'touchstart'] as const).forEach(type =>
      state.parentElement.addEventListener(type, onMouseDown(state))
    );

    state.parentElement.addEventListener('mouseleave', () => {
      state.isDown = false;
      state.parentElement.classList.remove('t-moving');
    });

    (['mousemove', 'touchmove'] as const).forEach(type =>
      state.parentElement.addEventListener(type, onMouseMove(state))
    );

    (['mouseup', 'touchend'] as const).forEach(type => state.parentElement.addEventListener(type, onMouseUp(state)));

    /* Inertia */

    let idOfInertia: number;

    function endInertia() {
      cancelAnimationFrame(idOfInertia);

      const [translateX] = new Translate(state.childElement).read();

      state.endX = translateX;
    }

    function inertia() {
      const x = state.endX + (state.velocityX[0] - state.velocityX[1]);

      setTranslateX(x);

      state.velocityX[1] *= 0.875;

      if (Math.abs(state.velocityX[1]) > 0.5) {
        startInertia();
      }
    }

    function startInertia() {
      idOfInertia = requestAnimationFrame(inertia);
    }

    /* ResizeObserver */

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    resizeObserver.observe(state.parentElement);
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
      {hasPercentage && (
        <div className="t-percentage" mT="4">
          <div className="t-percentage__div" style={{ width: `${percentage}%` }} />
        </div>
      )}
    </div>
  );
}

export default HorizontalSlider;
