/*
 * Copyright 2022 Marek Kobida
 */

function steps(size: [number, number], step: number): number[] {
  return [/* (1) */ ...[...new Array((size[1] - size[0]) / step)].map((_, i) => size[0] + step * i), /* (2) */ size[1]];
}

export default steps;
