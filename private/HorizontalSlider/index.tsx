/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import { ChevronLeft, ChevronRight } from '@warden-sk/icons';
import React, { useEffect, useRef, useState } from 'react';

interface P {
  SIZE?: number;
  VELOCITY?: number;
  children?: React.ReactNode;
}

function HorizontalSlider({ SIZE, VELOCITY = 0.75, children, ...attributes }: B<JSX.IntrinsicElements['div']> & P) {
  const [isLeft, updateIsLeft] = useState<boolean>(false);
  const [isRight, updateIsRight] = useState<boolean>(false);
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const IS_LEFT = updateIsLeft;
    const IS_RIGHT = updateIsRight;
    const ELEMENT = element.current!;
    const X = true;
    const Y = false;
    const parent = ELEMENT.parentElement!;

    const height = parent.scrollHeight - parent.clientHeight;
    let width = parent.scrollWidth - parent.clientWidth;

    const position: [x: number, y: number] = [0, 0];
    const start: [x: number, y: number] = [0, 0];
    let isDown = false;
    let startTime: number = +new Date();

    const currentTranslate: [x: number, y: number] = [0, 0];

    function getTranslate(): [number, number] {
      return currentTranslate;
    }

    function setTranslate(x: number, y: number) {
      if (x) {
        x = x < 0 ? x : 0;
        x = x > width * -1 ? x : width * -1;

        currentTranslate[0] = x;
        ELEMENT.style.transform = `translate(${x}px,${currentTranslate[1]}px)`;
      }
      if (y) {
        y = y < 0 ? y : 0;
        y = y > height * -1 ? y : height * -1;

        currentTranslate[1] = y;
        ELEMENT.style.transform = `translate(${currentTranslate[0]}px,${y}px)`;
      }
      update();
    }

    function update() {
      const [x] = getTranslate();

      if (x === 0) {
        IS_LEFT?.(false);
        parent.classList.remove('t-left');
      } else {
        IS_LEFT?.(true);
        parent.classList.add('t-left');
      }

      if (x === width * -1) {
        IS_RIGHT?.(false);
        parent.classList.remove('t-right');
      } else {
        IS_RIGHT?.(true);
        parent.classList.add('t-right');
      }
    }

    function updateSize() {
      width = parent.scrollWidth - parent.clientWidth;
    }

    ['mousedown', 'touchstart'].forEach(type =>
      parent.addEventListener(type, e => {
        startTime = +new Date();
        endInertia();

        isDown = true;
        // @ts-ignore
        start[0] = e.pageX ?? e.touches[0].pageX;
        // @ts-ignore
        start[1] = e.pageY ?? e.touches[0].pageY;
      })
    );

    parent.addEventListener('mouseleave', () => {
      isDown = false;
    });

    ['mousemove', 'touchmove'].forEach(type =>
      parent.addEventListener(type, e => {
        if (!isDown) return;

        e.preventDefault();

        let lastTranslateX = 0;
        let lastTranslateY = 0;

        if (X) {
          // @ts-ignore
          const x = e.pageX ?? e.touches[0].pageX;

          // left-to-right
          if (x > start[0]) lastTranslateX = position[0] + x - start[0];

          // right-to-left
          if (x < start[0]) lastTranslateX = position[0] - start[0] + x;
        }

        if (Y) {
          // @ts-ignore
          const y = e.pageY ?? e.touches[0].pageY;

          // top-to-bottom
          if (y > start[1]) lastTranslateY = position[1] + y - start[1];

          // bottom-to-top
          if (y < start[1]) lastTranslateY = position[1] - start[1] + y;
        }

        setTranslate(lastTranslateX, lastTranslateY);
      })
    );

    ['mouseup', 'touchend'].forEach(type =>
      parent.addEventListener(type, () => {
        isDown = false;

        const translate = getTranslate();

        // X
        velocityX[1] = translate[0] - position[0];
        velocityX[0] = velocityX[1];
        position[0] = translate[0];

        // Y
        velocityY[1] = translate[1] - position[1];
        velocityY[0] = velocityY[1];
        position[1] = translate[1];

        const endTime = +new Date();
        if (endTime - startTime < 375) startInertia();
      })
    );

    const velocityX: [number, number] = [0, 0];
    const velocityY: [number, number] = [0, 0];

    let idOfInertia: number;

    function endInertia() {
      cancelAnimationFrame(idOfInertia);

      const translate = getTranslate();

      position[0] = translate[0];
      position[1] = translate[1];
    }

    function startInertia() {
      idOfInertia = requestAnimationFrame(inertia);
    }

    function inertia() {
      const x = position[0] + (velocityX[0] - velocityX[1]);
      const y = position[1] + (velocityY[0] - velocityY[1]);

      setTranslate(x, y);

      velocityX[1] *= VELOCITY;
      velocityY[1] *= VELOCITY;

      if (Math.abs(velocityX[1]) > 0.5 || Math.abs(velocityY[1]) > 0.5) idOfInertia = requestAnimationFrame(inertia);
    }

    /* (2) */ update();
    /* (1) */ updateSize();
  }, []);

  return (
    <div className="t">
      {isLeft && <ChevronLeft className="t-chevron-left" size={SIZE} />}
      <div style={{ overflow: 'hidden' }}>
        <div {...attributes} ref={element}>
          {children}
        </div>
      </div>
      {isRight && <ChevronRight className="t-chevron-right" size={SIZE} />}
    </div>
  );
}

export default HorizontalSlider;
