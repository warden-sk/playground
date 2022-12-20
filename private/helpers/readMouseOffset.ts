/*
 * Copyright 2023 Marek Kobida
 */

function readMouseOffset(event: MouseEvent | TouchEvent): [x: number, y: number] {
  const x = event instanceof MouseEvent ? event.pageX : event.touches[0].pageX;
  const y = event instanceof MouseEvent ? event.pageY : event.touches[0].pageY;

  return [x, y];
}

export default readMouseOffset;
