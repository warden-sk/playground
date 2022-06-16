/*
 * Copyright 2022 Marek Kobida
 */

import type { State } from '../index';
import Translate from '../../helpers/Translate';

function onMouseUp(state: () => State, updateState: (on: (state: State) => State) => void) {
  return () => {
    updateState(state => ({ ...state, isDown: false }));

    state().parentElement().classList.remove('t-moving');

    const [translateX] = new Translate(state().childElement()).read();

    const velocityX: [number, number] = [0, 0];

    velocityX[0] = (translateX - state().endX) * 2;
    velocityX[1] = velocityX[0];

    //                                (1)        (2)
    updateState(state => ({ ...state, velocityX, endX: translateX }));

    function inertia() {
      const x = state().endX + (state().velocityX[0] - state().velocityX[1]);

      state().setTranslateX(x);

      state().velocityX[1] *= 0.75;

      if (Math.abs(state().velocityX[1]) > 0.5) {
        updateState(state => ({ ...state, idOfInertia: requestAnimationFrame(inertia) }));
      } else {
        const [translateX] = new Translate(state().childElement()).read();

        updateState(state => ({ ...state, endX: translateX }));
      }
    }

    function startInertia() {
      updateState(state => ({ ...state, idOfInertia: requestAnimationFrame(inertia) }));
    }

    const endTime = +new Date();

    if (endTime - state().startTime < 375) {
      startInertia();
    }
  };
}

export default onMouseUp;
