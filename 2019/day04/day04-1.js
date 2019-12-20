// https://adventofcode.com/2019/day/4

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const [rangeMin, rangeMax] = input.split('-').map(n => Number.parseInt(n));

  let count = 0;
  for (let i = rangeMin; i < rangeMax; i++) {
    const digits = i.toString().split('');

    let valid = true;
    let maxDigit = 0;
    for (let k = 0; k < digits.length; k++) {
      if (digits[k] < maxDigit) {
        valid = false;
      }
      maxDigit = digits[k];
    }
    // console.log(i, 'increasing', valid);

    let adjacent = 0;
    let hasAdjacent = false;
    for (let k = 1; k < digits.length; k++) {
      if (digits[k] === digits[k - 1]) {
        adjacent += 1;
      } else {
        if (adjacent > 0) {
          hasAdjacent = true;
        }
        adjacent = 0;
      }
    }
    if (!hasAdjacent && adjacent === 0) {
      valid = false;
    }

    if (valid) {
      console.log(i);
      count += 1;
    }
  }

  console.log(count); // 530
}
