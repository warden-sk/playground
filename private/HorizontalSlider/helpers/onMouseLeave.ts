/*
 * Copyright 2022 Marek Kobida
 */

import type { State } from '../index';

function onMouseLeave(state: State, updateState: (on: (state: State) => State) => void) {
  return () => {
    updateState(state => ({ ...state, isDown: false }));

    state.parentElement().classList.remove('t-moving');
  };
}

export default onMouseLeave;
