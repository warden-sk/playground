/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import React from 'react';
import readElementOffset from '../helpers/readElementOffset';
import readElementWidth from '../helpers/readElementWidth';
import readMouseOffset from '../helpers/readMouseOffset';
import Translate from '../helpers/Translate';

interface P extends EnhancedElement<JSX.IntrinsicElements['div']> {
  onMove?: (calculated: [left: number, right: number]) => void;
  onUp?: (calculated: [left: number, right: number]) => void;
  size: [from: number, to: number];
  value: [left: number, right: number];
}

interface Storage {
  left: StorageElement;
  right: StorageElement;
}

interface StorageElement {
  calculated: number;
  isMouseDown: boolean;
  startX: number;
}

function HorizontalNumberSlider({ className, onMove, onUp, size, value, ...attributes }: P) {
  const storage = React.useRef<Storage>({
      left: { calculated: 0, isMouseDown: false, startX: 0 },
      right: { calculated: 0, isMouseDown: false, startX: 0 },
    }),
    elementStorage = {
      left: React.useRef<HTMLDivElement>(null),
      right: React.useRef<HTMLDivElement>(null),
    };

  function availableWidth(): number {
    const parentElement = elementStorage.left.current!.parentElement!;

    return readElementWidth(parentElement) - readElementWidth(elementStorage.left.current!);
  }

  function moveTo(which: keyof Storage, x: number, isFirstMove = false) {
    let leftBorder = 0,
      rightBorder = availableWidth();

    if (!isFirstMove) {
      if (which === 'left') {
        rightBorder =
          new Translate(elementStorage.right.current!).read()[0] - readElementWidth(elementStorage.right.current!);
      }

      if (which === 'right') {
        leftBorder =
          new Translate(elementStorage.left.current!).read()[0] + readElementWidth(elementStorage.left.current!);
      }
    }

    // >
    x = x > leftBorder ? x : leftBorder;

    // <
    x = x < rightBorder ? x : rightBorder;

    /* (1) */ new Translate(which === 'left' ? elementStorage.left.current! : elementStorage.right.current!).write(x);

    const _1 = size[0];

    const _2 = x / availableWidth();

    const _3 = size[1] - size[0];

    const enhancedX = _1 + _2 * _3;

    /* (2) */ storage.current[which] = { ...storage.current[which], calculated: enhancedX };

    /* (3) */ onMove?.([storage.current.left.calculated, storage.current.right.calculated]);
  }

  function onMouseDown(which: keyof Storage) {
    return (event: React.MouseEvent | React.TouchEvent) => {
      const element = which === 'left' ? elementStorage.left.current! : elementStorage.right.current!;

      const [elementOffsetX] = readElementOffset(element);
      const [mouseOffsetX] = readMouseOffset(event.nativeEvent);

      const startX = mouseOffsetX - elementOffsetX;

      storage.current[which] = { ...storage.current[which], isMouseDown: true, startX };
    };
  }

  /**
   * (1)
   */
  function $(x: number): number {
    const _1 = x - size[0]; //       81.25 - 25 = 56.25

    const _2 = size[1] - size[0]; // 100   - 25 = 75

    const _3 = _1 / _2; //           56.25 / 75 = 0.75

    return _3 * availableWidth();
  }

  React.useEffect(() => {
    function onMouseMove(event: MouseEvent | TouchEvent) {
      const which = whichIsDown();

      if (which && storage.current[which].isMouseDown) {
        const parentElement = elementStorage.left.current!.parentElement!;

        const [elementOffsetX] = readElementOffset(parentElement);
        const [mouseOffsetX] = readMouseOffset(event);

        moveTo(which, mouseOffsetX - elementOffsetX - storage.current[which].startX);
      }
    }

    function onMouseUp() {
      const which = whichIsDown();

      if (which && storage.current[which].isMouseDown) {
        storage.current[which] = { ...storage.current[which], isMouseDown: false };

        onUp?.([storage.current.left.calculated, storage.current.right.calculated]);
      }
    }

    function onTest() {
      moveTo('left', $(storage.current.left.calculated || value[0]), true);
      moveTo('right', $(storage.current.right.calculated || value[1]), true);
    }

    function whichIsDown(): keyof Storage | undefined {
      for (const l in storage.current) {
        const k = l as keyof Storage;

        const r = storage.current[k];

        if (r.isMouseDown) {
          return k;
        }
      }
    }

    (['mousemove', 'touchmove'] as const).forEach(type => window.addEventListener(type, onMouseMove));
    (['mouseup', 'touchend'] as const).forEach(type => window.addEventListener(type, onMouseUp));

    window.addEventListener('resize', onTest);

    onTest();

    return () => {
      (['mousemove', 'touchmove'] as const).forEach(type => window.removeEventListener(type, onMouseMove));
      (['mouseup', 'touchend'] as const).forEach(type => window.removeEventListener(type, onMouseUp));

      window.removeEventListener('resize', onTest);
    };
  }, []);

  return (
    <div {...attributes} className={[className, 'horizontal-number-slider']}>
      {(['left', 'right'] as const).map(id => (
        <div
          className="horizontal-number-slider__slider"
          key={id}
          onMouseDown={onMouseDown(id)}
          onTouchStart={onMouseDown(id)}
          ref={elementStorage[id]}
        />
      ))}
    </div>
  );
}

export default HorizontalNumberSlider;
