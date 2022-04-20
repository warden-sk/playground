/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import React from 'react';
import Translate from './Translate';
import readElementOffset from './readElementOffset';
import readElementWidth from './readElementWidth';
import readMouseOffset from './readMouseOffset';

interface P {
  hasRight?: boolean;
  on: (calculated: [left: number, right: number]) => void;
  size: [from: number, to: number];
}

interface Storage {
  left: StorageElement;
  right: StorageElement;
}

interface StorageElement {
  calculated: [before: number, after: number];
  isMouseDown: boolean;
  x: number;
}

function HorizontalNumberSlider({ className, hasRight, on, size, ...attributes }: B<JSX.IntrinsicElements['div']> & P) {
  const [storage, updateStorage] = React.useState<Storage>({
    left: {
      calculated: [0, size[0]],
      isMouseDown: false,
      x: 0,
    },
    right: {
      calculated: [0, size[1]],
      isMouseDown: false,
      x: 0,
    },
  });

  const elementStorage = {
    left: React.useRef<HTMLDivElement>(null),
    parent: React.useRef<HTMLDivElement>(null),
    right: React.useRef<HTMLDivElement>(null),
  } as const;

  const currentDirection = (): 'left' | 'right' =>
    storage.left.isMouseDown ? 'left' : storage.right.isMouseDown ? 'right' : 'right';

  const translate = (direction: 'left' | 'right' = currentDirection()) =>
    new Translate(elementStorage[direction].current!);

  // (1)
  function onMouseDown(direction: 'left' | 'right') {
    return (event: React.MouseEvent | React.TouchEvent) => {
      const [currentTranslateX] = translate(direction).read();
      const [mouseOffsetX] = readMouseOffset(event.nativeEvent);
      const [parentElementOffsetX] = readElementOffset(elementStorage.parent.current!);

      updateStorage({
        ...storage,
        [direction]: {
          ...storage[direction],
          isMouseDown: true,
          x: mouseOffsetX - parentElementOffsetX - currentTranslateX,
        },
      });
    };
  }

  React.useEffect(() => {
    on(size);
  }, []);

  React.useEffect(() => {
    if (hasRight) {
      const rightBorder =
        readElementWidth(elementStorage.parent.current!) - readElementWidth(elementStorage.right.current!);

      translate('right').write(storage.right.calculated[0] === 0 ? rightBorder : storage.right.calculated[0], 0);
    }
  }, [hasRight]);

  React.useEffect(() => {
    // (2)
    function onMouseMove(event: MouseEvent | TouchEvent) {
      if (storage[currentDirection()].isMouseDown) {
        const [mouseOffsetX] = readMouseOffset(event);
        const [parentElementOffsetX] = readElementOffset(elementStorage.parent.current!);

        let translateX: number = mouseOffsetX - parentElementOffsetX - storage[currentDirection()].x;

        // >
        translateX = translateX > 0 ? translateX : 0;

        // <
        const rightBorder =
          readElementWidth(elementStorage.parent.current!) -
          readElementWidth(elementStorage[currentDirection()].current!);

        translateX = translateX < rightBorder ? translateX : rightBorder;

        translate().write(translateX, 0);

        /**
         * Calculation
         */

        /* (1/2) */ let calculated: number = (translateX / rightBorder) * 100;

        /* (2/2) */ calculated = size[0] + (calculated / 100) * (size[1] - size[0]);

        const updatedStorage = {
          ...storage,
          [currentDirection()]: { ...storage[currentDirection()], calculated: [translateX, +calculated.toFixed()] },
        };

        updateStorage(updatedStorage);

        on([updatedStorage.left.calculated[1], updatedStorage.right.calculated[1]]);
      }
    }

    // (3)
    function onMouseUp() {
      updateStorage({
        ...storage,
        [currentDirection()]: { ...storage[currentDirection()], isMouseDown: false },
      });
    }

    (['mousemove', 'touchmove'] as const).forEach(type => window.addEventListener(type, onMouseMove));
    (['mouseup', 'touchend'] as const).forEach(type => window.addEventListener(type, onMouseUp));

    return () => {
      (['mousemove', 'touchmove'] as const).forEach(type => window.removeEventListener(type, onMouseMove));
      (['mouseup', 'touchend'] as const).forEach(type => window.removeEventListener(type, onMouseUp));
    };
  }, [storage]);

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
