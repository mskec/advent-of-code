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
  for (let i = 0; i < pxls.length; i++) {
    const layer = Math.floor(i / size);
    if (!layers[layer]) {
      layers.push([]);
    }
    layers[layer].push(pxls[i]);
  }

  const visibleLayer = layers[0];
  for (let i = 1; i < layers.length; i++) {
    const layer = layers[i];
    for (let j = 0; j < layer.length; j++) {
      if (![0, 1].includes(visibleLayer[j])) {
        visibleLayer[j] = layer[j];
      }
    }
  }

  console.log(visibleLayer.slice(0, 25).map(v => v === 0 ? ' ' : v).join(''));
  console.log(visibleLayer.slice(25, 50).map(v => v === 0 ? ' ' : v).join(''));
  console.log(visibleLayer.slice(50, 75).map(v => v === 0 ? ' ' : v).join(''));
  console.log(visibleLayer.slice(75, 100).map(v => v === 0 ? ' ' : v).join(''));
  console.log(visibleLayer.slice(100, 125).map(v => v === 0 ? ' ' : v).join(''));
  console.log(visibleLayer.slice(125, 150).map(v => v === 0 ? ' ' : v).join(''));

  // Password: LHCPH
}
