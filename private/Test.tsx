/*
 * Copyright 2022 Marek Kobida
 */

import './Test.css';

import React from 'react';
import Translate from './Translate';
import readElementOffset from './readElementOffset';
import readElementWidth from './readElementWidth';
import readMouse from './readMouse';

interface P {
  on: (whereToMove: [x: number, y: number]) => any;
}

function Tatiana({ on }: P) {
  let childElement: HTMLDivElement;
  let isMouseDown = false;
  let lastTranslateX = 0;

  // 🔴
  let _1 = 0;

  const translate = () => new Translate(childElement);

  // (1)
  function onMouseDown(event: React.MouseEvent<HTMLElement>) {
    childElement = event.target as HTMLDivElement;

    isMouseDown = true;
    [lastTranslateX] = translate().read();

    const [childElementMouseX] = readMouse(event);
    const [childElementOffsetX] = readElementOffset(childElement.parentElement);

    console.log(`childElementMouseX: ${childElementMouseX}\nchildElementOffsetX: ${childElementOffsetX}`);

    //   | väčšie číslo
    _1 = childElementMouseX - childElementOffsetX - lastTranslateX;
  }

  // (2)
  function onMouseMove(event: React.MouseEvent<HTMLElement>) {
    if (isMouseDown) {
      const parentElement = event.currentTarget as HTMLDivElement;

      const [parentElementMouseX] = readMouse(event);
      const [parentElementOffsetX] = readElementOffset(parentElement);

      console.log(`parentElementMouseX: ${parentElementMouseX}\nparentElementOffsetX: ${parentElementOffsetX}`);

      //              | väčšie číslo
      let x: number = parentElementMouseX - parentElementOffsetX - _1;

      // >
      x = x > 0 ? x : 0;

      // <
      const widthDifference = readElementWidth(parentElement) - readElementWidth(childElement);
      x = x < widthDifference ? x : widthDifference;

      translate().write(x, 0);

      on([x, 0]);
    }
  }

  // (3)
  function onMouseUp() {
    isMouseDown = false;
  }

  return { onMouseDown, onMouseMove, onMouseUp };
}

function Test({ on }: P) {
  const [tatiana, updateTatiana] = React.useState<ReturnType<typeof Tatiana>>();

  React.useEffect(() => {
    updateTatiana(Tatiana({ on }));
  }, []);

  if (typeof tatiana !== 'undefined')
    return (
      <div className="test" onMouseMove={tatiana.onMouseMove} onMouseUp={tatiana.onMouseUp}>
        <div className="test__left" onMouseDown={tatiana.onMouseDown}></div>
      </div>
    );
}

export default Test;
