/*
 * Copyright 2023 Marek Kobida
 */

function readElementOffset(element: HTMLElement): [x: number, y: number] {
  const { x, y } = element.getBoundingClientRect();

  return [x, y];
}

export default readElementOffset;
