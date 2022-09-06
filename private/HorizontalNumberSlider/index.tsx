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
  const leftElement = React.useRef<HTMLDivElement>(null);
  const parentElement = React.useRef<HTMLDivElement>(null);
  const rightElement = React.useRef<HTMLDivElement>(null);
  const storage = React.useRef<Storage>({
    left: { calculated: 0, isMouseDown: false, startX: 0 },
    right: { calculated: 0, isMouseDown: false, startX: 0 },
  });

  function availableWidth(): number {
    return readElementWidth(parentElement.current!) - readElementWidth(leftElement.current!);
  }

  function moveTo(which: 'left' | 'right', x: number, isFirstMove = false) {
    const enemy = which === 'left' ? rightElement : leftElement;

    let leftBorder = 0,
      rightBorder = availableWidth();

    if (!isFirstMove) {
      if (which === 'left') {
        leftBorder = 0;
        rightBorder = new Translate(enemy.current!).read()[0] - readElementWidth(enemy.current!);
      } else {
        leftBorder = new Translate(enemy.current!).read()[0] + readElementWidth(enemy.current!);
        rightBorder = availableWidth();
      }
    }

    // >
    x = x > leftBorder ? x : leftBorder;

    // <
    x = x < rightBorder ? x : rightBorder;

    /* (1) */ translate(which).write(x);

    /* (2) */ const updatedStorage = updateStorageElement({ calculated: $$(x) }, which);

    /* (3) */ onMove?.([updatedStorage.left.calculated, updatedStorage.right.calculated]);
  }

  function onMouseDown(which: 'left' | 'right') {
    return (event: React.MouseEvent | React.TouchEvent) => {
      const [elementOffsetX] = readElementOffset(parentElement.current!);
      const [mouseOffsetX] = readMouseOffset(event.nativeEvent);
      const [translateX] = translate(which).read();

      updateStorageElement({ isMouseDown: true, startX: mouseOffsetX - elementOffsetX - translateX }, which);
    };
  }

  function translate(which: 'left' | 'right'): Translate {
    return new Translate(which === 'left' ? leftElement.current! : rightElement.current!);
  }

  function updateStorageElement(
    storageElement: { [K in keyof Storage['left']]?: Storage['left'][K] },
    which: 'left' | 'right'
  ): Storage {
    storage.current = { ...storage.current, [which]: { ...storage.current[which], ...storageElement } };

    return storage.current;
  }

  /**
   * (1)
   */
  function $(x: number): number {
    console.log(x);

    const _1 = x - size[0]; //       81.25 - 25 = 56.25

    const _2 = size[1] - size[0]; // 100   - 25 = 75

    const _3 = _1 / _2; //           56.25 / 75 = 0.75

    return _3 * availableWidth();
  }

  /**
   * (2)
   */
  function $$(x: number): number {
    const _1 = size[0];

    const _2 = x / availableWidth();

    const _3 = size[1] - size[0];

    return _1 + _2 * _3;
  }

  React.useEffect(() => {
    moveTo('left', $(value[0]), true);
    moveTo('right', $(value[1]), true);
  }, []);

  React.useEffect(() => {
    function onMouseMove(event: MouseEvent | TouchEvent) {
      const which = whichIsDown();

      if (which && storage.current[which].isMouseDown) {
        const [elementOffsetX] = readElementOffset(parentElement.current!);
        const [mouseOffsetX] = readMouseOffset(event);

        moveTo(which, mouseOffsetX - elementOffsetX - storage.current[which].startX);
      }
    }

    function onMouseUp() {
      const which = whichIsDown();

      if (which && storage.current[which].isMouseDown) {
        const updatedStorage = updateStorageElement({ isMouseDown: false }, which);

        onUp?.([updatedStorage.left.calculated, updatedStorage.right.calculated]);
      }
    }

    function onTest() {
      moveTo('left', $(storage.current.left.calculated), true);
      moveTo('right', $(storage.current.right.calculated), true);
    }

    function whichIsDown(): 'left' | 'right' | undefined {
      return storage.current.left.isMouseDown ? 'left' : storage.current.right.isMouseDown ? 'right' : undefined;
    }

    (['mousemove', 'touchmove'] as const).forEach(type => window.addEventListener(type, onMouseMove));
    (['mouseup', 'touchend'] as const).forEach(type => window.addEventListener(type, onMouseUp));

    window.addEventListener('resize', onTest);

    return () => {
      (['mousemove', 'touchmove'] as const).forEach(type => window.removeEventListener(type, onMouseMove));
      (['mouseup', 'touchend'] as const).forEach(type => window.removeEventListener(type, onMouseUp));

      window.removeEventListener('resize', onTest);
    };
  }, []);

  return (
    <div {...attributes} className={[className, 'horizontal-number-slider']} ref={parentElement}>
      <div
        className="horizontal-number-slider__left"
        onMouseDown={onMouseDown('left')}
        onTouchStart={onMouseDown('left')}
        ref={leftElement}
      />
      <div
        className="horizontal-number-slider__right"
        onMouseDown={onMouseDown('right')}
        onTouchStart={onMouseDown('right')}
        ref={rightElement}
      />
    </div>
  );
}

export default HorizontalNumberSlider;
