/*
 * Copyright 2022 Marek Kobida
 */

import type { State } from '../index';
import readMouseOffset from '../../helpers/readMouseOffset';

function onMouseDown(state: () => State, updateState: (on: (state: State) => State) => void) {
  return (event: MouseEvent | TouchEvent) => {
    cancelAnimationFrame(state().idOfInertia);

    const [lastTranslateX] = state().translate().read();

    updateState(state => ({
      ...state,
      isDown: true,
      lastTranslateX,
      startTime: +new Date(),
      startX: readMouseOffset(event)[0],
    }));
  };
}

export default onMouseDown;
