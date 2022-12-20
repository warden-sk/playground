/*
 * Copyright 2023 Marek Kobida
 */

import type { State } from '../index';

function onMouseLeave(state: () => State, updateState: (on: (state: State) => State) => void) {
  return () => {
    updateState(state => ({ ...state, isDown: false }));

    state().isMoving(false);
  };
}

export default onMouseLeave;
