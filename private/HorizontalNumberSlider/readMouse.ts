/*
 * Copyright 2022 Marek Kobida
 */

function readMouse(event: MouseEvent): [x: number, y: number] {
  return [event.pageX, event.pageY];
}

export default readMouse;
