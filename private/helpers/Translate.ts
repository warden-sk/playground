/*
 * Copyright 2022 Marek Kobida
 */

class Translate {
  #element: HTMLElement;

  constructor(element: HTMLElement) {
    this.#element = element;
  }

  read(): [x: number, y: number] {
    const style = window.getComputedStyle(this.#element);

    const matrix = new WebKitCSSMatrix(style.transform);

    return [matrix.m41, matrix.m42];
  }

  write(x: number, y: number): string {
    return (this.#element.style.transform = `translate(${x}px, ${y}px)`);
  }
}

export default Translate;
