/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import React from 'react';
import Translate from '../helpers/Translate';
import readElementOffset from '../helpers/readElementOffset';
import readElementWidth from '../helpers/readElementWidth';
import readMouseOffset from '../helpers/readMouseOffset';

interface P extends B<JSX.IntrinsicElements['div']> {
  hasRightSlider?: boolean;
  onMove?: (calculated: [left: number, right: number]) => void;
  onUp?: (calculated: [left: number, right: number]) => void;
  size: [from: number, to: number];
  value?: [left: number, right: number];
}

interface Storage {
  left: StorageElement;
  right: StorageElement;
}

interface StorageElement {
  calculated: [number, number];
  isMouseDown: boolean;
  x: number;
}

function HorizontalNumberSlider({ className, hasRightSlider, onMove, onUp, size, value, ...attributes }: P) {
  const [storage, updateStorage] = React.useState<Storage>({
    left: { calculated: [0, 0], isMouseDown: false, x: 0 },
    right: { calculated: [0, 0], isMouseDown: false, x: 0 },
  });

  const elementStorage = {
    left: React.useRef<HTMLDivElement>(null),
    parent: React.useRef<HTMLDivElement>(null),
    right: React.useRef<HTMLDivElement>(null),
  } as const;

  function availableWidth(): number {
    return readElementWidth(elementStorage.parent.current!) - readElementWidth(elementStorage.left.current!);
  }

  function calculate(which: 'left' | 'right'): [left: number, right: number] {
    const [translateX] = translate(which).read();

    const updatedStorage = updateStorageElement({ calculated: [translateX / availableWidth(), $$(translateX)] }, which);

    return [updatedStorage.left.calculated[1], updatedStorage.right.calculated[1]];
  }

  function moveTo(which: 'left' | 'right', x: number) {
    // >
    x = x > 0 ? x : 0;

    // <
    x = x < availableWidth() ? x : availableWidth();

    /* (1) */ translate(which).write(x);

    /* (2) */ const calculated = calculate(which);

    /* (3) */ onMove?.(calculated);
  }

  function onMouseDown(which: 'left' | 'right') {
    return (event: React.MouseEvent | React.TouchEvent) => {
      const [elementOffsetX] = readElementOffset(elementStorage.parent.current!);
      const [mouseOffsetX] = readMouseOffset(event.nativeEvent);
      const [translateX] = translate(which).read();

      updateStorageElement({ isMouseDown: true, x: mouseOffsetX - elementOffsetX - translateX }, which);
    };
  }

  function translate(which: 'left' | 'right'): Translate {
    return new Translate(elementStorage[which].current!);
  }

  function updateStorageElement(
    $: { [P in keyof StorageElement]?: StorageElement[P] },
    which: 'left' | 'right'
  ): Storage {
    const updatedStorage = { ...storage, [which]: { ...storage[which], ...$ } };

    updateStorage(updatedStorage);

    return updatedStorage;
  }

  function whichIsDown(): 'left' | 'right' {
    return storage.left.isMouseDown ? 'left' : storage.right.isMouseDown ? 'right' : 'left';
  }

  /**
   * (1)
   * od 25 do 100 je pohyblivá časť
   * 100 - 25 = 75 / 2 = 37.5 + 25 = 62.5 je "x"
   */
  function $(x: number): number {
    const _1 = x - size[0]; //       62.5 - 25 = 37.5

    const _2 = size[1] - size[0]; // 100  - 25 = 75

    const _3 = _1 / _2; //           37.5 / 75 = 0.5

    return _3 * availableWidth();
  }
  /**
   * (2)
   */
  function $$(x: number): number {
    const _1 = x / availableWidth();

    const _2 = size[0] + _1 * (size[1] - size[0]); // 25 + 0.5 * (100 - 25) = 62.5

    return +_2.toFixed();
  }

  React.useEffect(() => {
    value?.[0] && moveTo('left', $(value[0]));
  }, []);

  React.useEffect(() => {
    hasRightSlider && value?.[1] && moveTo('right', $(value[1]));
  }, [hasRightSlider]);

  React.useEffect(() => {
    function onMouseMove(event: MouseEvent | TouchEvent) {
      const which = whichIsDown();

      if (storage[which].isMouseDown) {
        const [elementOffsetX] = readElementOffset(elementStorage.parent.current!);
        const [mouseOffsetX] = readMouseOffset(event);

        moveTo(which, mouseOffsetX - elementOffsetX - storage[which].x);
      }
    }

    function onMouseUp() {
      const which = whichIsDown();

      if (storage[which].isMouseDown) {
        const updatedStorage = updateStorageElement({ isMouseDown: false }, which);

        onUp?.([updatedStorage.left.calculated[1], updatedStorage.right.calculated[1]]);
      }
    }

    function onTest() {
      moveTo('left', availableWidth() * storage.left.calculated[0]);

      hasRightSlider && moveTo('right', availableWidth() * storage.right.calculated[0]);
    }

    (['mousemove', 'touchmove'] as const).forEach(type => window.addEventListener(type, onMouseMove));
    (['mouseup', 'touchend'] as const).forEach(type => window.addEventListener(type, onMouseUp));

    window.addEventListener('resize', onTest);

    return () => {
      (['mousemove', 'touchmove'] as const).forEach(type => window.removeEventListener(type, onMouseMove));
      (['mouseup', 'touchend'] as const).forEach(type => window.removeEventListener(type, onMouseUp));

      window.removeEventListener('resize', onTest);
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
