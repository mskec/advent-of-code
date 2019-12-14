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

  console.log(
    'Manhattan distance to the closest intersection',
    findLowestManhattanDistance(intersections),
  );
}

function plotLines(instructions) {
  const lines = [];
  let pos = [0, 0];
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
      const s1 = [lines1[i], lines1[i + 1]];
      const s2 = [lines2[j], lines2[j + 1]];
      const intersect = intersects(s1, s2);
      if (intersect) {
        intersections.push(intersect);
      }
    }
  }
  return intersections;
}

function intersects(s1, s2) {
  if (s1[0][0] === s1[1][0] && s2[0][1] === s2[1][1]) {
    if (
      (
        (s2[0][0] <= s1[0][0] && s2[1][0] >= s1[0][0]) &&
        (s2[0][1] <= s1[0][1] && s2[1][1] >= s1[1][1])
      ) ||
      (
        (s2[1][0] <= s1[0][0] && s2[0][0] >= s1[0][0]) &&
        (s2[1][1] <= s1[0][1] && s2[0][1] >= s1[1][1])
      )
    ) {
      return { x: s1[0][0], y: s2[0][1] }
    }
  } else if (s2[0][0] === s2[1][0] && s1[0][1] === s1[1][1]) {
    if (
      (
        (s1[0][0] <= s2[0][0] && s1[1][0] >= s2[0][0]) &&
        (s1[0][1] <= s2[0][1] && s1[1][1] >= s2[1][1])
      ) ||
      (
        (s1[1][0] <= s2[0][0] && s1[0][0] >= s2[0][0]) &&
        (s1[1][1] <= s2[0][1] && s1[0][1] >= s2[1][1])
      )
    ) {
      return { x: s2[0][0], y: s1[0][1] };
    }
  }

  return null;
}

function findLowestManhattanDistance(intersections) {
  let minDistance = Number.MAX_SAFE_INTEGER;
  intersections.forEach(({ x, y }) => {
    const distance = Math.abs(x) + Math.abs(y);
    if (distance < minDistance) {
      minDistance = distance;
    }
  });
  return minDistance;
}


// TODO: not used
function doIntersect(p1, q1, p2, q2) {
  // Find the four orientations needed for general and
  // special cases
  const o1 = orientation(p1, q1, p2);
  const o2 = orientation(p1, q1, q2);
  const o3 = orientation(p2, q2, p1);
  const o4 = orientation(p2, q2, q1);

  // General case
  if (o1 !== o2 && o3 !== o4) {
    return true;
  }

  // Special Cases
  // p1, q1 and p2 are colinear and p2 lies on segment p1q1
  if (o1 === 0 && onSegment(p1, p2, q1)) return true;

  // p1, q1 and q2 are colinear and q2 lies on segment p1q1
  if (o2 === 0 && onSegment(p1, q2, q1)) return true;

  // p2, q2 and p1 are colinear and p1 lies on segment p2q2
  if (o3 === 0 && onSegment(p2, p1, q2)) return true;

  // p2, q2 and q1 are colinear and q1 lies on segment p2q2
  if (o4 === 0 && onSegment(p2, q1, q2)) return true;

  return false; // Doesn't fall in any of the above cases
}

// Given three collinear points p, q, r, the function checks if
// point q lies on line segment 'pr'
function onSegment(p, q, r) {
  if (
    q[0] <= Math.max(p[0], r[0]) &&
    q[0] >= Math.min(p[0], r[0]) &&
    q[1] <= Math.max(p[1], r[1]) &&
    q[1] >= Math.min(p[1], r[1])
  ) {
    return true;
  }

  return false;
}

// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are collinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function orientation(p, q, r) {
  const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
  if (val === 0) {
    return 0; // collinear
  }
  return val > 0 ? 1 : 2; // clock or counter-clock wise
}
