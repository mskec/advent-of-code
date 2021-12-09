// https://adventofcode.com/2021/day/9#part2

const path = require('path');
const fs = require('fs');

const isLowPoint = (map, i, j) => {
  let isLowest = true;
  let point = map[j][i];
  // const debug = [];
  // debug.push(['isLowPoint', i, j]);
  // up
  if (j-1 >= 0) {
    isLowest = isLowest && map[j-1][i] > point;
    // debug.push(['up', map[j-1][i] > point]);
  }
  // right
  if (i+1 <= map[j].length-1) {
    isLowest = isLowest && map[j][i+1] > point;
    // debug.push(['right', map[j][i+1] > point]);
  }
  // down
  if (j+1 <= map.length-1) {
    isLowest = isLowest && map[j+1][i] > point;
    // debug.push(['down', map[j+1][i] > point]);
  }
  // left
  if (i-1 >= 0) {
    isLowest = isLowest && map[j][i-1] > point;
    // debug.push(['left', map[j][i-1] > point]);
  }
  // debug.push([isLowest, point, i, j, '\n']);
  // if (isLowest) {
  //   debug.forEach(line => console.log(...line));
  // }

  return isLowest;
};

const calcBasinSize = (map, i, j, visited = {}) => {
  if (map[j][i] === 9 || visited[`${i},${j}`]) {
    return 0;
  }

  visited[`${i},${j}`] = true;

  let size = 1;
  if (j-1 >= 0) {
    size += calcBasinSize(map, i, j-1, visited);
  }
  // right
  if (i+1 <= map[j].length-1) {
    size += calcBasinSize(map, i+1, j, visited);
  }
  // down
  if (j+1 <= map.length-1) {
    size += calcBasinSize(map, i, j+1, visited);
  }
  // left
  if (i-1 >= 0) {
    size += calcBasinSize(map, i-1, j, visited);
  }

  return size;
};

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const mapRaw = input.split('\n');

  const map = mapRaw.map(row => row.split('').map(n => +n));

  let basinSizes = [];
  for (let j = 0; j < map.length; j++) {
    for (let i = 0; i < map[j].length; i++) {
      if (isLowPoint(map, i, j)) {
        basinSizes.push(calcBasinSize(map, i, j));
      }
    }
  }

  basinSizes.sort((a, b) => b - a);
  // console.log({ basinSizes });
  // top 3
  let sum = basinSizes.slice(0, 3).reduce((agg, n) => agg * n, 1);
  console.log('result:', sum);
}
