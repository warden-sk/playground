/*
 * Copyright 2022 Marek Kobida
 */

import type { State } from '../index';
import inertia from './inertia';

function onMouseUp(state: () => State, updateState: (on: (state: State) => State) => void) {
  return () => {
    updateState(state => ({ ...state, isDown: false }));

    state().parentElement().classList.remove('t-moving');

    const [lastTranslateX] = state().translate().read();

    const whereToGo: [number, number] = [0, 0];
    whereToGo[0] = (lastTranslateX - state().lastTranslateX) * 2;
    whereToGo[1] = whereToGo[0];

    //                                (1)             (2)
    updateState(state => ({ ...state, lastTranslateX, whereToGo }));

    const endTime = +new Date();

    if (endTime - state().startTime < 375) {
      inertia(state, updateState)();
    }
  };
}

export default onMouseUp;
