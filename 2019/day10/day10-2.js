// https://adventofcode.com/2019/day/10#part2

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const map = input.split('\n').map(row => row.split(''));

  const visibilityMap = [];
  for (let y = 0; y < map.length; y++) {
    visibilityMap.push([]);
    for (let x = 0; x < map[y].length; x++) {
      const obj = map[y][x];
      if (obj === '.') {
        visibilityMap[y].push(0);
        continue;
      }

      const angles = findVisible(map, { x, y });
      visibilityMap[y].push(Object.keys(angles).length);
    }
  }

  let maxVisible = 0;
  let pos;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (visibilityMap[y][x] > maxVisible) {
        maxVisible = visibilityMap[y][x];
        pos = { x, y };
      }
    }
  }

  console.log('The best position', pos, maxVisible);
  const lastDestroyed = destroyAsteroids(map, pos, 200);
  console.log('Last destroyed', lastDestroyed); // (11, 19)
  console.log('Score:', lastDestroyed.x * 100 + lastDestroyed.y); // 1119

  // 1319 too high (13, 19)
  // 521 too low (5, 21)
}

/**
 * Note:
 *  Does not work when there's more than one circle.
 *  The reason is because it's destroying any asteroid
 *  on the line, not the first one.
 */
function destroyAsteroids(map, pos, totalToDestroy) {
  const angleMap = findVisible(map, pos);

  /**
   * 1) x= -
   * 2) (neg) -
   * 3) 0 +
   * 4) (pos) +
   * 5) x= +
   * 6) (neg) +
   * 7) 0 -
   * 8) (pos) -
   */
  const getWeight = ang => {
    if (ang.startsWith('x=')) {
      return ang.endsWith('+') ? 5 : 1;
    } else if (ang.startsWith('0')) {
      return ang.endsWith('+') ? 3 : 7;
    } else if (ang.startsWith('-')) {
      return ang.endsWith('+') ? 6 : 2;
    } else {
      return ang.endsWith('+') ? 4 : 8;
    }
  };

  const angles = Object.keys(angleMap);
  // const angles = ['-2+', '-0.5+', 'x=5+', '2.1+', '1.1+', '0+', '0-', '-8-', 'x=5-', '1-', '-2.3-'];
  angles.sort((a1, a2) => {
    const w1 = getWeight(a1);
    const w2 = getWeight(a2);
    if (w1 === w2) {
      const val1 = Number.parseFloat(a1.slice(0, a1.length - 1));
      const val2 = Number.parseFloat(a2.slice(0, a2.length - 1));
      // console.log('eq', w1, val1, val2, a1, a2);
      return val1 - val2;
    }
    return w1 - w2;
  });

  // console.log(angles.map((a, i) => `${i + 1}\t${a}`).join('\n'));

  let lastAngle = null;
  let lastDestroyed = null;
  for (let i = 0, k = 0; i < totalToDestroy; i++) {
    let nextPos = null;
    while (nextPos === null) {
      const nextAngle = angles[(i + k) % angles.length];
      nextPos = angleMap[nextAngle].shift();
      if (!nextPos) {
        k++;
      } else {
        // console.log('Destroyed', i + 1, nextPos);
        lastAngle = nextAngle;
        lastDestroyed = nextPos;
      }
    }
  }

  // console.log({ pos, lastAngle, lastDestroyed });
  return lastDestroyed;
}

/**
 * Find visible asteroids by calculating the equation of a line
 * between an asteroid (x, y) and an observed position (pos).
 * @returns angles of each line starting from pos.
 */
function findVisible(map, pos) {
  const angles = {};

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (y === pos.y && x === pos.x) {
        // skip the same pos
        continue;
      } else if (map[y][x] === '.') {
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
        angles[key] = [];
      }
      angles[key].push({ x, y });
    }
  }

  return angles;
}
