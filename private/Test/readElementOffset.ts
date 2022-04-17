/*
 * Copyright 2022 Marek Kobida
 */

function readElementOffset(element: HTMLElement): [x: number, y: number] {
  const offset = element.getBoundingClientRect();

  return [offset.x, offset.y];
}

export default readElementOffset;
