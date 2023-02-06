/*
 * Copyright 2023 Marek Kobida
 */

import './index.css';

import React from 'react';
import Translate from '../helpers/Translate';
import readElementOffset from '../helpers/readElementOffset';
import readElementWidth from '../helpers/readElementWidth';
import readMouseOffset from '../helpers/readMouseOffset';

interface P extends EnhancedJSXElement<'div'> {
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

function HorizontalNumberSlider({ onMove, onUp, size, value, ...$ }: P) {
  const elementStorage = {
    left: React.useRef<HTMLDivElement>(null),
    parent: React.useRef<HTMLDivElement>(null),
    right: React.useRef<HTMLDivElement>(null),
  };

  const leftElement = () => elementStorage.left.current!;
  const parentElement = () => elementStorage.parent.current!;
  const rightElement = () => elementStorage.right.current!;

  //--------------------------------------------------------------------------------------------------------------------

  const storage = React.useRef<Storage>({
    left: { calculated: 0, isMouseDown: false, startX: 0 },
    right: { calculated: 0, isMouseDown: false, startX: 0 },
  });

  function availableWidth(): number {
    return readElementWidth(parentElement()) - readElementWidth(leftElement());
  }

  function moveTo(which: 'left' | 'right', x: number, isFirstMove = false) {
    let leftBorder = 0,
      rightBorder = availableWidth();

    if (!isFirstMove) {
      if (which === 'left') {
        rightBorder = new Translate(rightElement()).read().x - readElementWidth(rightElement());
      }

      if (which === 'right') {
        leftBorder = new Translate(leftElement()).read().x + readElementWidth(leftElement());
      }
    }

    // >
    x = x > leftBorder ? x : leftBorder;

    // <
    x = x < rightBorder ? x : rightBorder;

    /* (1) */ new Translate(which === 'left' ? leftElement() : rightElement()).write(x);

    const _1 = size[0];

    const _2 = x / availableWidth();

    const _3 = size[1] - size[0];

    const enhancedX = _1 + _2 * _3;

    /* (2) */ storage.current[which] = {
      ...storage.current[which],
      calculated: +enhancedX.toFixed(3),
    };

    /* (3) */ onMove?.([storage.current.left.calculated, storage.current.right.calculated]);
  }

  function onMouseDown(which: 'left' | 'right') {
    return (event: React.MouseEvent | React.TouchEvent) => {
      const element = which === 'left' ? leftElement() : rightElement();

      const [elementOffsetX] = readElementOffset(element);
      const [mouseOffsetX] = readMouseOffset(event.nativeEvent);

      const startX = mouseOffsetX - elementOffsetX;

      storage.current[which] = { ...storage.current[which], isMouseDown: true, startX };
    };
  }

  function update(value: [left: number, right: number]) {
    // console.log('HorizontalNumberSlider \u2014 update', storage, value);

    function fromCalculated(x: number): number {
      const _1 = x - size[0]; // 81.25 - 25 = 56.25

      const _2 = size[1] - size[0]; // 100 - 25 = 75

      const _3 = _1 / _2; // 56.25 / 75 = 0.75

      return _3 * availableWidth();
    }

    moveTo('left', fromCalculated(value[0]), true);
    moveTo('right', fromCalculated(value[1]), true);
  }

  React.useLayoutEffect(() => {
    // console.log('HorizontalNumberSlider \u2014 start', size);

    function onMouseMove(event: MouseEvent | TouchEvent) {
      const which = whichIsDown();

      if (which && storage.current[which].isMouseDown) {
        const [elementOffsetX] = readElementOffset(parentElement());
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

    function whichIsDown(): 'left' | 'right' | undefined {
      return storage.current.left.isMouseDown ? 'left' : storage.current.right.isMouseDown ? 'right' : undefined;
    }

    (['mousemove', 'touchmove'] as const).forEach(type => window.addEventListener(type, onMouseMove));
    (['mouseup', 'touchend'] as const).forEach(type => window.addEventListener(type, onMouseUp));

    //------------------------------------------------------------------------------------------------------------------

    return () => {
      // console.log('HorizontalNumberSlider \u2014 end', size);

      (['mousemove', 'touchmove'] as const).forEach(type => window.removeEventListener(type, onMouseMove));
      (['mouseup', 'touchend'] as const).forEach(type => window.removeEventListener(type, onMouseUp));
    };
  }, [JSON.stringify(size), onUp]);

  React.useLayoutEffect(() => {
    function onResize() {
      update(value);
    }

    window.addEventListener('resize', onResize);

    update(value);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [JSON.stringify([size, value])]);

  return (
    <div {...$} className="HorizontalNumberSlider" ref={elementStorage.parent}>
      {(['left', 'right'] as const).map(id => (
        <div
          className="HorizontalNumberSlider__slider"
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
