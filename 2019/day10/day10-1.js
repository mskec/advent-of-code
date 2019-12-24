// https://adventofcode.com/2019/day/10

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const map = input.split('\n').map(row => row.split(''));

  const visibilityMap = [];
  for (let x = 0; x < map.length; x++) {
    visibilityMap.push([]);
    for (let y = 0; y < map.length; y++) {
      const obj = map[x][y];
      if (obj === '.') {
        visibilityMap[x].push(0);
        continue;
      }

      const visibleAst = findVisible(map, { x, y });
      visibilityMap[x].push(visibleAst);
    }
  }

  let maxVisible = 0;
  let pos;
  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map.length; y++) {
      if (visibilityMap[x][y] > maxVisible) {
        maxVisible = visibilityMap[x][y];
        pos = { x, y };
      }
    }
  }

  console.log(visibilityMap);
  console.log('The best position', pos, maxVisible);
}

/**
 * Find visible asteroids by calculating the equation of a line
 * between an asteroid (x, y) and an observed position (pos)
 */
function findVisible(map, pos) {
  const angles = {};
  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map.length; y++) {
      if (x === pos.x && y === pos.y) {
        // skip the same pos
        continue;
      } else if (map[x][y] === '.') {
        // skip empty pos
        continue;
      }

      let key;
      if (x === pos.x) {
        key = `x=${x}`;
        key += y > pos.y ? '+' : '-';
      } else {
        key = (y - pos.y) / (x - pos.x);
        if (y === pos.y) {
          key += x > pos.x ? '+' : '-';
        } else {
          key += y > pos.y ? '+' : '-';
        }
      }
      if (!angles[key]) {
        angles[key] = 0;
      }
      angles[key]++;
    }
  }
  return Object.keys(angles).length;
}
