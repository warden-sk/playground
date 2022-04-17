/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import React from 'react';
import Translate from './Translate';
import readElementOffset from './readElementOffset';
import readElementWidth from './readElementWidth';
import readMouse from './readMouse';

interface P {
  on: (whereToMove: [x: number, y: number]) => unknown;
}

// 🔴
let _1 = 0;

function Test({ on }: P) {
  /* (1) */ const [isMouseDown, updateIsMouseDown] = React.useState<boolean>(false);
  /* (2) */ const childElement = React.useRef<HTMLDivElement>();
  /* (3) */ const translate = () => new Translate(childElement.current);

  // (1)
  function onMouseDown(event: React.MouseEvent<HTMLElement>) {
    const element = event.target as HTMLDivElement;

    const [currentTranslateX] = translate().read();

    updateIsMouseDown(true);

    const [elementMouseX] = readMouse(event);
    const [elementOffsetX] = readElementOffset(element.parentElement);

    //   | väčšie číslo
    _1 = elementMouseX - elementOffsetX - currentTranslateX;

    console.log(`_1: ${_1}\nelementMouseX: ${elementMouseX}\nelementOffsetX: ${elementOffsetX}`);
  }

  // (2)
  function onMouseMove(event: React.MouseEvent<HTMLElement>) {
    if (isMouseDown) {
      const element = event.currentTarget as HTMLDivElement;

      const [elementMouseX] = readMouse(event);
      const [elementOffsetX] = readElementOffset(element);

      console.log(`elementMouseX: ${elementMouseX}\nelementOffsetX: ${elementOffsetX}`);

      //              | väčšie číslo
      let x: number = elementMouseX - elementOffsetX - _1;

      // >
      x = x > 0 ? x : 0;

      // <
      const widthDifference = readElementWidth(element) - readElementWidth(childElement.current);
      x = x < widthDifference ? x : widthDifference;

      translate().write(x, 0);

      on([x, 0]);
    }
  }

  // (3)
  function onMouseUp() {
    updateIsMouseDown(false);
  }

  return (
    <div className="test" onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
      <div className="test__left" onMouseDown={onMouseDown} ref={childElement}></div>
    </div>
  );
}

export default Test;
