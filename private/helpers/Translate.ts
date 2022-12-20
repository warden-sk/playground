/*
 * Copyright 2023 Marek Kobida
 */

class Translate {
  #element: HTMLElement;

  constructor(element: HTMLElement) {
    this.#element = element;
  }

  read(): { x: number; y: number } {
    const style = window.getComputedStyle(this.#element);

    const matrix = new WebKitCSSMatrix(style.transform);

    return { x: matrix.m41, y: matrix.m42 };
  }

  write(x: number, y = 0): string {
    return (this.#element.style.transform = `translate(${x}px,${y}px)`);
  }
}

export default Translate;
