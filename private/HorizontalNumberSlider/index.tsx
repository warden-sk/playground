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

function HorizontalNumberSlider({ className, onMove, onUp, size: $size, value, ...attributes }: P) {
  const storage = React.useRef<Storage>({
      left: { calculated: 0, isMouseDown: false, startX: 0 },
      right: { calculated: 0, isMouseDown: false, startX: 0 },
    }),
    size = React.useRef<[from: number, to: number]>($size),
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

    const _1 = size.current[0];

    const _2 = x / availableWidth();

    const _3 = size.current[1] - size.current[0];

    const enhancedX = _1 + _2 * _3;

    /* (2) */ storage.current[which] = { ...storage.current[which], calculated: +enhancedX.toFixed(3) };

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

  function update() {
    moveTo('left', $(storage.current.left.calculated || value[0]), true);
    moveTo('right', $(storage.current.right.calculated || value[1]), true);
  }

  function $(x: number): number {
    const _1 = x - size.current[0]; // 81.25 - 25 = 56.25

    const _2 = size.current[1] - size.current[0]; // 100 - 25 = 75

    const _3 = _1 / _2; // 56.25 / 75 = 0.75

    return _3 * availableWidth();
  }

  const firstUpdate = React.useRef(true);
  React.useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;

      return;
    }

    size.current = $size;

    update();
  }, [$size]);

  React.useLayoutEffect(() => {
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
        storage.current[which] = { ...storage.current[which], isMouseDown: false, startX: 0 };

        onUp?.([storage.current.left.calculated, storage.current.right.calculated]);
      }
    }

    function whichIsDown(): keyof Storage | undefined {
      return storage.current.left.isMouseDown ? 'left' : storage.current.right.isMouseDown ? 'right' : undefined;
    }

    (['mousemove', 'touchmove'] as const).forEach(type => window.addEventListener(type, onMouseMove));
    (['mouseup', 'touchend'] as const).forEach(type => window.addEventListener(type, onMouseUp));

    window.addEventListener('resize', update);

    update();

    return () => {
      (['mousemove', 'touchmove'] as const).forEach(type => window.removeEventListener(type, onMouseMove));
      (['mouseup', 'touchend'] as const).forEach(type => window.removeEventListener(type, onMouseUp));

      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <>
      <table>
        {(['left', 'right'] as const).map(id => (
          <tr>
            <td fontWeight="600">{id}</td>
            {(['calculated', 'isMouseDown', 'startX'] as const).map(id2 => (
              <td>{storage.current[id][id2].toString()}</td>
            ))}
          </tr>
        ))}
        <tr>
          <td fontWeight="600">size</td>
          {size.current.map(id => (
            <td>{id}</td>
          ))}
        </tr>
      </table>
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
    </>
  );
}

export default HorizontalNumberSlider;
