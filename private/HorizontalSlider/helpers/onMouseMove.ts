/*
 * Copyright 2023 Marek Kobida
 */

import readMouseOffset from '../../helpers/readMouseOffset';
import type { State } from '../index';

function onMouseMove(state: () => State) {
  return (event: MouseEvent | TouchEvent) => {
    if (state().isDown) {
      state().isMoving(true);

      const [x] = readMouseOffset(event);

      // from left to right
      if (x > state().startX) {
        state().setTranslateX(state().lastTranslateX + x - state().startX);
      }

      // from right to left
      if (x < state().startX) {
        state().setTranslateX(state().lastTranslateX - state().startX + x);
      }
    }
  };
}

export default onMouseMove;
