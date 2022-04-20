/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import { ChevronLeft, ChevronRight } from '@warden-sk/icons';
import React, { useEffect, useRef, useState } from 'react';
import Translate from '../HorizontalNumberSlider/Translate';

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
    const IS_LEFT = updateIsLeft;
    const IS_RIGHT = updateIsRight;
    const X = true;
    const Y = true;
    const height = parentElement.current!.scrollHeight - parentElement.current!.clientHeight;
    let width = parentElement.current!.scrollWidth - parentElement.current!.clientWidth;

    const position: [x: number, y: number] = [0, 0];
    const start: [x: number, y: number] = [0, 0];
    let isDown = false;
    let startTime: number = +new Date();

    function setTranslate(x: number, y: number) {
      const translate = new Translate(childElement.current!);

      if (x) {
        x = x < 0 ? x : 0;
        x = x > width * -1 ? x : width * -1;

        translate.write(x, translate.read()[1]);
      }

      if (y) {
        y = y < 0 ? y : 0;
        y = y > height * -1 ? y : height * -1;

        translate.write(translate.read()[0], y);
      }

      update();
    }

    function update() {
      const [translateX] = new Translate(childElement.current!).read();

      if (translateX === 0) {
        IS_LEFT?.(false);
        parentElement.current!.classList.remove('t-left');
      } else {
        IS_LEFT?.(true);
        parentElement.current!.classList.add('t-left');
      }

      if (translateX === width * -1) {
        IS_RIGHT?.(false);
        parentElement.current!.classList.remove('t-right');
      } else {
        IS_RIGHT?.(true);
        parentElement.current!.classList.add('t-right');
      }
    }

    function updateSize() {
      width = parentElement.current!.scrollWidth - parentElement.current!.clientWidth;
    }

    ['mousedown', 'touchstart'].forEach(type =>
      parentElement.current!.addEventListener(type, e => {
        startTime = +new Date();
        endInertia();

        isDown = true;
        // @ts-ignore
        start[0] = e.pageX ?? e.touches[0].pageX;
        // @ts-ignore
        start[1] = e.pageY ?? e.touches[0].pageY;
      })
    );

    parentElement.current!.addEventListener('mouseleave', () => {
      isDown = false;
    });

    ['mousemove', 'touchmove'].forEach(type =>
      parentElement.current!.addEventListener(type, e => {
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
      parentElement.current!.addEventListener(type, () => {
        isDown = false;

        const translate = new Translate(childElement.current!).read();

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

      const translate = new Translate(childElement.current!).read();

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

      if (Math.abs(velocityX[1]) > 0.5 || Math.abs(velocityY[1]) > 0.5) {
        idOfInertia = requestAnimationFrame(inertia);
      }
    }

    /* (1) */ update();
    /* (2) */ updateSize();
  }, []);

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
