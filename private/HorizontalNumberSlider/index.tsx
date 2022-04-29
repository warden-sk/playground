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

  function availableWidth(): number {
    return readElementWidth(elementStorage.parent.current!) - readElementWidth(elementStorage.left.current!);
  }

  function calculate(which: 'left' | 'right'): [left: number, right: number] {
    const [translateX] = translate(which).read();

    /* (1/2) */ let calculated: number = (translateX / availableWidth()) * 100;

    /* (2/2) */ calculated = size[0] + (calculated / 100) * (size[1] - size[0]);

    const updatedStorage = updateStorageElement({ calculated: [translateX, +calculated.toFixed()] }, which);

    return [updatedStorage.left.calculated[1], updatedStorage.right.calculated[1]];
  }

  function moveTo(which: 'left' | 'right', x: number) {
    // >
    x = x > 0 ? x : 0;

    // <
    x = x < availableWidth() ? x : availableWidth();

    /* (1) */ translate(which).write(x, 0);

    /* (2) */ const calculated = calculate(which);

    /* (3) */ onMove?.(calculated);
  }

  function onMouseDown(which: 'left' | 'right') {
    return (event: React.MouseEvent | React.TouchEvent) => {
      const [currentTranslateX] = translate(which).read();
      const [mouseOffsetX] = readMouseOffset(event.nativeEvent);
      const [parentElementOffsetX] = readElementOffset(elementStorage.parent.current!);

      updateStorageElement({ isMouseDown: true, x: mouseOffsetX - parentElementOffsetX - currentTranslateX }, which);
    };
  }

  function translate(which: 'left' | 'right'): Translate {
    return new Translate(elementStorage[which].current!);
  }

  function updateStorageElement($: Partial<StorageElement>, which: 'left' | 'right'): Storage {
    const updatedStorage = {
      ...storage,
      [which]: { ...storage[which], ...$ },
    };

    updateStorage(updatedStorage);

    return updatedStorage;
  }

  React.useEffect(() => {
    const _1 = 62.5;

    const L = _1 - size[0]; // 37.5

    const R = size[1] - size[0]; // 75

    const _2 = L / R;

    const _3 = _2 * availableWidth();

    moveTo('left', _3);
  }, []);

  React.useEffect(() => {
    if (hasRightSlider) {
      translate('right').write(storage.right.calculated[0] === 0 ? availableWidth() : storage.right.calculated[0], 0);
    }
  }, [hasRightSlider]);

  React.useEffect(() => {
    /* (1) */
    function whichIsDown(): 'left' | 'right' {
      return storage.left.isMouseDown ? 'left' : storage.right.isMouseDown ? 'right' : 'left';
    }

    /* (2) */
    function onMouseMove(event: MouseEvent | TouchEvent) {
      const which = whichIsDown();

      if (storage[which].isMouseDown) {
        const [mouseOffsetX] = readMouseOffset(event);
        const [parentElementOffsetX] = readElementOffset(elementStorage.parent.current!);

        const translateX: number = mouseOffsetX - parentElementOffsetX - storage[which].x;

        moveTo(which, translateX);
      }
    }

    /* (3) */
    function onMouseUp() {
      const which = whichIsDown();

      if (storage[which].isMouseDown) {
        const updatedStorage = updateStorageElement({ isMouseDown: false }, which);

        onUp?.([updatedStorage.left.calculated[1], updatedStorage.right.calculated[1]]);
      }
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
