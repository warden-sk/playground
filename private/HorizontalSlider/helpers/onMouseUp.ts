/*
 * Copyright 2022 Marek Kobida
 */

import type { State } from '../index';
import Translate from '../../helpers/Translate';

function onMouseUp(state: State, updateState: (on: (state: State) => State) => void) {
  return () => {
    updateState(state => ({ ...state, isDown: false }));

    state.parentElement().classList.remove('t-moving');

    const [translateX] = new Translate(state.childElement()).read();

    //                                (1)                                 (2)
    updateState(state => ({ ...state, velocityX: translateX - state.endX, endX: translateX }));
  };
}

export default onMouseUp;
