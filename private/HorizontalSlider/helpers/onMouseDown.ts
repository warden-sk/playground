/*
 * Copyright 2023 Marek Kobida
 */

import readMouseOffset from '../../helpers/readMouseOffset';
import type { State } from '../index';

function onMouseDown(state: () => State, updateState: (on: (state: State) => State) => void) {
  return (event: MouseEvent | TouchEvent) => {
    cancelAnimationFrame(state().idOfInertia);

    const { x: translateX } = state().translate().read();

    updateState(state => ({
      ...state,
      isDown: true,
      lastTranslateX: translateX,
      startTime: +new Date(),
      startX: readMouseOffset(event)[0],
    }));
  };
}

export default onMouseDown;
