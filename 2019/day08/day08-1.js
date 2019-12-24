// https://adventofcode.com/2019/day/8

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const pxls = input.split('').map(val => Number.parseInt(val));
  const layers = [];

  const size = 25 * 6;
  // const size = 6;
  for (let i = 0; i < pxls.length; i++) {
    const layer = Math.floor(i / size);
    if (!layers[layer]) {
      layers.push([]);
    }
    layers[layer].push(pxls[i]);
  }

  let fewest0Layer = 0;
  let fewest0Count = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < Math.floor(pxls.length / size); i++) {
    const count0 = layers[i].reduce((cnt, pxl) => (pxl === 0 ? cnt + 1 : cnt), 0);
    if (count0 < fewest0Count) {
      fewest0Count = count0;
      fewest0Layer = i;
    }
  }

  const count1 = layers[fewest0Layer].reduce((cnt, pxl) => (pxl === 1 ? cnt + 1 : cnt), 0);
  const count2 = layers[fewest0Layer].reduce((cnt, pxl) => (pxl === 2 ? cnt + 1 : cnt), 0);

  console.log(count1 * count2); // 1215
}
