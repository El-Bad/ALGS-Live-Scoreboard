//await sleep(ms)
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//c1: [r, g, b], mult is 0-1, 0=c1 1=c2
function getColorBetween(c1, c2, mult) {
  return [
    c1[0] * mult + c2[0] * (1 - mult),
    c1[1] * mult + c2[1] * (1 - mult),
    c1[2] * mult + c2[2] * (1 - mult),
  ];
}

export { getColorBetween, sleep };
