/*
 * Copyright 2022 Marek Kobida
 */

function readElementWidth(element: HTMLElement): number {
  const { width } = element.getBoundingClientRect();

  return width;
}

export default readElementWidth;
