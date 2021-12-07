// https://adventofcode.com/2021/day/5

const path = require('path');
const fs = require('fs');

const convertPoints = lineInput => {
  const [p1, p2] = lineInput.split(' -> ');
  const [x1, y1] = p1.split(',');
  const [x2, y2] = p2.split(',');
  return [{ x: +x1, y: +y1 }, { x: +x2, y: +y2 }];
}

const isHorizontal = ([p1, p2]) => p1.y === p2.y;
const isVertical = ([p1, p2]) => p1.x === p2.x;
const isDiagonal = line => !isHorizontal(line) && !isVertical(line);

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  // type Line = [Point, Point]
  // type Lines = Line[]
  let lines = input.split('\n')
    .map(convertPoints);

  // determine the size of a map
  let maxX = 0;
  let maxY = 0;
  lines.forEach(([p1, p2]) => {
    if (p1.x > maxX) {
      maxX = p1.x;
    }
    if (p1.y > maxY) {
      maxY = p1.y;
    }
    if (p2.x > maxX) {
      maxX = p2.x;
    }
    if (p2.y > maxY) {
      maxY = p2.y;
    }
  });

  // console.log('map size:', { maxX, maxY });

  // filter-out diagonal lines
  lines = lines.filter(line => !isDiagonal(line));

  // create a map with all 0s
  const map = Array(maxY + 1).fill(0).map(() => Array(maxX + 1).fill(0));

  // mark points on the map
  lines.forEach(line => {
    // console.log('process line:', line);
    const [start, end] = line;
    let markStart, markEnd;
    if (isHorizontal(line)) {
      if (start.x > end.x) {
        markStart = end.x;
        markEnd = start.x;
      } else {
        markStart = start.x;
        markEnd = end.x;
      }

      // console.log('horizontal', start.y, markStart, markEnd);
      for (let i = markStart; i <= markEnd; i++) {
        // if (typeof map[start.y][i] === 'string') {
        //   map[start.y][i] = 0;
        // }
        map[start.y][i] += 1;
      }

    } else {
      if (start.y > end.y) {
        markStart = end.y;
        markEnd = start.y;
      } else {
        markStart = start.y;
        markEnd = end.y;
      }

      // console.log('vertical', start.x, markStart, markEnd);
      for (let i = markStart; i <= markEnd; i++) {
        if (typeof map[i][start.x] === 'string') {
          map[i][start.x] = 0;
        }
        map[i][start.x] += 1;
        // console.log('it', i, map);
      }
    }
    // console.log(map);
  });

  // calculate points > 2
  let result = map.reduce((agg, line) => {
    return agg + line.reduce((agg2, num) => agg2 + (num >= 2 ? 1 : 0), 0);
  }, 0);
  console.log('result:', result);
}
