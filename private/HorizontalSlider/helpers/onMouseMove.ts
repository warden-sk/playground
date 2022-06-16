/*
 * Copyright 2022 Marek Kobida
 */

import type { State } from '../index';
import readMouseOffset from '../../helpers/readMouseOffset';

function onMouseMove(state: () => State, updateState: (on: (state: State) => State) => void) {
  return (event: MouseEvent | TouchEvent) => {
    if (state().isDown) {
      event.preventDefault();

      state().parentElement().classList.add('t-moving');

      let translateX = 0;

      const [x] = readMouseOffset(event);

      // from left to right
      if (x > state().startX) {
        translateX = state().endX + x - state().startX;
      }

      // from right to left
      if (x < state().startX) {
        translateX = state().endX - state().startX + x;
      }

      state().setTranslateX(translateX);
    }
  };
}

export default onMouseMove;
