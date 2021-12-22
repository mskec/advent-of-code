// https://adventofcode.com/2021/day/22#part2

const path = require('path');
const fs = require('fs');

class Range {
  from;
  to;
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }
  isIntersecting(range) {
    return this.from <= range.to && range.from <= this.to;
  }
  mergeRange(range) {
    return new Range(Math.max(this.from, range.from), Math.min(this.to, range.to));
  }
  size() {
    return this.to - this.from + 1;
  }
}

class Cube {
  xRange;
  yRange;
  zRange;

  constructor(xRange, yRange, zRange) {
    this.xRange = xRange;
    this.yRange = yRange;
    this.zRange = zRange;
  }

  isOverlapping(other) {
    return this.xRange.isIntersecting(other.xRange) &&
      this.yRange.isIntersecting(other.yRange) &&
      this.zRange.isIntersecting(other.zRange);
  }

  getOverlap(other) {
    return new Cube(
      this.xRange.mergeRange(other.xRange),
      this.yRange.mergeRange(other.yRange),
      this.zRange.mergeRange(other.zRange),
    );
  }

  volume() {
    return this.xRange.size() * this.yRange.size() * this.zRange.size();
  }
}

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const steps = input.split('\n')
    .map(step => {
      const [state, coords] = step.split(' ');
      const [xRange, yRange, zRange] = coords.split(',').map(c => c.substr(2).split('..').map(Number));
      return {
        state: state === 'on',
        cube: new Cube(new Range(...xRange), new Range(...yRange), new Range(...zRange)),
      };
    });

  const onCubes = [];
  const allOverlapping = [];
  steps.forEach(({ state, cube }) => {
    const overlaps = [];
    const parts = [];
    onCubes.forEach(onCube => {
      if (cube.isOverlapping(onCube)) {
        overlaps.push(cube.getOverlap(onCube));
      }
    });
    allOverlapping.forEach(overlapCube => {
      if (cube.isOverlapping(overlapCube)) {
        parts.push(cube.getOverlap(overlapCube));
      }
    });
    onCubes.push(...parts);
    allOverlapping.push(...overlaps);
    if (state) {
      onCubes.push(cube);
    }
  });

  let onCubeCnt = onCubes.reduce((agg, cube) => agg + cube.volume(), 0);
  let overlapCnt = allOverlapping.reduce((agg, cube) => agg + cube.volume(), 0);
  const result = onCubeCnt - overlapCnt;
  console.log({ onCubeCnt, overlapCnt });
  console.log('cubes on:', result);
}
