// https://adventofcode.com/2021/day/13#part2

const path = require('path');
const fs = require('fs');
const { createMatrix } = require('../../utils/matrix');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function printMatrix(matrix) {
  console.log(matrix.map(row => row.join('')).join('\n'));
}


function foldPaper(map, fold) {
  const { plane, val } = fold;

  let foldedMap;
  if (plane === 'y') {
    const newYLen = val;
    foldedMap = createMatrix(newYLen, map[0].length, '.');

    // copy upper fold values
    for (let y = 0; y < newYLen; y++) {
      for (let x = 0; x < map[y].length; x++) {
        foldedMap[y][x] = map[y][x];
      }
    }

    // copy bottom fold values
    for (let y = newYLen + 1; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === '#') {
          foldedMap[2*val - y][x] = map[y][x];
        }
      }
    }
  } else {
    const newXLen = val;
    foldedMap = createMatrix(map.length, newXLen, '.');

    // copy left fold values
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < newXLen; x++) {
        foldedMap[y][x] = map[y][x];
      }
    }

    // copy right fold values
    for (let y = 0; y < map.length; y++) {
      for (let x = newXLen + 1; x < map[y].length; x++) {
        if (map[y][x] === '#') {
          foldedMap[y][2*val - x] = map[y][x];
        }
      }
    }
  }

  return foldedMap;
}

function run(input) {
  const lines = input.split('\n');

  const dots = [];
  let readDots = false;
  let maxX = 0;
  let maxY = 0;
  let i = 0;
  for (; i < lines.length && !readDots; i++) {
    const line = lines[i];
    if (line.length === 0) {
      readDots = true;
      i++;
      break;
    }

    const [x, y] = line.split(',').map(Number);
    dots.push({ x, y });

    if (x > maxX) {
      maxX = x;
    }
    if (y > maxY) {
      maxY = y;
    }
  }

  const folds = [];
  for (; i < lines.length; i++) {
    const line = lines[i];
    const [plane, val] = line.slice('fold along '.length).split('=');
    folds.push({ plane, val: Number(val) });
  }

  // console.log(`paper size ${maxX},${maxY}`);
  let map = createMatrix(maxY + 1, maxX + 1, '.');

  dots.forEach(dot => {
    map[dot.y][dot.x] = '#';
  });

  map = foldPaper(map, folds[0]);
  for (let j = 0; j < folds.length; j++) {
    map = foldPaper(map, folds[j]);
  }
  printMatrix(map); // UEFZCUCJ
}
