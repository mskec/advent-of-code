// https://adventofcode.com/2021/day/2

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const instructions = input.split('\n');

  let horizontal = 0;
  let depth = 0;
  instructions.forEach(instruction => {
    const [command, unit] = instruction.trim().split(' ');
    if (command === 'forward') {
      horizontal += +unit;
    } else if (command === 'down') {
      depth += +unit;
    } else if (command === 'up') {
      depth -= +unit;
    }
  });
  console.log('Result:', { horizontal, depth, result: horizontal * depth });
}
