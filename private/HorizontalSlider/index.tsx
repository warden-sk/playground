/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import { ChevronLeft, ChevronRight } from '@warden-sk/icons';
import React, { useEffect, useRef, useState } from 'react';
import Translate from '../HorizontalNumberSlider/Translate';
import readMouseOffset from '../HorizontalNumberSlider/readMouseOffset';

interface P {
  SIZE?: number;
  VELOCITY?: number;
  children?: React.ReactNode;
}

function HorizontalSlider({ SIZE, VELOCITY = 0.75, children, ...attributes }: B<JSX.IntrinsicElements['div']> & P) {
  const [isLeft, updateIsLeft] = useState<boolean>(false);
  const [isRight, updateIsRight] = useState<boolean>(false);
  const childElement = useRef<HTMLDivElement>(null);
  const parentElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let width = parentElement.current!.scrollWidth - parentElement.current!.clientWidth;

    let isDown = false;
    let positionX = 0;
    let startTime: number = +new Date();
    let startX = 0;

    function setTranslate(x: number) {
      if (x) {
        const translate = new Translate(childElement.current!);

        x = x < 0 ? x : 0;
        x = x > width * -1 ? x : width * -1;

        translate.write(x, 0);

        update();
      }
    }

    function update() {
      const [translateX] = new Translate(childElement.current!).read();

      if (translateX === 0) {
        updateIsLeft(false);
        parentElement.current!.classList.remove('t-left');
      } else {
        updateIsLeft(true);
        parentElement.current!.classList.add('t-left');
      }

      if (translateX === width * -1) {
        updateIsRight(false);
        parentElement.current!.classList.remove('t-right');
      } else {
        updateIsRight(true);
        parentElement.current!.classList.add('t-right');
      }
    }

    function updateSize() {
      width = parentElement.current!.scrollWidth - parentElement.current!.clientWidth;
    }

    ['mousedown', 'touchstart'].forEach(type =>
      parentElement.current!.addEventListener(type, event => {
        startTime = +new Date();
        endInertia();

        isDown = true;
        [startX] = readMouseOffset(event);
      })
    );

    parentElement.current!.addEventListener('mouseleave', () => (isDown = false));

    ['mousemove', 'touchmove'].forEach(type =>
      parentElement.current!.addEventListener(type, event => {
        if (isDown) {
          event.preventDefault();

          const lastTranslate: [x: number] = [0];

          const [x] = readMouseOffset(event);

          // left-to-right
          if (x > startX) lastTranslate[0] = positionX + x - startX;

          // right-to-left
          if (x < startX) lastTranslate[0] = positionX - startX + x;

          setTranslate(lastTranslate[0]);
        }
      })
    );

    ['mouseup', 'touchend'].forEach(type =>
      parentElement.current!.addEventListener(type, () => {
        isDown = false;

        const [translateX] = new Translate(childElement.current!).read();

        // X
        velocityX[1] = translateX - positionX;
        velocityX[0] = velocityX[1];
        positionX = translateX;

        const endTime = +new Date();

        if (endTime - startTime < 375) {
          startInertia();
        }
      })
    );

    const velocityX: [number, number] = [0, 0];

    let idOfInertia: number;

    function endInertia() {
      cancelAnimationFrame(idOfInertia);

      const [translateX] = new Translate(childElement.current!).read();

      positionX = translateX;
    }

    function startInertia() {
      idOfInertia = requestAnimationFrame(inertia);
    }

    function inertia() {
      const x = positionX + (velocityX[0] - velocityX[1]);

      setTranslate(x);

      velocityX[1] *= VELOCITY;

      if (Math.abs(velocityX[1]) > 0.5) {
        idOfInertia = requestAnimationFrame(inertia);
      }
    }

    function $() {
      /* (2) */ updateSize();
      /* (1) */ update();
    }

    $();

    window.addEventListener('resize', $);

    return () => {
      window.removeEventListener('resize', $);
    };
  }, [children]);

  return (
    <div className="t">
      {isLeft && <ChevronLeft className="t-chevron-left" size={SIZE} />}
      <div ref={parentElement} style={{ overflow: 'hidden' }}>
        <div {...attributes} ref={childElement}>
          {children}
        </div>
      </div>
      {isRight && <ChevronRight className="t-chevron-right" size={SIZE} />}
    </div>
  );
}

export default HorizontalSlider;
