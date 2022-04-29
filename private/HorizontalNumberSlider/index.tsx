/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import React from 'react';
import Translate from '../helpers/Translate';
import readElementOffset from '../helpers/readElementOffset';
import readElementWidth from '../helpers/readElementWidth';
import readMouseOffset from '../helpers/readMouseOffset';

interface P {
  hasRightSlider?: boolean;
  onMove?: (calculated: [left: number, right: number]) => void;
  onUp?: (calculated: [left: number, right: number]) => void;
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

function HorizontalNumberSlider({
  className,
  hasRightSlider,
  onMove,
  onUp,
  size,
  ...attributes
}: B<JSX.IntrinsicElements['div']> & P) {
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

  function calculation(): [number, number] {
    const direction = currentDirection();

    const [translateX] = new Translate(elementStorage[direction].current!).read();

    /* (1/2) */ let calculated: number = (translateX / readRightBorder()) * 100;

    /* (2/2) */ calculated = size[0] + (calculated / 100) * (size[1] - size[0]);

    const updatedStorage = {
      ...storage,
      [direction]: { ...storage[direction], calculated: [translateX, +calculated.toFixed()] },
    };

    updateStorage(updatedStorage);

    return [updatedStorage.left.calculated[1], updatedStorage.right.calculated[1]];
  }

  function currentDirection(): 'left' | 'right' {
    return storage.left.isMouseDown ? 'left' : storage.right.isMouseDown ? 'right' : 'right';
  }

  function readRightBorder(): number {
    return (
      readElementWidth(elementStorage.parent.current!) - readElementWidth(elementStorage[currentDirection()].current!)
    );
  }

  function translate(direction: 'left' | 'right' = currentDirection()): Translate {
    return new Translate(elementStorage[direction].current!);
  }

  /* (1) */
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
    onMove?.(size);
  }, []);

  React.useEffect(() => {
    if (hasRightSlider) {
      const rightBorder =
        readElementWidth(elementStorage.parent.current!) - readElementWidth(elementStorage.right.current!);

      translate('right').write(storage.right.calculated[0] === 0 ? rightBorder : storage.right.calculated[0], 0);
    }
  }, [hasRightSlider]);

  React.useEffect(() => {
    /* (2) */
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

        /* (1) */ translate().write(translateX, 0);

        /* (2) */ onMove?.(calculation());
      }
    }

    /* (3) */
    function onMouseUp() {
      const updatedStorage = {
        ...storage,
        [currentDirection()]: { ...storage[currentDirection()], isMouseDown: false },
      };

      updateStorage(updatedStorage);

      onUp?.([updatedStorage.left.calculated[1], updatedStorage.right.calculated[1]]);
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
      {hasRightSlider && (
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
