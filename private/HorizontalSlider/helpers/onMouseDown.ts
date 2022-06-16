/*
 * Copyright 2022 Marek Kobida
 */

import type { State } from '../index';
import Translate from '../../helpers/Translate';
import readMouseOffset from '../../helpers/readMouseOffset';

function onMouseDown(state: () => State, updateState: (on: (state: State) => State) => void) {
  return (event: MouseEvent | TouchEvent) => {
    cancelAnimationFrame(state().idOfInertia);

    const [translateX] = new Translate(state().childElement()).read();

    updateState(state => ({
      ...state,
      endX: translateX,
      isDown: true,
      startTime: +new Date(),
      startX: readMouseOffset(event)[0],
    }));
  };
}

export default onMouseDown;
