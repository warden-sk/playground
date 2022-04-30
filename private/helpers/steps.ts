/*
 * Copyright 2022 Marek Kobida
 */

// development
function steps(size: [from: number, to: number], step: number): number[] {
  return [
    /* (1) */ ...[...new Array((size[1] - size[0]) / step)].map((_, i) => i * (size[0] + step)),
    /* (2) */ size[1],
  ];
}

export default steps;
