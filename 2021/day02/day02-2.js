// https://adventofcode.com/2021/day/2#part2

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const instructions = input.split('\n');

  let aim = 0;
  let horizontal = 0;
  let depth = 0;
  instructions.forEach(instruction => {
    const [command, unit] = instruction.trim().split(' ');
    if (command === 'forward') {
      horizontal += +unit;
      depth += aim * +unit;
    } else if (command === 'down') {
      aim += +unit;
    } else if (command === 'up') {
      aim -= +unit;
    }
  });
  console.log('Result:', { horizontal, depth, result: horizontal * depth });
}
