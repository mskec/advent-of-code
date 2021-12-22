// https://adventofcode.com/2021/day/22#part2

const path = require('path');
const fs = require('fs');
const { createMatrixXYZ, countMatrixValues } = require('../../utils/matrix');

run(
  fs.readFileSync(path.join(__dirname, 'input2.sample.txt'), 'utf8').trim()
);

function run(input) {
  const range = {
    x: [0, 0],
    y: [0, 0],
    z: [0, 0],
  }
  const steps = input.split('\n')
    .map(step => {
      const [state, coords] = step.split(' ');
      const [xRange, yRange, zRange] = coords.split(',').map(c => c.substr(2).split('..').map(Number));

      range.x[0] = Math.min(range.x[0], xRange[0]);
      range.x[1] = Math.max(range.x[1], xRange[1]);
      range.y[0] = Math.min(range.y[0], yRange[0]);
      range.y[1] = Math.max(range.y[1], yRange[1]);
      range.z[0] = Math.min(range.z[0], zRange[0]);
      range.z[1] = Math.max(range.z[1], zRange[1]);

      return { state: state === 'on', xRange, yRange, zRange };
    });
  const size = {
    x: Math.abs(range.x[0]) + Math.abs(range.x[1]),
    y: Math.abs(range.y[0]) + Math.abs(range.y[1]),
    z: Math.abs(range.z[0]) + Math.abs(range.z[1]),
  }
  console.log(size);
  const cube = createMatrixXYZ(size.z, size.y, size.x, false);

  steps.forEach(step => {
    for (let z = step.zRange[0]; z <= step.zRange[1]; z++) {
      for (let y = step.yRange[0]; y <= step.yRange[1]; y++) {
        for (let x = step.xRange[0]; x <= step.xRange[1]; x++) {
          cube[z][y][x] = step.state;
        }
      }
    }
  });

  let onCubeCnt = 0;
  for (let z = 0; z < size; z++) {
    onCubeCnt += countMatrixValues(cube[z], true);
  }
  console.log('cubes on:', onCubeCnt);
}
