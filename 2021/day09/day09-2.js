// https://adventofcode.com/2021/day/9

const path = require('path');
const fs = require('fs');

const isLowPoint = (map, i, j) => {
  let isLowest = true;
  let point = map[j][i];
  const debug = [];
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

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const mapRaw = input.split('\n');

  const map = mapRaw.map(row => row.split('').map(n => +n));

  let lowPoints = [];
  for (let j = 0; j < map.length; j++) {
    for (let i = 0; i < map[j].length; i++) {
      if (isLowPoint(map, i, j)) {
        lowPoints.push(1 + map[j][i]);
      }
    }
  }

  // console.log({ lowPoints });
  let sum = lowPoints.reduce((agg, n) => agg + n, 0);
  console.log('result:', sum);
}
