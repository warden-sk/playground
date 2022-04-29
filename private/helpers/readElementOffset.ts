/*
 * Copyright 2022 Marek Kobida
 */

function readElementOffset(element: HTMLElement): [x: number, y: number] {
  const rectangle = element.getBoundingClientRect();

  return [rectangle.x, rectangle.y];
}

export default readElementOffset;
