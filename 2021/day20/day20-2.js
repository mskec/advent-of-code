// https://adventofcode.com/2021/day/20#part2

const path = require('path');
const fs = require('fs');
const { createMatrix, countMatrixValues } = require('../../utils/matrix');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function createImageString(img) {
  return img.map(row => row.join('')).join('\n');
}

function run(input) {
  const [enhanceAlgo, , ...pixels] = input.split('\n');

  const iterations = 50;

  let image = createMatrix(pixels.length + iterations*2, pixels[0].length + iterations*2, '.');

  for (let y = 0; y < pixels.length; y++) {
    for (let x = 0; x < pixels[0].length; x++) {
      image[y + iterations][x + iterations] = pixels[y][x];
    }
  }

  for (let k = 0; k < 50; k++) {
    // console.log(createImageString(image));
    // console.log();
    const next = createMatrix(image[0].length, image.length, '.');

    for (let y = 0; y < next.length; y++) {
      for (let x = 0; x < next[0].length; x++) {
        const xMask = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
        const yMask = [-1, -1, -1, 0, 0, 0, 1, 1, 1];

        const pixelArr = [];
        for (let l = 0; l < xMask.length; l++) {
          const cubeX = x + xMask[l];
          const cubeY = y + yMask[l];

          if (cubeX < 0 || cubeX >= image[0].length || cubeY < 0 || cubeY >= image.length) {
            pixelArr.push(k % 2 === 0 ? '.' : '#');
          } else {
            pixelArr.push(image[cubeY][cubeX]);
          }
        }

        const binNum = pixelArr.map(pixel => pixel === '#' ? '1' : '0').join('');
        const enhanceIdx = parseInt(binNum, 2);
        next[y][x] = enhanceAlgo[enhanceIdx];
      }
    }
    image = next;
  }

  console.log(createImageString(image));
  console.log();

  const litPixels = countMatrixValues(image, '#');
  console.log('pixels:', litPixels);
}
