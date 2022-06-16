/*
 * Copyright 2022 Marek Kobida
 */

import type { State } from '../index';
import readMouseOffset from '../../helpers/readMouseOffset';

function onMouseDown(state: State) {
  return (event: MouseEvent | TouchEvent) => {
    state.endInertia();
    state.isDown = true;
    state.startTime = +new Date();
    [state.startX] = readMouseOffset(event);
  };
}

export default onMouseDown;
