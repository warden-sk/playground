/*
 * Copyright 2022 Marek Kobida
 */

import React from 'react';

function readMouse(event: React.MouseEvent<HTMLElement>): [x: number, y: number] {
  return [event.pageX, event.pageY];
}

export default readMouse;
