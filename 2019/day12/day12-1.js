// https://adventofcode.com/2019/day/12

const path = require('path');
const fs = require('fs');

class Point {
  x = 0;
  y = 0;
  z = 0;
  constructor(x, y, z) {
    if (x) { this.x = x; }
    if (y) { this.y = y; }
    if (z) { this.z = z; }
  }
  add(point) {
    this.x += point.x;
    this.y += point.y;
    this.z += point.z;
  }
  toString() {
    return `x=${this.x}, y=${this.y}, z=${this.z}`;
  }
}

class Moon {
  pos = new Point();
  vel = new Point();
  constructor(pos) {
    this.pos = pos;
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
    return new Moon(new Point(points[0], points[1], points[2]));
  });

  for (let i = 0; i < 1000; i++) {
    // console.log('Step', i);
    // console.log(moons.join('\n'), '\n');
    simulateStep(moons);
  }

  console.log('The final step');
  console.log(moons.join('\n'), '\n');

  const totalEnergy = moons.map(moon => moon.energy).reduce((agg, val) => agg + val, 0);
  console.log('Total system energy:', totalEnergy); // 7988
}

function simulateStep(moons) {
  for (let i = 0; i < moons.length; i++) {
    for (let j = 0; j < moons.length; j++) {
      if (i !== j) {
        const moon1 = moons[i];
        const moon2 = moons[j];
        moon1.vel.add(new Point(
          Math.max(Math.min(1, moon2.pos.x - moon1.pos.x), -1),
          Math.max(Math.min(1, moon2.pos.y - moon1.pos.y), -1),
          Math.max(Math.min(1, moon2.pos.z - moon1.pos.z), -1),
        ));
      }
    }
  }

  moons.forEach(moon => moon.applyStep());
}
