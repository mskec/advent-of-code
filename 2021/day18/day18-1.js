// https://adventofcode.com/2021/day/18

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

/**
 * Calculates snail number magnitude
 *   formula: 3 x left + 2 x right
 *   if any is an array => calc it's magnitude
 */
function magnitude(num) {
  let left = num[0]
  if (Array.isArray(left)) {
    left = magnitude(left);
  }
  let right = num[1];
  if (Array.isArray(right)) {
    right = magnitude(right);
  }
  return 3*left + 2*right;
}

function isRegularPair(num) {
  return Number.isInteger(num[0]) && Number.isInteger(num[1]);
}

/** Addition by forming a new pair [left, right] and reducing it */
function add(left, right) {
  const sum = [left, right];
  reduce(sum);
  return sum;
}

function reduce(num) {
  /*
     - if any pair is nested inside four pairs, the leftmost such pair explodes.
     - if any regular number is 10 or greater, the leftmost such regular number splits.
  */

  let didExplode = false;
  let didSplit = false;
  do {
    const explodeResult = findPairToExplode(num);
    didExplode = explodeResult.didExplode;

    if (!didExplode) {
      didSplit = checkAndSplit(num);
    }
  } while (didExplode || didSplit);
}

function findPairToExplode(num, depth = 0) {
  const res = { didExplode: false };

  if (isRegularPair(num)) {
    if (depth >= 4) {
      return { explode: true };
    }
    return res;
  }

  if (Array.isArray(num[0])) {
    const subRes = findPairToExplode(num[0], depth + 1);
    if (subRes.explode) {
      // explode num[0]
      // add num[0][1] to the first right regular value
      if (Number.isInteger(num[1])) {
        num[1] += num[0][1];
      } else {
        addToLeftmostValue(num[1], num[0][1]); // in the right sub-tree
      }
      // add num[0][0] to the first left regular value
      const leftExplode = num[0][0];
      // set num[0] to 0 (exploded)
      num[0] = 0;
      return { leftExplode, didExplode: true };
    } else if (Number.isInteger(subRes.rightExplode)) {
      if (Number.isInteger(num[1])) {
        num[1] += subRes.rightExplode;
      } else {
        addToLeftmostValue(num[1], subRes.rightExplode); // in the right sub-tree
      }
      return { didExplode: true };
    } else if (Number.isInteger(subRes.leftExplode)) {
      res.leftExplode = subRes.leftExplode;
    }
    res.didExplode = subRes.didExplode ?? false;
  }

  if (!res.didExplode && Array.isArray(num[1])) {
    const subRes = findPairToExplode(num[1], depth + 1);
    if (subRes.explode) {
      // explode num[1]
      // add num[1][0] to the first left regular value
      if (Number.isInteger(num[0])) {
        num[0] += num[1][0];
      } else {
        addToRightmostValue(num[0], num[1][0]); // in the left sub-tree
      }
      // add num[1][1] to the first right regular value
      const rightExplode = num[1][1];
      // set num[1] to 0 (exploded)
      num[1] = 0;
      return { rightExplode, didExplode: true };
    } else if (Number.isInteger(subRes.leftExplode)) {
      if (Number.isInteger(num[0])) {
        num[0] += subRes.leftExplode;
      } else {
        addToRightmostValue(num[0], subRes.leftExplode); // in the right sub-tree
      }
      return { didExplode: true };
    } else if (Number.isInteger(subRes.rightExplode)) {
      res.rightExplode = subRes.rightExplode;
    }
    res.didExplode = subRes.didExplode ?? false;
  }

  return res;
}

function addToRightmostValue(num, value) {
  if (!num) {
    console.log('addToRightmostValue return');
    return;
  }
  if (Number.isInteger(num[1])) {
    num[1] += value;
  } else {
    addToRightmostValue(num[1], value);
  }
}

function addToLeftmostValue(num, value) {
  if (!num) {
    console.log('addToLeftmostValue return');
    return;
  }
  if (Number.isInteger(num[0])) {
    num[0] += value;
  } else {
    addToLeftmostValue(num[0], value);
  }
}

function checkAndSplit(num) {
  if (!num) {
    return false;
  }

  const [left, right] = num;
  let didSplit = false;
  if (Array.isArray(left)) {
    didSplit = checkAndSplit(left);
  }
  if (!didSplit && Number.isInteger(left) && left >= 10) {
    num[0] = split(left);
    return true;
  }

  if (!didSplit && Array.isArray(right)) {
    didSplit = checkAndSplit(right);
  }
  if (!didSplit && Number.isInteger(right) && right >= 10) {
    num[1] = split(right);
    return true;
  }

  return didSplit;
}

/**
 * Split a regular number, replace it with a pair;
 *   - the left element of the pair should be the regular number divided by two and rounded down
 *   - the right element of the pair should be the regular number divided by two and rounded up
 */
function split(num) {
  return [Math.floor(num / 2), Math.ceil(num / 2)];
}

function run(input) {
  const numbers = input.split('\n').map(n => JSON.parse(n));

  let sum = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    sum = add(sum, numbers[i]);
    // console.log(i, JSON.stringify(sum));
  }

  const mag = magnitude(sum);
  console.log('number:', JSON.stringify(sum));
  console.log('magnitude:', mag);
}
