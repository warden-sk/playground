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
  size: [from: number, to: number];
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
    size,
  });

  const elementStorage = {
    left: React.useRef<HTMLDivElement>(null),
    parent: React.useRef<HTMLDivElement>(null),
    right: React.useRef<HTMLDivElement>(null),
  } as const;

  function availableWidth(): number {
    return readElementWidth(elementStorage.parent.current!) - readElementWidth(elementStorage.left.current!);
  }

  async function moveTo(which: 'left' | 'right', x: number) {
    // >
    x = x > 0 ? x : 0;

    // <
    x = x < availableWidth() ? x : availableWidth();

    /* (1) */ translate(which).write(x);

    /* (2) */ const updatedStorage = await updateStorageElement({ calculated: [x / availableWidth(), $$(x)] }, which);

    /* (3) */ onMove?.([updatedStorage.left.calculated[1], updatedStorage.right.calculated[1]]);
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

  async function updateStorageElement(
    storageElement: { [P in keyof StorageElement]?: StorageElement[P] },
    which: 'left' | 'right'
  ): Promise<Storage> {
    return new Promise(l =>
      updateStorage(storage => {
        const updatedStorage = { ...storage, [which]: { ...storage[which], ...storageElement } };

        l(updatedStorage);

        return updatedStorage;
      })
    );
  }

  function whichIsDown(): 'left' | 'right' {
    return storage.left.isMouseDown ? 'left' : storage.right.isMouseDown ? 'right' : 'left';
  }

  /**
   * (1)
   */
  function $(x: number): number {
    // (x / (size[0] + size[1])) * availableWidth();

    const _1 = x - storage.size[0]; //               81.25 - 25 = 56.25

    const _2 = storage.size[1] - storage.size[0]; // 100   - 25 = 75

    const _3 = _1 / _2; //                           56.25 / 75 = 0.75

    return _3 * availableWidth();
  }
  /**
   * (2)
   */
  function $$(x: number): number {
    return +(storage.size[0] + (x / availableWidth()) * (storage.size[1] - storage.size[0])).toFixed();
  }

  React.useEffect(() => {
    storage.right.calculated[1] && moveTo('right', $(storage.right.calculated[1]));
  }, [hasRightSlider]);

  React.useEffect(() => {
    moveTo('left', $(value?.[0] ?? storage.size[0]));
    hasRightSlider && moveTo('right', $(value?.[1] ?? storage.size[1]));
  }, [value]);

  React.useEffect(() => {
    function onMouseMove(event: MouseEvent | TouchEvent) {
      const which = whichIsDown();

      if (storage[which].isMouseDown) {
        const [elementOffsetX] = readElementOffset(elementStorage.parent.current!);
        const [mouseOffsetX] = readMouseOffset(event);

        moveTo(which, mouseOffsetX - elementOffsetX - storage[which].x);
      }
    }

    async function onMouseUp() {
      const which = whichIsDown();

      if (storage[which].isMouseDown) {
        const updatedStorage = await updateStorageElement({ isMouseDown: false }, which);

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
