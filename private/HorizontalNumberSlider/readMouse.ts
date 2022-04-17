/*
 * Copyright 2022 Marek Kobida
 */

function readMouse(event: MouseEvent & TouchEvent): [x: number, y: number] {
  return [event.pageX ?? event.touches[0].pageX, event.pageY ?? event.touches[0].pageY];
}

export default readMouse;
