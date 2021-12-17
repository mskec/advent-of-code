// https://adventofcode.com/2021/day/17

const path = require('path');
const fs = require('fs');

const __DEBUG__ = false;

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function isInArea(x, y, xRange, yRange) {
  return x >= xRange[0] && x <= xRange[1] &&
    y >= yRange[0] && y <= yRange[1];
}

function didMiss(x, y, xRange, yRange) {
  return x > xRange[1] || y < yRange[1];
}


function run(input) {
  const [xRangeInput, yRangeInput] = input.slice('target area: '.length).split(', ');
  const xRange = xRangeInput.slice(2).split('..').map(n => +n);
  const yRange = yRangeInput.slice(2).split('..').map(n => +n);

  console.log('x range:', xRange);
  console.log('y range;', yRange);

  let highestY = 0; // start position
  for (let y = yRange[0]; y < 50000; y++) {
    for (let x = 0; x <= xRange[1]; x++) {

      let vel = { x, y };
      let pos = { x: 0, y: 0 };
      let currentHighestY = 0;
      let reachedTarget = false;

      __DEBUG__ && console.log(`sim (${x},${y})`);
      for (let s = 0; s < 500; s++) {
        __DEBUG__ && console.log('  step', s);
        __DEBUG__ && console.log(`  pos (${pos.x},${pos.y})`);
        __DEBUG__ && console.log(`  vel (${vel.x},${vel.y})`);

        if (pos.y > currentHighestY) {
          __DEBUG__ && console.log(' new high:', pos.y);
          currentHighestY = pos.y;
        }

        if (isInArea(pos.x, pos.y, xRange, yRange)) {
          reachedTarget = true;
          break;
        }

        if (didMiss(pos.x, pos.y, xRange, yRange)) {
          break;
        }

        // modify position - increases by velocity value
        pos.x += vel.x;
        pos.y += vel.y;
        // modify velocity - x drops towards 0, y decreases by 1
        vel.x = Math.max(vel.x - 1, 0);
        vel.y -= 1;

        __DEBUG__ && console.log();
      }

      if (reachedTarget) {
        highestY = currentHighestY;
        __DEBUG__ && console.log('new highest:', highestY);
      }
    }
  }

  console.log('highest Y:', highestY);
}
