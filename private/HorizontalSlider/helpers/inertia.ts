/*
 * Copyright 2023 Marek Kobida
 */

import type { State } from '../index';

function inertia(state: () => State, updateState: (on: (state: State) => State) => void): () => void {
  return () => {
    const x = state().lastTranslateX + (state().whereToGo[0] - state().whereToGo[1]);

    state().setTranslateX(x);

    updateState(state => ({ ...state, whereToGo: [state.whereToGo[0], state.whereToGo[1] * 0.875] }));

    if (Math.abs(state().whereToGo[1]) > 0.5) {
      updateState(state => ({ ...state, idOfInertia: requestAnimationFrame(inertia(() => state, updateState)) }));
    }
  };
}

export default inertia;
