// https://adventofcode.com/2019/day/3

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const wires = input.split('\n')
    .map(w => {
      return w.split(',')
        .map(ins => ins.split(''))
        .map(ins => ({
          dir: ins.shift(),
          amnt: Number.parseInt(ins.join('')),
        }));
    });

  const wire1Lines = plotLines(wires[0]);
  const wire2Lines = plotLines(wires[1]);

  const intersections = findIntersections(wire1Lines, wire2Lines);
  intersections.shift();

  let minDist = Number.MAX_SAFE_INTEGER;
  intersections.forEach(({ dist }) => {
    if (dist < minDist) {
      minDist = dist;
    }
  });

  // console.log(wire1Lines);
  // console.log(wire2Lines);
  // console.log(intersections);
  console.log(minDist); // 93654
}

function plotLines(instructions) {
  const lines = [];
  let pos = [0, 0, 0];
  lines.push(pos);
  instructions.forEach(({ dir, amnt }) => {
    const newPos = [...pos];
    if (dir === 'U') {
      newPos[0] -= amnt;
    } else if (dir === 'D') {
      newPos[0] += amnt;
    } else if (dir === 'L') {
      newPos[1] -= amnt;
    } else {
      newPos[1] += amnt;
    }
    newPos[2] += amnt;
    lines.push(newPos);
    pos = newPos;
  });
  return lines;
}


function findIntersections(lines1, lines2) {
  const intersections = [];
  for (let i = 0; i < lines1.length - 1; i++) {
    for (let j = 0; j < lines2.length - 1; j++) {
      // Find if lines[i] intersects with lines2[j]
      const s1 = {
        start: {
          x: lines1[i][0],
          y: lines1[i][1],
          dist: lines1[i][2],
        },
        end: {
          x: lines1[i + 1][0],
          y: lines1[i + 1][1],
          dist: lines1[i + 1][2],
        },
      };
      const s2 = {
        start: {
          x: lines2[j][0],
          y: lines2[j][1],
          dist: lines2[j][2],
        },
        end: {
          x: lines2[j + 1][0],
          y: lines2[j + 1][1],
          dist: lines2[j + 1][2],
        },
      };
      const intersect = intersects(s1, s2) || intersects(s2, s1);
      if (intersect) {
        intersections.push(intersect);
      }
    }
  }
  return intersections;
}

function intersects(s1, s2) {
  if (s1.start.y === s1.end.y && s2.start.x === s2.end.x) {
    if (
        (
          (s2.start.y <= s1.start.y && s2.end.y >= s1.start.y) &&
          (
            (s1.start.x <= s2.start.x && s1.end.x >= s2.start.x) ||
            (s1.end.x <= s2.start.x && s1.start.x >= s2.start.x)
          )
        ) ||
      (
        (s2.end.y <= s1.start.y && s2.start.y >= s1.start.y) &&
        (
          (s1.start.x <= s2.start.x && s1.end.x >= s2.start.x) ||
          (s1.end.x <= s2.start.x && s1.start.x >= s2.start.x)
        )
      )
    ) {
      return {
        x: s2.start.x,
        y: s1.start.y,
        dist: Math.abs(s1.start.dist)
          + Math.abs(s2.start.dist)
          + Math.abs(s2.start.y - s1.start.y)
          + Math.abs(s1.start.x - s2.start.x),
      };
    }
  }

  return null;
}
