// https://adventofcode.com/2021/day/8

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const lines = input.split('\n');

  let cnt = 0;
  lines.forEach(line => {
    const [signals, output] = line.split(' | ');
    const digits = output.split(' ');
    digits.forEach(digit => {
      if ([2, 4, 3, 7].includes(digit.length)) {
        cnt += 1;
      }
    });
  });

  console.log('result:', cnt);
}
