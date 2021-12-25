// https://adventofcode.com/2021/day/25

const path = require('path');
const fs = require('fs');
const { printMatrix } = require('../../utils/matrix');

const tiles = {
  EMPTY: '.',
  EAST: '>',
  SOUTH: 'v',
}

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const map = input.split('\n').map(row => row.split(''));

  let step = 0;
  let hasMoved = false;
  do {
    hasMoved = false;
    const canMove = {};
    // check if can move to the east
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] !== tiles.EAST) {
          continue;
        }
        const nextX = (x + 1) % map[y].length;
        if (map[y][nextX] === '.') {
          canMove[`${y},${x}`] = true;
        }
      }
    }

    // move to the east
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] !== tiles.EAST || !canMove[`${y},${x}`]) {
          continue;
        }
        const nextX = (x + 1) % map[y].length;
        const nextY = y;
        if (map[nextY][nextX] === '.') {
          map[nextY][nextX] = map[y][x];
          map[y][x] = tiles.EMPTY;
          hasMoved = true;
          x++;
        }
      }
    }

    // check if can move to the east
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        if (map[y][x] !== tiles.SOUTH) {
          continue;
        }
        const nextY = (y + 1) % map.length;
        if (map[nextY][x] === '.') {
          canMove[`${y},${x}`] = true;
        }
      }
    }

    // move to the south
    const moved = {};
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        if (map[y][x] !== tiles.SOUTH || !canMove[`${y},${x}`] || moved[`${y},${x}`]) {
          continue;
        }
        const nextY = (y + 1) % map.length;
        if (map[nextY][x] === '.') {
          map[nextY][x] = map[y][x];
          map[y][x] = tiles.EMPTY;
          hasMoved = true;
          moved[`${nextY},${x}`] = true;
        }
      }
    }
    step++;
    // console.log(step);
    // printMatrix(map);
    // console.log();
  } while (hasMoved);

  console.log('steps:', step);
}
