/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import React from 'react';
import Translate from './Translate';
import readElementOffset from './readElementOffset';
import readElementWidth from './readElementWidth';
import readMouseCoordinates from './readMouseCoordinates';

interface P {
  hasRight?: boolean;
  on?: (calculated: [left: number, right: number]) => unknown;
  size: [from: number, to: number];
}

const _1 = {
  left: 0,
  right: 0,
};

const valStorageCaltulat = {
  left: 0,
  right: 0,
};

function HorizontalNumberSlider({ className, hasRight, on, size, ...attributes }: B<JSX.IntrinsicElements['div']> & P) {
  const [isMouseDown, updateIsMouseDown] = React.useState<{ left: boolean; right: boolean }>({
    left: false,
    right: false,
  });

  const elementStorage = {
    left: React.useRef<HTMLDivElement>(null),
    parent: React.useRef<HTMLDivElement>(null),
    right: React.useRef<HTMLDivElement>(null),
  } as const;

  const currentDirection = (): 'left' | 'right' => {
    return isMouseDown['left'] ? 'left' : isMouseDown['right'] ? 'right' : 'right';
  };

  const translate = (direction: 'left' | 'right' = currentDirection()) =>
    new Translate(elementStorage[direction].current!);

  // (1)
  function onMouseDown($: 'left' | 'right') {
    return (event: React.MouseEvent | React.TouchEvent) => {
      const [currentTranslateX] = translate($).read();

      updateIsMouseDown({ ...isMouseDown, [$]: true });

      const [mouseX] = readMouseCoordinates(event.nativeEvent);
      const [parentElementOffsetX] = readElementOffset(elementStorage.parent.current!);

      //      | väčšie číslo
      _1[$] = mouseX - parentElementOffsetX - currentTranslateX;
    };
  }

  // (2)
  function onMouseMove(event: MouseEvent | TouchEvent) {
    if (isMouseDown[currentDirection()]) {
      const [mouseX] = readMouseCoordinates(event);
      const [parentElementOffsetX] = readElementOffset(elementStorage.parent.current!);

      //              | väčšie číslo
      let x: number = mouseX - parentElementOffsetX - _1[currentDirection()];

      // >
      x = x > 0 ? x : 0;

      // <
      const rightBorder =
        readElementWidth(elementStorage.parent.current!) -
        readElementWidth(elementStorage[currentDirection()].current!);

      x = x < rightBorder ? x : rightBorder;

      translate().write(x, 0);

      /**
       * Calculation
       */

      /* (1) */ let calculated: number = (x / rightBorder) * 100;

      /* (2) */ calculated = size[0] + (calculated / 100) * (size[1] - size[0]);

      valStorageCaltulat[currentDirection()] = calculated;

      on?.([valStorageCaltulat.left, valStorageCaltulat.right]);
    }
  }

  // (3)
  function onMouseUp() {
    updateIsMouseDown({ ...isMouseDown, [currentDirection()]: false });
  }

  React.useEffect(() => {
    valStorageCaltulat.left = size[0];

    on?.(size);
  }, []);

  React.useEffect(() => {
    if (hasRight) {
      valStorageCaltulat.right = size[1];

      const rightBorder =
        readElementWidth(elementStorage.parent.current!) - readElementWidth(elementStorage['right'].current!);

      translate('right').write(rightBorder, 0);

      on?.([valStorageCaltulat.left, valStorageCaltulat.right]);
    }
  }, [hasRight]);

  React.useEffect(() => {
    (['mousemove', 'touchmove'] as const).forEach(type => window.addEventListener(type, onMouseMove));
    (['mouseup', 'touchend'] as const).forEach(type => window.addEventListener(type, onMouseUp));

    return () => {
      (['mousemove', 'touchmove'] as const).forEach(type => window.removeEventListener(type, onMouseMove));
      (['mouseup', 'touchend'] as const).forEach(type => window.removeEventListener(type, onMouseUp));
    };
  }, [isMouseDown]);

  return (
    <div {...attributes} className={[className, 'horizontal-number-slider']} ref={elementStorage.parent}>
      <div
        className="horizontal-number-slider__left"
        onMouseDown={onMouseDown('left')}
        onTouchStart={onMouseDown('left')}
        ref={elementStorage.left}
      />
      {hasRight && (
        <div
          className="horizontal-number-slider__right"
          onMouseDown={onMouseDown('right')}
          onTouchStart={onMouseDown('right')}
          ref={elementStorage.right}
        />
      )}
    </div>
  );
}

export default HorizontalNumberSlider;
