/*
 * Copyright 2023 Marek Kobida
 */

function readElementWidth(element: HTMLElement): number {
  const { width } = element.getBoundingClientRect();

  return width;
}

export default readElementWidth;
