// https://adventofcode.com/2019/day/12#part2

const path = require('path');
const fs = require('fs');
const math = require('../../utils/math');

class Point {
  x = 0;
  y = 0;
  z = 0;
  constructor({ x, y, z } = {}) {
    if (x) { this.x = x; }
    if (y) { this.y = y; }
    if (z) { this.z = z; }
  }
  add(point) {
    this.x += point.x;
    this.y += point.y;
    this.z += point.z;
  }
  equals(point) {
    return this.x === point.x && this.y === point.y && this.z === point.z;
  }
  copy() {
    return new Point({ x: this.x, y: this.y, z: this.z });
  }
  toString() {
    return `x=${this.x}, y=${this.y}, z=${this.z}`;
  }
}

class Moon {
  pos = new Point();
  vel = new Point();
  startPos = new Point();
  constructor(pos) {
    this.pos = pos;
    this.startPos = pos.copy();
  }
  get potEnergy() {
    return Math.abs(this.pos.x) + Math.abs(this.pos.y) + Math.abs(this.pos.z);
  }
  get kinEnergy() {
    return Math.abs(this.vel.x) + Math.abs(this.vel.y) + Math.abs(this.vel.z);
  }
  get energy() {
    return this.potEnergy * this.kinEnergy;
  }
  applyStep() {
    this.pos.add(this.vel);
  }
  toString() {
    return `pos=<${this.pos}>, vel=<${this.vel}>`;
  }
}

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const moons = input.split('\n').map(row => {
    const points = row.slice(1, -1).split(', ').map(p => Number.parseInt(p.slice(2)));
    return new Moon(new Point({ x: points[0], y: points[1], z: points[2] }));
  });

  // Find period for X
  // Find period for Y
  // Find period for Z
  // Find LCM for all periods

  let periods = {};
  for (let dimension of ['x', 'y', 'z']) {
    let isInitialPosition = false;
    let step = 0;
    while (!isInitialPosition) {
      simulateStep(moons, dimension);

      step++;
      isInitialPosition = moons.every(m => m.pos[dimension] === m.startPos[dimension] && m.vel[dimension] === 0);
    }
    periods[dimension] = step;
  }

  console.log('Periods', periods);

  const steps = math.findLCM(periods.x, math.findLCM(periods.y, periods.z));
  console.log('Steps', steps); // 337721412394184
}

function simulateStep(moons, dimension) {
  for (let i = 0; i < moons.length; i++) {
    for (let j = 0; j < moons.length; j++) {
      if (i !== j) {
        const moon1 = moons[i];
        const moon2 = moons[j];
        moon1.vel.add(new Point({
          [dimension]: Math.max(Math.min(1, moon2.pos[dimension] - moon1.pos[dimension]), -1),
        }));
      }
    }
  }

  moons.forEach(moon => moon.applyStep());
}
