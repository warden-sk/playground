/*
 * Copyright 2022 Marek Kobida
 */

import type { State } from '../index';
import Translate from '../../helpers/Translate';

function onMouseUp(state: State) {
  return () => {
    state.isDown = false;
    state.parentElement.classList.remove('t-moving');

    const [translateX] = new Translate(state.childElement).read();

    // X
    state.velocityX[1] = (translateX - state.endX) * 2;
    state.velocityX[0] = state.velocityX[1];
    state.endX = translateX;

    const endTime = +new Date();

    if (endTime - state.startTime < 375) {
      state.startInertia();
    }
  };
}

export default onMouseUp;
