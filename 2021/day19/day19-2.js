// https://adventofcode.com/2021/day/19#part2
// https://www.reddit.com/r/adventofcode/comments/rjpf7f/comment/hp551kv/

const path = require('path');
const fs = require('fs');

function readScanners(input) {
  const lines = input.split('\n');

  let last;
  const scanners = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('--- scanner ')) {
      last = new Scanner();
      scanners.push(last);
      continue;
    } else if (line.length === 0) {
      continue;
    }
    last.addSignal(...line.split(',').map(n => Number(n)));
  }

  return scanners;
}

class Signal {
  x; y; z; id;
  relatives = [];
  constructor(x, y, z, id) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.id = id;
  }

  align(signal) {
    const dx = Math.abs(this.x - signal.x);
    const dy = Math.abs(this.y - signal.y);
    const dz = Math.abs(this.z - signal.z);
    this.relatives[signal.id] = signal.relatives[this.id] = [
      Math.hypot(dx, dy, dz).toFixed(5),
      Math.min(dx, dy, dz),
      Math.max(dx, dy, dz)
    ].join(",");
  }

  compare(signal) {
    const result = [];
    this.relatives.forEach((relative, relativeIdx) => {
      const index = signal.relatives.indexOf(relative);
      if (index > -1) {
        result.push([signal.relatives[index], relativeIdx, index]);
      }
    });
    return result;
  }
}

class Scanner {
  signals = [];
  position = null;

  addSignal(x, y, z) {
    const newSignal = new Signal(x, y, z, this.signals.length);
    for (let i = 0; i < this.signals.length; i++) {
      this.signals[i].align(newSignal);
    }
    this.signals.push(newSignal);
  }

  setPosition(x, y, z) {
    this.position = { x, y, z };
  }

  compare(scanner) {
    for (let there of scanner.signals) {
      for (let here of this.signals) {
        const intersection = there.compare(here);
        if (intersection.length >= 11) {
          return { there, here, intersection };
        }
      }
    }
  }

  align(scanner, data) {
    for (let line of data.intersection) {
      if (line[0].split(',')[1] === '0') {
        continue;
      }
      const relativeHere = this.signals[line[2]];
      const dx0 = data.here.x - relativeHere.x;
      const dy0 = data.here.y - relativeHere.y;
      const dz0 = data.here.z - relativeHere.z;

      const relativeThere = scanner.signals[line[1]];
      const dx1 = data.there.x - relativeThere.x;
      const dy1 = data.there.y - relativeThere.y;
      const dz1 = data.there.z - relativeThere.z;

      if (Math.abs(dx0) === Math.abs(dy0) || Math.abs(dz0) === Math.abs(dy0) || Math.abs(dx0) === Math.abs(dz0)) {
        continue;
      }

      const map = [0, 0, 0, 0, 0, 0, 0, 0, 0];

      if (dx0 === dx1)
        map[0] = 1;
      if (dx0 === -dx1)
        map[0] = -1;
      if (dx0 === dy1)
        map[3] = 1;
      if (dx0 === -dy1)
        map[3] = -1;
      if (dx0 === dz1)
        map[6] = 1;
      if (dx0 === -dz1)
        map[6] = -1;
      if (dy0 === dx1)
        map[1] = 1;
      if (dy0 === -dx1)
        map[1] = -1;
      if (dy0 === dy1)
        map[4] = 1;
      if (dy0 === -dy1)
        map[4] = -1;
      if (dy0 === dz1)
        map[7] = 1;
      if (dy0 === -dz1)
        map[7] = -1;
      if (dz0 === dx1)
        map[2] = 1;
      if (dz0 === -dx1)
        map[2] = -1;
      if (dz0 === dy1)
        map[5] = 1;
      if (dz0 === -dy1)
        map[5] = -1;
      if (dz0 === dz1)
        map[8] = 1;
      if (dz0 === -dz1)
        map[8] = -1;

      for (let signal of scanner.signals) {
        const old = {
          x : signal.x,
          y : signal.y,
          z : signal.z,
        };
        signal.x = old.x * map[0] + old.y * map[3] + old.z * map[6];
        signal.y = old.x * map[1] + old.y * map[4] + old.z * map[7];
        signal.z = old.x * map[2] + old.y * map[5] + old.z * map[8];
      }
      scanner.setPosition(
        data.here.x - data.there.x,
        data.here.y - data.there.y,
        data.here.z - data.there.z,
      );
      for (let signal of scanner.signals) {
        signal.x += scanner.position.x;
        signal.y += scanner.position.y;
        signal.z += scanner.position.z;
      }
      break;
    }
  }
}

function align(scanners) {
  const locked = new Set([0]);
  scanners[0].setPosition(0, 0, 0);

  while (locked.size < scanners.length) {
    for (let i = 0; i < scanners.length; i++) {
      for (let j = 0; j < scanners.length; j++) {
        if (i === j || !locked.has(i) || locked.has(j)) {
          continue;
        }
        const intersection = scanners[i].compare(scanners[j]);
        if (intersection) {
          scanners[i].align(scanners[j], intersection);
          locked.add(j);
        }
      }
    }
  }
}

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const scanners = readScanners(input);

  align(scanners);

  let maxDist = 0;
  for (let here of scanners) {
    for (let there of scanners) {
      const dist = Math.abs(there.position.x - here.position.x) + Math.abs(there.position.y - here.position.y) + Math.abs(there.position.z - here.position.z);
      if (dist > maxDist) {
        maxDist = dist;
      }
    }
  }

  console.log('max distance:', maxDist);
}
