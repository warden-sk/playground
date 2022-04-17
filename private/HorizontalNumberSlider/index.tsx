/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import React from 'react';
import Translate from './Translate';
import readElementOffset from './readElementOffset';
import readElementWidth from './readElementWidth';
import readMouse from './readMouse';

interface P extends A {
  on?: (n: number) => unknown;
  size: [number, number];
  step?: number;
}

// 🔴
let _1 = 0;

function HorizontalNumberSlider({ className, on, size, ...attributes }: JSX.IntrinsicElements['div'] & P) {
  /* (1) */ const [isMouseDown, updateIsMouseDown] = React.useState<boolean>(false);

  const $isMouseDown = React.useRef(isMouseDown);
  const $updateIsMouseDown = (isMouseDown: boolean) => {
    $isMouseDown.current = isMouseDown;
    updateIsMouseDown(isMouseDown);
  };

  /* (2) */ const childElement = React.useRef<HTMLDivElement>();
  /* (3) */ const parentElement = React.useRef<HTMLDivElement>();

  /* (4) */ const translate = () => new Translate(childElement.current!);

  // (1)
  function onMouseDown(event: React.MouseEvent<HTMLElement>) {
    const [currentTranslateX] = translate().read();

    $updateIsMouseDown(true);

    const [elementMouseX] = readMouse(event as unknown as MouseEvent);
    const [elementOffsetX] = readElementOffset(parentElement.current!);

    //   | väčšie číslo
    _1 = elementMouseX - elementOffsetX - currentTranslateX;
  }

  // (2)
  function onMouseMove(event: MouseEvent) {
    if ($isMouseDown.current) {
      const [elementMouseX] = readMouse(event);
      const [elementOffsetX] = readElementOffset(parentElement.current!);

      //              | väčšie číslo
      let x: number = elementMouseX - elementOffsetX - _1;

      // >
      x = x > 0 ? x : 0;

      // <
      const widthDifference = readElementWidth(parentElement.current!) - readElementWidth(childElement.current!);
      x = x < widthDifference ? x : widthDifference;

      translate().write(x, 0);

      const _2: number = (x / widthDifference) * 100;

      const _3: number = size[0] + (_2 / 100) * (size[1] - size[0]);

      on?.(_3);
    }
  }

  // (3)
  function onMouseUp() {
    $updateIsMouseDown(false);
  }

  React.useEffect(() => {
    on?.(size[0]);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div {...attributes} className={[className, 'horizontal-number-slider']} ref={parentElement}>
      <div className="horizontal-number-slider__left" onMouseDown={onMouseDown} ref={childElement} />
    </div>
  );
}

export default HorizontalNumberSlider;
