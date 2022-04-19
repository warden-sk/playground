/*
 * Copyright 2022 Marek Kobida
 */

function readElementWidth(element: HTMLElement): number {
  const rectangle = element.getBoundingClientRect();

  return rectangle.width;
}

export default readElementWidth;
