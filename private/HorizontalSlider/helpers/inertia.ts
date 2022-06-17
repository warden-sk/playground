/*
 * Copyright 2022 Marek Kobida
 */

import type { State } from '../index';

function inertia(state: () => State, updateState: (on: (state: State) => State) => void): () => void {
  return () => {
    const x = state().lastTranslateX + (state().whereToGo[0] - state().whereToGo[1]);

    state().setTranslateX(x);

    state().whereToGo[1] *= 0.75;

    if (Math.abs(state().whereToGo[1]) > 0.5) {
      updateState(state => ({ ...state, idOfInertia: requestAnimationFrame(inertia(() => state, updateState)) }));
    } else {
      const [lastTranslateX] = state().translate().read();

      updateState(state => ({ ...state, lastTranslateX }));
    }
  };
}

export default inertia;
