// https://adventofcode.com/2021/day/22

const path = require('path');
const fs = require('fs');
const { createMatrixXYZ, countMatrixValues } = require('../../utils/matrix');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const steps = input.split('\n')
    .map(step => {
      const [state, coords] = step.split(' ');
      const [xRange, yRange, zRange] = coords.split(',').map(c => c.substr(2).split('..').map(Number));
      return { state: state === 'on' ? 1 : 0, xRange, yRange, zRange };
    });
  const size = 101;

  const cube = createMatrixXYZ(size, size, size, 0);
  steps.forEach(step => {
    for (let z = step.zRange[0]; z <= step.zRange[1]; z++) {
      if (z < -50 || z > 50) {
        continue;
      }
      for (let y = step.yRange[0]; y <= step.yRange[1]; y++) {
        if (y < -50 || y > 50) {
          continue;
        }
        for (let x = step.xRange[0]; x <= step.xRange[1]; x++) {
          if (x < -50 || x > 50) {
            continue;
          }
          cube[z + 50][y + 50][x + 50] = step.state;
        }
      }
    }
  });

  let onCubeCnt = 0;
  for (let z = 0; z < size; z++) {
    onCubeCnt += countMatrixValues(cube[z], 1);
  }
  console.log('cubes on:', onCubeCnt);
}
